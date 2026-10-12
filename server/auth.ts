import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { SignJWT, jwtVerify } from "jose";
import type { Request } from "express";
import * as db from "./db";
import { ENV, hashPassword, verifyPassword } from "./_core/env";

export type AdminPrincipal = {
  id: number;
  username: string;
  role: "admin";
};

export type SessionPayload = {
  sub: number;
  username: string;
  role: "admin";
};

const secretEncoder = () => new TextEncoder().encode(ENV.jwtSecret);

function textEnv(name: string): string {
  const value = process.env[name];
  return typeof value === "string" ? value : "";
}

/**
 * يضمن وجود صف admin في جدول users، بكلمة سر مأخوذة من ADMIN_PASSWORD.
 * يُستدعى مرة واحدة عند الإقلاع (bootstrapping).
 */
export async function ensureAdminUser(): Promise<void> {
  const adminPassword = textEnv("ADMIN_PASSWORD");
  if (!adminPassword) {
    console.warn("[Auth] ADMIN_PASSWORD not set; admin user cannot be created.");
    return;
  }

  try {
    const existing = await db.getUserByUsername(ENV.adminUsername);
    const passwordHash = hashPassword(adminPassword);
    if (!existing) {
      await db.upsertUser({
        username: ENV.adminUsername,
        passwordHash,
        role: "admin",
        lastSignedIn: new Date(),
      });
      console.log(`[Auth] Created admin user "${ENV.adminUsername}".`);
      return;
    }
    if (!verifyPassword(adminPassword, existing.passwordHash)) {
      await db.upsertUser({
        username: ENV.adminUsername,
        passwordHash,
        role: "admin",
      });
      console.log(`[Auth] Updated password hash for admin "${ENV.adminUsername}".`);
    }
  } catch (error) {
    console.error("[Auth] Failed to ensure admin user:", error);
  }
}

/**
 * يتحقّق من اسم المستخدم وكلمة السر ويُصدر JWT عند النجاح.
 */
export async function authenticateByCredentials(
  username: string,
  password: string
): Promise<{ token: string; principal: AdminPrincipal } | null> {
  const row = await db.getUserByUsername(username);
  if (!row) return null;
  if (!verifyPassword(password, row.passwordHash)) return null;
  await db.upsertUser({
    username: row.username,
    passwordHash: row.passwordHash,
    lastSignedIn: new Date(),
  });
  const principal: AdminPrincipal = {
    id: row.id,
    username: row.username,
    role: "admin",
  };
  const token = await signSession({
    sub: principal.id,
    username: principal.username,
    role: principal.role,
  }, { expiresInMs: ONE_YEAR_MS });
  return { token, principal };
}

export async function signSession(
  payload: SessionPayload,
  options: { expiresInMs?: number } = {}
): Promise<string> {
  const issuedAt = Date.now();
  const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
  const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1000);
  const secret = secretEncoder();

  return new SignJWT({
    // `sub` per RFC7519 must be a string; encode numeric ids as strings.
    sub: String(payload.sub),
    username: payload.username,
    role: payload.role,
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(expirationSeconds)
    .sign(secret);
}

export async function verifySession(
  token: string | undefined | null
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const secret = secretEncoder();
    const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });
    const sub = payload.sub;
    const username = payload.username;
    const role = payload.role;
    if (typeof sub !== "number" || typeof username !== "string" || role !== "admin") {
      return null;
    }
    return { sub, username, role: "admin" };
  } catch {
    return null;
  }
}

/**
 * يستخرج JWT من cookie أو Authorization header ويُحقّق.
 */
export async function authenticateRequest(req: Request): Promise<AdminPrincipal | null> {
  let token: string | undefined;

  if (req.cookies && typeof req.cookies[COOKIE_NAME] === "string") {
    token = req.cookies[COOKIE_NAME];
  }

  if (!token) {
    const authHeader = req.headers.authorization;
    if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
      token = authHeader.slice(7);
    }
  }

  if (!token) return null;

  const session = await verifySession(token);
  if (!session) return null;

  return {
    id: session.sub,
    username: session.username,
    role: "admin",
  };
}

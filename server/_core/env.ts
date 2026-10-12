import { scryptSync, randomBytes, timingSafeEqual } from "node:crypto";

function readEnv(key: string): string {
  return process.env[key] ?? "";
}

export const ENV = {
  databaseUrl: readEnv("DATABASE_URL"),
  isProduction: process.env.NODE_ENV === "production",
  jwtSecret: readEnv("JWT_SECRET") || "acsd-local-dev-secret-change-me",
  uploadsDir: readEnv("UPLOADS_DIR") || "./uploads",
  publicUploadsPath: "/uploads",
  adminUsername: readEnv("ADMIN_USERNAME") || "admin",
  adminPassword: readEnv("ADMIN_PASSWORD") || "changeme-please-set-env",
};

const SCRYPT_KEYLEN = 64;

/**
 * يحوّل كلمة السر إلى hash باستخدام scrypt مع salt عشوائي.
 * الصيغة: scrypt$N$r$p$saltHash$derivedKeyHash (base64).
 */
export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const derived = scryptSync(password, salt, SCRYPT_KEYLEN);
  return `scrypt$${salt.toString("base64")}$${derived.toString("base64")}`;
}

/**
 * يتحقّق من كلمة السر مقابل الـhash المخزّن.
 * يعيد true عند التطابق، false عند أي خطأ.
 */
export function verifyPassword(password: string, stored: string): boolean {
  const parts = stored.split("$");
  if (parts.length !== 4 || parts[0] !== "scrypt") return false;
  const saltB64 = parts[2];
  const derivedB64 = parts[3];
  if (!saltB64 || !derivedB64) return false;
  let salt: Buffer;
  let expected: Buffer;
  try {
    salt = Buffer.from(saltB64, "base64");
    expected = Buffer.from(derivedB64, "base64");
  } catch {
    return false;
  }
  if (expected.length !== SCRYPT_KEYLEN) return false;
  const derived = scryptSync(password, salt, SCRYPT_KEYLEN);
  return timingSafeEqual(derived, expected);
}

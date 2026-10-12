import fs from "node:fs/promises";
import path from "node:path";
import { createHash, randomUUID } from "node:crypto";
import { ENV } from "./_core/env";

function ensureDir(dir: string) {
  return fs.mkdir(dir, { recursive: true });
}

function joinUploads(relKey: string): string {
  const cleaned = relKey.replace(/^\/+/, "");
  if (cleaned.includes("..")) {
    throw new Error("Invalid storage key: path traversal detected");
  }
  return path.join(ENV.uploadsDir, cleaned);
}

function appendHashSuffix(relKey: string): string {
  const hash = randomUUID().replace(/-/g, "").slice(0, 8);
  const lastDot = relKey.lastIndexOf(".");
  if (lastDot === -1) return `${relKey}_${hash}`;
  return `${relKey.slice(0, lastDot)}_${hash}${relKey.slice(lastDot)}`;
}

/**
 * يكتب ملفاً إلى مجلد uploads/ ويعيد المسار العلني /uploads/... الذي
 * يقدّمه الخادم عبر express.static.
 */
export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream"
): Promise<{ key: string; url: string; checksum: string }> {
  const key = appendHashSuffix(relKey.replace(/^\/+/, ""));
  const target = joinUploads(key);
  await ensureDir(path.dirname(target));

  const buffer = typeof data === "string" ? Buffer.from(data, "utf-8") : Buffer.from(data);
  await fs.writeFile(target, buffer);

  const checksum = createHash("sha256").update(buffer).digest("hex");
  return { key, url: `${ENV.publicUploadsPath}/${key}`, checksum };
}

export async function storageDelete(relKey: string): Promise<void> {
  const target = joinUploads(relKey);
  try {
    await fs.unlink(target);
  } catch (error: unknown) {
    const err = error as NodeJS.ErrnoException;
    if (err.code !== "ENOENT") throw err;
  }
}

/**
 * يبني رابطاً عاماً لملف موجود في uploads/. لا يتحقّق من وجود الملف.
 */
export function storageGetUrl(relKey: string): string {
  const cleaned = relKey.replace(/^\/+/, "");
  return `${ENV.publicUploadsPath}/${cleaned}`;
}

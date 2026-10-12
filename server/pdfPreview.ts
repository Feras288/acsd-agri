import type { Express, Request, Response } from "express";
import fs from "node:fs";
import path from "node:path";
import * as db from "./db";
import { ENV } from "./_core/env";

const STORAGE_PREFIX = `${ENV.publicUploadsPath}/`;

export function storageKeyFromUrl(url: string | null | undefined) {
  if (!url?.startsWith(STORAGE_PREFIX)) return null;
  const key = url.slice(STORAGE_PREFIX.length);
  return key && !key.includes("..") && !path.isAbsolute(key) ? key : null;
}

function sendPreviewError(res: Response, status: number, message: string) {
  res.status(status).json({ error: message });
}

function safeResolveOnDisk(key: string): string | null {
  const uploadsRoot = path.resolve(ENV.uploadsDir);
  const target = path.resolve(uploadsRoot, key);
  if (!target.startsWith(uploadsRoot + path.sep) && target !== uploadsRoot) {
    return null;
  }
  return target;
}

function streamPdfPreview(req: Request, res: Response) {
  const documentId = Number(req.params.id);
  if (!Number.isSafeInteger(documentId) || documentId <= 0) {
    sendPreviewError(res, 400, "Invalid document id");
    return;
  }

  void (async () => {
    const document = await db.getPublishedDocumentById(documentId);
    const storageKey = storageKeyFromUrl(document?.imageUrl);
    if (!document || !storageKey || !/\.pdf$/i.test(storageKey)) {
      sendPreviewError(res, 404, "PDF document not found");
      return;
    }

    const filePath = safeResolveOnDisk(storageKey);
    if (!filePath) {
      sendPreviewError(res, 400, "Invalid storage path");
      return;
    }

    try {
      await fs.promises.access(filePath, fs.constants.R_OK);
    } catch {
      sendPreviewError(res, 404, "PDF file missing on disk");
      return;
    }

    const stat = await fs.promises.stat(filePath);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Length", String(stat.size));
    res.setHeader("Content-Disposition", "inline");
    res.setHeader("Accept-Ranges", "bytes");
    res.setHeader("Cache-Control", "private, max-age=60");
    res.setHeader("X-Content-Type-Options", "nosniff");

    const rangeHeader = typeof req.headers.range === "string" ? req.headers.range : undefined;
    if (rangeHeader) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader.trim());
      if (match) {
        const start = match[1] ? Number(match[1]) : 0;
        const end = match[2] ? Number(match[2]) : stat.size - 1;
        if (start >= 0 && end >= start && end < stat.size) {
          res.status(206);
          res.setHeader("Content-Range", `bytes ${start}-${end}/${stat.size}`);
          fs.createReadStream(filePath, { start, end }).pipe(res);
          return;
        }
      }
    }

    res.status(200);
    fs.createReadStream(filePath).pipe(res);
  })().catch(error => {
    console.error("[PDF Preview] Unexpected preview error", error);
    if (!res.headersSent) sendPreviewError(res, 500, "Unable to prepare PDF preview");
  });
}

export function registerPdfPreviewRoute(app: Express) {
  app.get("/api/documents/:id/preview", (req, res) => {
    streamPdfPreview(req, res);
  });
}

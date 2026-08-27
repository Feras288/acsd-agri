import { desc, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  contactAttachments,
  contactReplies,
  contactMessages,
  contentItems,
  eventRegistrations,
  InsertContactMessage,
  InsertContactAttachment,
  InsertContactReply,
  InsertContentItem,
  InsertEventRegistration,
  InsertUser,
  users,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function listPublishedContent() {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(contentItems)
    .where(eq(contentItems.status, "published"))
    .orderBy(desc(contentItems.eventStartsAt), desc(contentItems.publishedAt));
}

export async function listAllContent() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(contentItems).orderBy(desc(contentItems.updatedAt));
}

export async function getPublishedContentById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(contentItems)
    .where(eq(contentItems.id, id))
    .limit(1);
  const item = result[0];
  return item?.status === "published" ? item : undefined;
}

export async function getPublishedEventById(id: number) {
  const item = await getPublishedContentById(id);
  return item?.type === "event" ? item : undefined;
}

export async function getPublishedDocumentById(id: number) {
  const item = await getPublishedContentById(id);
  return item?.type === "document" ? item : undefined;
}

export async function incrementDocumentDownload(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.update(contentItems).set({ downloadCount: sql`${contentItems.downloadCount} + 1` }).where(eq(contentItems.id, id));
  const result = await db.select({ downloadCount: contentItems.downloadCount }).from(contentItems).where(eq(contentItems.id, id)).limit(1);
  return result[0]?.downloadCount ?? 0;
}

export async function createContentItem(item: InsertContentItem) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const result = await db.insert(contentItems).values(item);
  return Number(result[0].insertId);
}

export async function updateContentItem(id: number, item: Partial<InsertContentItem>) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.update(contentItems).set(item).where(eq(contentItems.id, id));
}

export async function deleteContentItem(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.delete(contentItems).where(eq(contentItems.id, id));
}

export async function createEventRegistration(registration: InsertEventRegistration) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const result = await db.insert(eventRegistrations).values(registration);
  return Number(result[0].insertId);
}

export async function listEventRegistrations() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(eventRegistrations).orderBy(desc(eventRegistrations.createdAt));
}

export async function createContactMessage(message: InsertContactMessage) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const result = await db.insert(contactMessages).values(message);
  return Number(result[0].insertId);
}

export async function listContactMessages() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
}

export async function getContactMessageById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(contactMessages).where(eq(contactMessages.id, id)).limit(1);
  return result[0];
}

export async function markContactMessageRead(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.update(contactMessages).set({ status: "read" }).where(eq(contactMessages.id, id));
}

export async function listContactReplies() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(contactReplies).orderBy(desc(contactReplies.sentAt));
}

export async function createContactReply(reply: InsertContactReply) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const result = await db.insert(contactReplies).values(reply);
  return Number(result[0].insertId);
}

export async function markContactMessageReplied(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.update(contactMessages).set({ status: "replied" }).where(eq(contactMessages.id, id));
}

export async function createContactAttachment(attachment: InsertContactAttachment) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const result = await db.insert(contactAttachments).values(attachment);
  return Number(result[0].insertId);
}

export async function listContactAttachments() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(contactAttachments).orderBy(desc(contactAttachments.uploadedAt));
}

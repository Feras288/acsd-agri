import { int, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * أخبار الجمعية وفعالياتها. تُحفظ الأخبار والفعاليات في جدول واحد لتشاركهما
 * دورة النشر والتحرير، مع تاريخ اختياري خاص بالفعاليات القادمة.
 */
export const contentItems = mysqlTable("contentItems", {
  id: int("id").autoincrement().primaryKey(),
  type: mysqlEnum("type", ["news", "event", "achievement", "document"]).notNull(),
  title: varchar("title", { length: 240 }).notNull(),
  summary: text("summary").notNull(),
  body: text("body"),
  imageUrl: text("imageUrl"),
  status: mysqlEnum("status", ["draft", "published"]).default("published").notNull(),
  publishedAt: timestamp("publishedAt").defaultNow().notNull(),
  eventStartsAt: timestamp("eventStartsAt"),
  eventLocation: varchar("eventLocation", { length: 240 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/** رسائل الزوار الواردة من نموذج التواصل العام. */
export const contactMessages = mysqlTable("contactMessages", {
  id: int("id").autoincrement().primaryKey(),
  senderName: varchar("senderName", { length: 160 }).notNull(),
  senderEmail: varchar("senderEmail", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 48 }),
  subject: varchar("subject", { length: 240 }).notNull(),
  message: text("message").notNull(),
  status: mysqlEnum("status", ["new", "read", "replied"]).default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

/** سجل الردود المرسلة من لوحة الإدارة؛ قد تحتوي الرسالة على أكثر من متابعة. */
export const contactReplies = mysqlTable("contactReplies", {
  id: int("id").autoincrement().primaryKey(),
  messageId: int("messageId").notNull().references(() => contactMessages.id, { onDelete: "cascade" }),
  body: text("body").notNull(),
  sentAt: timestamp("sentAt").defaultNow().notNull(),
});

/** بيانات المرفقات؛ تُخزّن الملفات في التخزين الآمن ويُحفظ هنا مرجعها فقط. */
export const contactAttachments = mysqlTable("contactAttachments", {
  id: int("id").autoincrement().primaryKey(),
  messageId: int("messageId").notNull().references(() => contactMessages.id, { onDelete: "cascade" }),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  storageKey: varchar("storageKey", { length: 512 }).notNull(),
  fileUrl: text("fileUrl").notNull(),
  mimeType: varchar("mimeType", { length: 160 }).notNull(),
  fileSize: int("fileSize").notNull(),
  uploadedAt: timestamp("uploadedAt").defaultNow().notNull(),
});

/** تسجيلات الزوار للفعاليات المنشورة القادمة. */
export const eventRegistrations = mysqlTable("eventRegistrations", {
  id: int("id").autoincrement().primaryKey(),
  eventId: int("eventId").notNull().references(() => contentItems.id, { onDelete: "cascade" }),
  attendeeName: varchar("attendeeName", { length: 160 }).notNull(),
  attendeeEmail: varchar("attendeeEmail", { length: 320 }).notNull(),
  attendeePhone: varchar("attendeePhone", { length: 48 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => ({
  oneRegistrationPerEmail: uniqueIndex("event_registration_unique").on(table.eventId, table.attendeeEmail),
}));

export type ContentItem = typeof contentItems.$inferSelect;
export type InsertContentItem = typeof contentItems.$inferInsert;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = typeof contactMessages.$inferInsert;
export type ContactReply = typeof contactReplies.$inferSelect;
export type InsertContactReply = typeof contactReplies.$inferInsert;
export type ContactAttachment = typeof contactAttachments.$inferSelect;
export type InsertContactAttachment = typeof contactAttachments.$inferInsert;
export type EventRegistration = typeof eventRegistrations.$inferSelect;
export type InsertEventRegistration = typeof eventRegistrations.$inferInsert;

import { beforeEach, describe, expect, it, vi } from "vitest";

const dbMocks = vi.hoisted(() => ({
  createContentItem: vi.fn(async () => 31),
  createContactMessage: vi.fn(async () => 42),
  createContactAttachment: vi.fn(async () => 88),
  createContactReply: vi.fn(async () => 73),
  getContactMessageById: vi.fn(),
  listAllContent: vi.fn(async () => []),
  listContactMessages: vi.fn(async () => []),
  listContactAttachments: vi.fn(async () => []),
  listContactReplies: vi.fn(async () => []),
  listPublishedContent: vi.fn(async () => []),
  markContactMessageRead: vi.fn(async () => undefined),
  markContactMessageReplied: vi.fn(async () => undefined),
  deleteContentItem: vi.fn(async () => undefined),
  updateContentItem: vi.fn(async () => undefined),
}));

const emailMocks = vi.hoisted(() => ({
  sendContactNotification: vi.fn(async () => undefined),
  sendContactReply: vi.fn(async () => undefined),
}));

vi.mock("./db", () => dbMocks);
vi.mock("./email", () => emailMocks);
vi.mock("./storage", () => ({
  storagePut: vi.fn(async () => ({ key: "contact-messages/42/verification.pdf", url: "/manus-storage/contact-messages/42/verification.pdf" })),
}));

import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const administratorContext = {
  user: {
    id: 1,
    openId: "association-admin",
    email: "info@acsd.sa",
    name: "مدير الجمعية",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  },
  req: { protocol: "https", headers: {} },
  res: { clearCookie: vi.fn() },
} as unknown as TrpcContext;

const publicContext = {
  user: null,
  req: { protocol: "https", headers: {} },
  res: { clearCookie: vi.fn() },
} as unknown as TrpcContext;

describe("content and contact procedures", () => {
  beforeEach(() => vi.clearAllMocks());

  it("allows an administrator to create a published event", async () => {
    const caller = appRouter.createCaller(administratorContext);
    const result = await caller.content.create({
      type: "event",
      title: "ورشة الممارسات الزراعية المستدامة",
      summary: "جلسة عملية لمشاركة المعرفة حول إدارة الموارد الزراعية بكفاءة.",
      imageUrl: "",
      status: "published",
      eventStartsAt: Date.now() + 86_400_000,
      eventLocation: "مقر الجمعية",
    });

    expect(result).toEqual({ id: 31 });
    expect(dbMocks.createContentItem).toHaveBeenCalledWith(expect.objectContaining({ type: "event", status: "published" }));
  });

  it("stores an incoming contact message and sends a notification", async () => {
    const caller = appRouter.createCaller(publicContext);
    const result = await caller.contact.submit({
      senderName: "مستفيد تجريبي",
      senderEmail: "visitor@example.com",
      phone: "",
      subject: "استفسار عن مبادرات الجمعية",
      message: "أرغب في معرفة المزيد عن البرامج التدريبية والمبادرات المتاحة للمزارعين.",
    });

    expect(result).toEqual({ success: true, delivered: true, messageId: 42, attachmentCount: 0 });
    expect(dbMocks.createContactMessage).toHaveBeenCalledOnce();
    expect(emailMocks.sendContactNotification).toHaveBeenCalledOnce();
  });

  it("stores an allowed attachment through secure storage", async () => {
    const caller = appRouter.createCaller(publicContext);
    const result = await caller.contact.submit({
      senderName: "مستفيد تجريبي",
      senderEmail: "visitor@example.com",
      phone: "",
      subject: "إرسال وثيقة للمراجعة",
      message: "أرفق هذه الوثيقة للاطلاع عليها ضمن طلب التعاون مع الجمعية.",
      attachments: [{
        name: "verification.pdf",
        type: "application/pdf",
        size: 5,
        base64: "cHJvb2Y=",
      }],
    });

    expect(result).toEqual({ success: true, delivered: true, messageId: 42, attachmentCount: 1 });
    expect(dbMocks.createContactAttachment).toHaveBeenCalledWith(expect.objectContaining({
      messageId: 42,
      fileName: "verification.pdf",
      fileUrl: "/manus-storage/contact-messages/42/verification.pdf",
      mimeType: "application/pdf",
      fileSize: 5,
    }));
  });

  it("rejects contact messages that do not contain enough detail", async () => {
    const caller = appRouter.createCaller(publicContext);
    await expect(caller.contact.submit({
      senderName: "أ",
      senderEmail: "not-an-email",
      phone: "",
      subject: "س",
      message: "قصير",
    })).rejects.toThrow();
  });

  it("records the sent reply and marks its source message as replied", async () => {
    dbMocks.getContactMessageById.mockResolvedValue({
      id: 9,
      senderName: "صاحب الطلب",
      senderEmail: "visitor@example.com",
      subject: "طلب معلومات",
    });
    const caller = appRouter.createCaller(administratorContext);

    const result = await caller.contact.reply({
      id: 9,
      body: "نشكر تواصلكم، وسيقوم فريق الجمعية بالمتابعة معكم قريبًا.",
    });

    expect(result).toEqual({ success: true, replyId: 73 });
    expect(emailMocks.sendContactReply).toHaveBeenCalledOnce();
    expect(dbMocks.createContactReply).toHaveBeenCalledWith({
      messageId: 9,
      body: "نشكر تواصلكم، وسيقوم فريق الجمعية بالمتابعة معكم قريبًا.",
    });
    expect(dbMocks.markContactMessageReplied).toHaveBeenCalledWith(9);
  });
});

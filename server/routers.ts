import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import * as db from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import { sendContactNotification, sendContactReply } from "./email";
import { storagePut } from "./storage";

const contentInput = z.object({
  type: z.enum(["news", "event"]),
  title: z.string().trim().min(5).max(240),
  summary: z.string().trim().min(15).max(3000),
  imageUrl: z.string().url().optional().or(z.literal("")),
  status: z.enum(["draft", "published"]),
  eventStartsAt: z.number().int().positive().optional().nullable(),
  eventLocation: z.string().trim().max(240).optional().or(z.literal("")),
});

const MAX_ATTACHMENT_COUNT = 3;
const MAX_ATTACHMENT_SIZE = 5 * 1024 * 1024;
const allowedAttachmentTypes = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
] as const;

const attachmentInput = z.object({
  name: z.string().trim().min(1).max(255),
  type: z.enum(allowedAttachmentTypes),
  size: z.number().int().positive().max(MAX_ATTACHMENT_SIZE),
  base64: z.string().min(4).max(7_000_000).regex(/^[A-Za-z0-9+/]+={0,2}$/),
});

const toSafeFileName = (fileName: string) =>
  fileName.replace(/[^A-Za-z0-9._-]/g, "_").replace(/_+/g, "_").slice(0, 180);

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  content: router({
    publicList: publicProcedure.query(() => db.listPublishedContent()),
    adminList: adminProcedure.query(() => db.listAllContent()),
    create: adminProcedure.input(contentInput).mutation(async ({ input }) => {
      return {
        id: await db.createContentItem({
          ...input,
          imageUrl: input.imageUrl || null,
          eventLocation: input.eventLocation || null,
          eventStartsAt: input.eventStartsAt ? new Date(input.eventStartsAt) : null,
        }),
      };
    }),
    update: adminProcedure.input(contentInput.extend({ id: z.number().int().positive() })).mutation(async ({ input }) => {
      const { id, ...item } = input;
      await db.updateContentItem(id, {
        ...item,
        imageUrl: item.imageUrl || null,
        eventLocation: item.eventLocation || null,
        eventStartsAt: item.eventStartsAt ? new Date(item.eventStartsAt) : null,
      });
      return { success: true } as const;
    }),
    delete: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ input }) => {
      await db.deleteContentItem(input.id);
      return { success: true } as const;
    }),
  }),
  contact: router({
    submit: publicProcedure.input(z.object({
      senderName: z.string().trim().min(2).max(160),
      senderEmail: z.string().trim().email().max(320),
      phone: z.string().trim().max(48).optional().or(z.literal("")),
      subject: z.string().trim().min(3).max(240),
      message: z.string().trim().min(10).max(5000),
      attachments: z.array(attachmentInput).max(MAX_ATTACHMENT_COUNT).default([]),
    })).mutation(async ({ input }) => {
      const { attachments, ...contactInput } = input;
      const messageId = await db.createContactMessage({
        ...contactInput,
        phone: contactInput.phone || null,
      });

      for (const attachment of attachments) {
        const fileBuffer = Buffer.from(attachment.base64, "base64");
        if (fileBuffer.length !== attachment.size || fileBuffer.length > MAX_ATTACHMENT_SIZE) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid attachment size" });
        }

        const fileName = toSafeFileName(attachment.name);
        const stored = await storagePut(
          `contact-messages/${messageId}/${crypto.randomUUID()}-${fileName}`,
          fileBuffer,
          attachment.type,
        );
        await db.createContactAttachment({
          messageId,
          fileName,
          storageKey: stored.key,
          fileUrl: stored.url,
          mimeType: attachment.type,
          fileSize: fileBuffer.length,
        });
      }

      let delivered = false;
      try {
        await sendContactNotification(contactInput);
        delivered = true;
      } catch (error) {
        console.error("[Contact] Message stored but email notification failed", error);
      }

      return { success: true, delivered, messageId, attachmentCount: attachments.length } as const;
    }),
    adminList: adminProcedure.query(() => db.listContactMessages()),
    adminAttachments: adminProcedure.query(() => db.listContactAttachments()),
    adminReplies: adminProcedure.query(() => db.listContactReplies()),
    markRead: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ input }) => {
      await db.markContactMessageRead(input.id);
      return { success: true } as const;
    }),
    reply: adminProcedure.input(z.object({
      id: z.number().int().positive(),
      body: z.string().trim().min(5).max(5000),
    })).mutation(async ({ input }) => {
      const message = await db.getContactMessageById(input.id);
      if (!message) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Contact message not found" });
      }

      await sendContactReply({
        recipientName: message.senderName,
        recipientEmail: message.senderEmail,
        originalSubject: message.subject,
        body: input.body,
      });
      const replyId = await db.createContactReply({ messageId: input.id, body: input.body });
      await db.markContactMessageReplied(input.id);
      return { success: true, replyId } as const;
    }),
  }),
});

export type AppRouter = typeof appRouter;

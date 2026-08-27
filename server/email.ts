import nodemailer from "nodemailer";

const recipientAddress = "info@acsd.sa";

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT);
  const user = process.env.SMTP_USERNAME;
  const pass = process.env.SMTP_PASSWORD;

  if (!host || !port || !user || !pass) {
    throw new Error("SMTP settings are incomplete");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

/** يتحقق من إمكانية المصادقة مع خادم البريد دون إرسال رسالة. */
export async function verifySmtpTransport() {
  const transporter = createTransporter();
  return transporter.verify();
}

type IncomingContact = {
  senderName: string;
  senderEmail: string;
  phone?: string | null;
  subject: string;
  message: string;
};

export async function sendContactNotification(contact: IncomingContact) {
  const transporter = createTransporter();
  const from = process.env.SMTP_FROM || recipientAddress;
  const phoneLine = contact.phone ? `الهاتف: ${contact.phone}` : "الهاتف: لم يُذكر";

  await transporter.sendMail({
    from,
    to: recipientAddress,
    replyTo: contact.senderEmail,
    subject: `رسالة جديدة من نموذج الموقع: ${contact.subject}`,
    text: `وصلت رسالة جديدة عبر موقع الجمعية التعاونية الزراعية للتطوير والاستدامة.\n\nالاسم: ${contact.senderName}\nالبريد: ${contact.senderEmail}\n${phoneLine}\nالموضوع: ${contact.subject}\n\nالرسالة:\n${contact.message}`,
  });
}

type ReplyInput = {
  recipientName: string;
  recipientEmail: string;
  originalSubject: string;
  body: string;
};

export async function sendContactReply(reply: ReplyInput) {
  const transporter = createTransporter();
  const from = process.env.SMTP_FROM || recipientAddress;

  await transporter.sendMail({
    from,
    to: reply.recipientEmail,
    subject: `رد الجمعية: ${reply.originalSubject}`,
    text: `الأستاذ/ة ${reply.recipientName}،\n\n${reply.body}\n\nمع التحية،\nالجمعية التعاونية الزراعية للتطوير والاستدامة`,
  });
}

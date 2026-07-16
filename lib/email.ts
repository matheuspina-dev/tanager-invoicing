import { Resend } from "resend";

let client: Resend | null = null;

function getClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("Email is not configured: missing RESEND_API_KEY");
  }
  if (!client) {
    client = new Resend(apiKey);
  }
  return client;
}

export function platformSender(): string {
  const from = process.env.EMAIL_FROM;
  if (!from) {
    throw new Error("Email is not configured: missing EMAIL_FROM");
  }
  return from;
}

export function companySender(companyName: string): string {
  const base = platformSender();
  const match = base.match(/<([^>]+)>/);
  const address = match ? match[1] : base.trim();
  const cleanName = companyName.replace(/[<>"]/g, "").trim();
  return cleanName ? `${cleanName} <${address}>` : base;
}

export async function sendEmail(options: {
  to: string;
  subject: string;
  text: string;
  from?: string;
  replyTo?: string;
  attachments?: { filename: string; content: Buffer }[];
}) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(options.to)) {
    throw new Error("Invalid recipient email address");
  }

  const { error } = await getClient().emails.send({
    from: options.from ?? platformSender(),
    to: options.to,
    subject: options.subject,
    text: options.text,
    replyTo: options.replyTo,
    attachments: options.attachments?.map((a) => ({
      filename: a.filename,
      content: a.content,
    })),
  });

  if (error) {
    throw new Error(`Failed to send email: ${error.message}`);
  }
}

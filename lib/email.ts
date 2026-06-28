import { ClientSecretCredential } from "@azure/identity";

let credential: ClientSecretCredential | null = null;

function getCredential(): ClientSecretCredential {
  if (!credential) {
    const tenantId = process.env.TENANT_ID;
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;

    if (!tenantId || !clientId || !clientSecret) {
      throw new Error(
        "Email is not configured: missing TENANT_ID, CLIENT_ID, or CLIENT_SECRET"
      );
    }

    credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
  }
  return credential;
}

async function getAccessToken() {
  const token = await getCredential().getToken(
    "https://graph.microsoft.com/.default"
  );
  if (!token?.token) throw new Error("Failed to get access token");
  return token.token;
}

export async function sendEmail(options: {
  to: string;
  subject: string;
  text: string;
  attachments?: { filename: string; content: Buffer }[];
}) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(options.to)) {
    throw new Error("Invalid recipient email address");
  }

  if (!process.env.SMTP_USER) {
    throw new Error("Email is not configured: missing SMTP_USER");
  }

  const accessToken = await getAccessToken();

  const attachments =
    options.attachments?.map((a) => ({
      "@odata.type": "#microsoft.graph.fileAttachment",
      name: a.filename,
      contentBytes: a.content.toString("base64"),
    })) || [];

  const res = await fetch(
    `https://graph.microsoft.com/v1.0/users/${process.env.SMTP_USER}/sendMail`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: {
          subject: options.subject,
          body: {
            contentType: "Text",
            content: options.text,
          },
          toRecipients: [{ emailAddress: { address: options.to } }],
          attachments,
        },
      }),
    }
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Graph sendMail failed: ${error}`);
  }
}

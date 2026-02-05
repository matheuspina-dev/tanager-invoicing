import { ClientSecretCredential } from "@azure/identity";

const credential = new ClientSecretCredential(
  process.env.TENANT_ID!,
  process.env.CLIENT_ID!,
  process.env.CLIENT_SECRET!
);

async function getAccessToken() {
  const token = await credential.getToken(
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

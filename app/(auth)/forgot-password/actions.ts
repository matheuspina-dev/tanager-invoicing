"use server";

import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { sendEmail } from "@/lib/email";

export async function requestPasswordReset(formData: FormData) {
  const email = formData.get("email")?.toString();
  if (!email) return;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return;

  const token = crypto.randomBytes(32).toString("hex");
  const expiry = new Date(Date.now() + 3600000);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetToken: token,
      resetTokenExpiry: expiry,
    },
  });

  const resetUrl = `${process.env.NEXT_PUBLIC_URL}/reset-password?token=${token}`;

  await sendEmail({
    to: email,
    subject: "Reset your Password",
    text: `Click here to reset your password: ${resetUrl}`,
  });
}

"use server";

import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { sendEmail } from "@/lib/email";

export type RequestPasswordResetResult =
  | { success: true }
  | { success: false; error: string };

export async function requestPasswordReset(
  formData: FormData,
): Promise<RequestPasswordResetResult> {
  const email = formData.get("email")?.toString();
  if (!email) return { success: false, error: "Email is required" };

  const user = await prisma.user.findUnique({ where: { email } });

  // Don't reveal whether the email exists
  if (!user) return { success: true };

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

  try {
    await sendEmail({
      to: email,
      subject: "Reset your Password",
      text: `Click here to reset your password: ${resetUrl}`,
    });
  } catch {
    return {
      success: false,
      error: "Failed to send reset email. Please try again later.",
    };
  }

  return { success: true };
}

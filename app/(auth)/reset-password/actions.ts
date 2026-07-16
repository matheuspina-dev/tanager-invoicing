"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { validatePassword } from "@/lib/validation";

export type ResetPasswordResult =
  | { success: true }
  | { success: false; error: string };

export async function resetPassword(
  formData: FormData,
): Promise<ResetPasswordResult> {
  const token = formData.get("token")?.toString();
  const passwordRaw = formData.get("password")?.toString();

  if (!token || !passwordRaw) {
    return { success: false, error: "Missing fields" };
  }

  let password: string;
  try {
    password = validatePassword(passwordRaw);
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Invalid password",
    };
  }

  const user = await prisma.user.findUnique({
    where: { resetToken: token },
  });

  if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
    return {
      success: false,
      error: "This password reset link is invalid or has expired.",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  return { success: true };
}

"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { validatePassword } from "@/lib/validation";

export async function resetPassword(formData: FormData) {
  const token = formData.get("token")?.toString();
  const passwordRaw = formData.get("password")?.toString();

  if (!token || !passwordRaw) throw new Error("Missing fields");

  const password = validatePassword(passwordRaw);

  const user = await prisma.user.findUnique({
    where: { resetToken: token },
  });

  if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
    throw new Error("Invalid or expired token");
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

  redirect("/login?reset=success");
}

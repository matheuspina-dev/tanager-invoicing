"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";

export async function updateProfile(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const name = formData.get("name")?.toString();
  const password = formData.get("password")?.toString();

  if (!name) throw new Error("Name is required");

  const data: any = { name };

  if (password && password.trim() !== "") {
    data.password = await bcrypt.hash(password, 10);
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data,
  });

  revalidatePath("/profile");
  return { message: "Profile updated successfully" };
}

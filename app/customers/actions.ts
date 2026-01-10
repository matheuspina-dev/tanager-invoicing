"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createCustomer(formData: FormData) {
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string | null;
  const email = formData.get("email") as string | null;

  if (!name) {
    throw new Error("Name is required");
  }

  await prisma.customer.create({
    data: {
      name,
      phone,
      email,
    },
  });

  revalidatePath("/customers");
}

export async function updateCustomer(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string | null;
  const email = formData.get("email") as string | null;

  await prisma.customer.update({
    where: { id },
    data: { name, phone, email },
  });

  revalidatePath("/customers");
}

export async function deleteCustomer(formData: FormData) {
  const id = formData.get("id") as string;

  await prisma.customer.delete({ where: { id } });

  revalidatePath("/customers");
}

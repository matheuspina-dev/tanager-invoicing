"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createInvoice(formData: FormData) {
  const jobId = formData.get("jobId") as string;
  const amount = parseInt(formData.get("amount") as string);
  const status = (formData.get("status") as string) || "UNPAID";

  if (!jobId || isNaN(amount)) throw new Error("Job and Amount required");

  await prisma.invoice.create({
    data: {
      jobId,
      amount,
      status,
    },
  });

  revalidatePath("/invoices");
}

export async function updateInvoice(formData: FormData) {
  const id = formData.get("id") as string;
  const amount = parseInt(formData.get("amount") as string);
  const status = formData.get("status") as string;

  if (!id) throw new Error("Invoice ID required");

  await prisma.invoice.update({
    where: { id },
    data: { amount, status },
  });

  revalidatePath("/invoices");
}

export async function deleteInvoice(formData: FormData) {
  const id = formData.get("id") as string;

  if (!id) throw new Error("Invoice ID required");

  await prisma.invoice.delete({ where: { id } });

  revalidatePath("/invoices");
}

"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function recalcInvoiceStatus(invoiceId: string) {
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { payments: true },
  });

  if (!invoice) return;

  const totalPaid = invoice.payments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );

  let status: string;
  if (totalPaid >= invoice.amount) status = "PAID";
  else if (totalPaid > 0) status = "IN_PROGRESS";
  else status = "UNPAID";

  await prisma.invoice.update({
    where: { id: invoiceId },
    data: { status },
  });
}

export async function createPayment(formData: FormData) {
  const invoiceId = formData.get("invoiceId") as string;
  const amount = parseInt(formData.get("amount") as string);
  const method = formData.get("method") as string;

  if (!invoiceId || isNaN(amount) || !method)
    throw new Error("All fields required");

  await prisma.payment.create({
    data: {
      invoiceId,
      amount,
      method,
    },
  });

  await recalcInvoiceStatus(invoiceId);

  revalidatePath("/payments");
}

export async function updatePayment(formData: FormData) {
  const id = formData.get("id") as string;
  const amount = parseInt(formData.get("amount") as string);
  const method = formData.get("method") as string;

  const payment = await prisma.payment.findUnique({ where: { id } });
  if (!payment) throw new Error("Payment not found");

  await prisma.payment.update({
    where: { id },
    data: { amount, method },
  });

  await recalcInvoiceStatus(payment.invoiceId);

  revalidatePath("/payments");
}

export async function deletePayment(formData: FormData) {
  const id = formData.get("id") as string;

  if (!id) throw new Error("Payment ID required");

  const payment = await prisma.payment.findUnique({ where: { id } });
  if (!payment) throw new Error("Payment not found");

  await prisma.payment.delete({ where: { id } });

  await recalcInvoiceStatus(payment.invoiceId);

  revalidatePath("/payments");
}

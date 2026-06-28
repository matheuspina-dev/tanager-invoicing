"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getUserCompanyId } from "@/lib/auth";
import { requireFormId, requireRecord } from "@/lib/server-action-utils";
import { validatePaymentMethod } from "@/lib/validation";

async function recalcInvoiceStatus(invoiceId: string) {
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { payments: true },
  });
  if (!invoice) throw new Error("Invoice not found");

  const totalPaid = invoice.payments.reduce((sum, p) => sum + p.amount, 0);
  const status =
    totalPaid >= invoice.amount
      ? "PAID"
      : totalPaid > 0
      ? "IN_PROGRESS"
      : "UNPAID";

  await prisma.invoice.update({ where: { id: invoiceId }, data: { status } });
}

export async function createPayment(formData: FormData) {
  const companyId = await getUserCompanyId();
  const invoiceId = formData.get("invoiceId")?.toString();
  const amount = parseInt(formData.get("amount")?.toString() || "0");
  const methodRaw = formData.get("method")?.toString();

  if (!invoiceId || !amount || !methodRaw)
    throw new Error("All fields required");

  const method = validatePaymentMethod(methodRaw);

  if (amount <= 0) throw new Error("Amount must be positive");

  await prisma.payment.create({
    data: { invoiceId, amount, method, companyId },
  });
  await recalcInvoiceStatus(invoiceId);
  revalidatePath("/payments");
}

export async function updatePayment(formData: FormData) {
  const companyId = await getUserCompanyId();
  const id = requireFormId(formData, "id", "Payment ID");

  const payment = await requireRecord(
    () => prisma.payment.findFirst({ where: { id, companyId } }),
    "Payment",
  );

  const amount = parseInt(
    formData.get("amount")?.toString() || payment.amount.toString()
  );
  const methodRaw = formData.get("method")?.toString() || payment.method;
  const method = validatePaymentMethod(methodRaw);

  if (amount <= 0) throw new Error("Amount must be positive");

  await prisma.payment.update({
    where: { id: payment.id },
    data: { amount, method },
  });
  await recalcInvoiceStatus(payment.invoiceId);
  revalidatePath("/payments");
}

export async function deletePayment(formData: FormData) {
  const companyId = await getUserCompanyId();
  const id = requireFormId(formData, "id", "Payment ID");

  const payment = await requireRecord(
    () => prisma.payment.findFirst({ where: { id, companyId } }),
    "Payment",
  );

  await prisma.payment.delete({ where: { id: payment.id } });
  await recalcInvoiceStatus(payment.invoiceId);
  revalidatePath("/payments");
}

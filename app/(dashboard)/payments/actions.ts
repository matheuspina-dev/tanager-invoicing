"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

async function getUserCompanyId() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.companyId) throw new Error("Unauthorized");
  return session.user.companyId;
}

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
  const method = formData.get("method")?.toString();

  if (!invoiceId || !amount || !method) throw new Error("All fields required");

  await prisma.payment.create({
    data: { invoiceId, amount, method, companyId },
  });
  await recalcInvoiceStatus(invoiceId);
  revalidatePath("/payments");
}

export async function updatePayment(formData: FormData) {
  const companyId = await getUserCompanyId();
  const id = formData.get("id")?.toString();
  if (!id) throw new Error("Payment ID required");

  const payment = await prisma.payment.findFirst({ where: { id, companyId } });
  if (!payment) throw new Error("Payment not found");

  const amount = parseInt(
    formData.get("amount")?.toString() || payment.amount.toString()
  );
  const method = formData.get("method")?.toString() || payment.method;

  await prisma.payment.update({
    where: { id: payment.id },
    data: { amount, method },
  });
  await recalcInvoiceStatus(payment.invoiceId);
  revalidatePath("/payments");
}

export async function deletePayment(formData: FormData) {
  const companyId = await getUserCompanyId();
  const id = formData.get("id")?.toString();
  if (!id) throw new Error("Payment ID required");

  const payment = await prisma.payment.findFirst({ where: { id, companyId } });
  if (!payment) throw new Error("Payment not found");

  await prisma.payment.delete({ where: { id: payment.id } });
  await recalcInvoiceStatus(payment.invoiceId);
  revalidatePath("/payments");
}

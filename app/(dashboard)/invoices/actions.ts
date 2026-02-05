"use server";

import { prisma } from "../../../lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { generateInvoicePdf } from "./pdf";
import { sendEmail } from "@/lib/email";

async function getUserCompanyId() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.companyId) throw new Error("Unauthorized");
  return session.user.companyId;
}

export async function createInvoice(formData: FormData) {
  const companyId = await getUserCompanyId();
  const jobId = formData.get("jobId")?.toString();
  const status = formData.get("status")?.toString() || "UNPAID";

  if (!jobId) throw new Error("Job required");

  const items: { description: string; price: number }[] = [];

  for (let i = 0; ; i++) {
    const description = formData
      .get(`items[${i}][description]`)
      ?.toString()
      .trim();

    const priceRaw = formData.get(`items[${i}][price]`)?.toString();

    if (!description || !priceRaw) break;

    const price = parseInt(priceRaw, 10);
    if (isNaN(price) || price <= 0) {
      throw new Error("Invalid item price");
    }

    items.push({ description, price });
  }

  if (items.length === 0) {
    throw new Error("At least one invoice item is required");
  }

  const amount = items.reduce((sum, item) => sum + item.price, 0);

  await prisma.invoice.create({
    data: { jobId, amount, status, companyId, items: { create: items } },
  });
  revalidatePath("/invoices");
}

export async function updateInvoice(formData: FormData) {
  const companyId = await getUserCompanyId();
  const id = formData.get("id")?.toString();
  if (!id) throw new Error("Invoice ID required");

  const invoice = await prisma.invoice.findFirst({ where: { id, companyId } });
  if (!invoice) throw new Error("Invoice not found");

  const status = formData.get("status")?.toString() || invoice.status;

  const items: { description: string; price: number }[] = [];
  for (let i = 0; ; i++) {
    const description = formData
      .get(`items[${i}][description]`)
      ?.toString()
      .trim();
    const priceRaw = formData.get(`items[${i}][price]`)?.toString();

    if (!description || !priceRaw) break;

    const price = parseInt(priceRaw, 10);
    if (!isNaN(price) && price > 0) {
      items.push({ description, price });
    }
  }

  const newAmount = items.reduce((sum, item) => sum + item.price, 0);

  await prisma.$transaction(async (tx) => {
    await tx.invoiceItem.deleteMany({
      where: { invoiceId: id },
    });

    await tx.invoice.update({
      where: { id },
      data: {
        status,
        amount: newAmount,
        items: {
          create: items,
        },
      },
    });
  });

  revalidatePath("/invoices");
}

export async function deleteInvoice(formData: FormData) {
  const companyId = await getUserCompanyId();
  const id = formData.get("id")?.toString();
  if (!id) throw new Error("Invoice ID required");

  const invoice = await prisma.invoice.findFirst({ where: { id, companyId } });
  if (!invoice) throw new Error("Invoice not found");

  await prisma.invoice.delete({ where: { id: invoice.id } });
  revalidatePath("/invoices");
}

export async function emailInvoice(invoiceId: string) {
  const companyId = await getUserCompanyId();

  const invoice = await prisma.invoice.findFirst({
    where: { id: invoiceId, companyId },
    include: {
      job: { include: { customer: true } },
      payments: true,
      items: true,
    },
  });

  if (!invoice || !invoice.job.customer?.email)
    throw new Error("Customer email not found");

  const pdfBuffer = await generateInvoicePdf(invoice);

  await sendEmail({
    to: invoice.job.customer.email,
    subject: `Invoice #${invoice.id}`,
    text: "Please find your invoice attached.",
    attachments: [
      { filename: `invoice-${invoice.id}.pdf`, content: pdfBuffer },
    ],
  });

  revalidatePath("/invoices");
}

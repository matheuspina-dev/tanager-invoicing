"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getUserCompanyId } from "@/lib/auth";
import { requireFormId, requireRecord, parseFormItems } from "@/lib/server-action-utils";
import { generateInvoicePdf } from "./pdf";
import { sendEmail, companySender } from "@/lib/email";
import { validateInvoiceStatus } from "@/lib/validation";

export async function createInvoice(formData: FormData) {
  const companyId = await getUserCompanyId();
  const jobId = formData.get("jobId")?.toString();
  const statusRaw = formData.get("status")?.toString() || "UNPAID";
  const status = validateInvoiceStatus(statusRaw);

  if (!jobId) throw new Error("Job required");

  const items = parseFormItems(formData);

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
  const id = requireFormId(formData, "id", "Invoice ID");

  const invoice = await requireRecord(
    () => prisma.invoice.findFirst({ where: { id, companyId } }),
    "Invoice",
  );

  const statusRaw = formData.get("status")?.toString() || invoice.status;
  const status = validateInvoiceStatus(statusRaw);

  const items = parseFormItems(formData, { strict: false });

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
  const id = requireFormId(formData, "id", "Invoice ID");

  const invoice = await requireRecord(
    () => prisma.invoice.findFirst({ where: { id, companyId } }),
    "Invoice",
  );

  await prisma.invoice.delete({ where: { id: invoice.id } });
  revalidatePath("/invoices");
}

export async function emailInvoice(invoiceId: string) {
  const companyId = await getUserCompanyId();

  const invoice = await requireRecord(
    () =>
      prisma.invoice.findFirst({
        where: { id: invoiceId, companyId },
        include: {
          job: { include: { customer: true } },
          payments: true,
          items: true,
          company: true,
        },
      }),
    "Invoice",
  );

  if (!invoice.job.customer?.email)
    throw new Error("Customer email not found");

  const pdfBuffer = await generateInvoicePdf(invoice);

  await sendEmail({
    to: invoice.job.customer.email,
    from: companySender(invoice.company.name),
    replyTo: invoice.company.email ?? undefined,
    subject: `Invoice #${invoice.id}`,
    text: `Please find invoice #${invoice.id} from ${invoice.company.name} attached.`,
    attachments: [
      { filename: `invoice-${invoice.id}.pdf`, content: pdfBuffer },
    ],
  });

  revalidatePath("/invoices");
}

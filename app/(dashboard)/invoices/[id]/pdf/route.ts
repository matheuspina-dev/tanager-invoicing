import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { generateInvoicePdf } from "../../pdf";
import { requireCompanyId } from "@/lib/auth";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const companyId = await requireCompanyId();

  const { id } = await context.params;

  if (!id) {
    return new NextResponse("Missing invoice ID", { status: 400 });
  }

  const invoice = await prisma.invoice.findFirst({
    where: {
      id,
      companyId,
    },
    include: {
      job: {
        include: {
          customer: true,
        },
      },
      items: true,
      payments: true,
      company: true,
    },
  });

  if (!invoice) {
    return new NextResponse("Invoice not found", { status: 404 });
  }

  let pdfBuffer: Buffer;
  try {
    pdfBuffer = await generateInvoicePdf(invoice);
  } catch {
    return new NextResponse("Failed to generate PDF", { status: 500 });
  }

  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="invoice-${invoice.id}.pdf"`,
    },
  });
}

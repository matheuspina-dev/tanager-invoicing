import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

function drawWrappedText(
  page: any,
  text: string,
  x: number,
  startY: number,
  maxWidth: number,
  font: any,
  size = 12,
  lineHeight = 16,
) {
  const words = text.split(" ");
  let line = "";
  let y = startY;

  for (const word of words) {
    const testLine = line + word + " ";
    const width = font.widthOfTextAtSize(testLine, size);

    if (width > maxWidth && line !== "") {
      page.drawText(line, { x, y, size, font });
      line = word + " ";
      y -= lineHeight;
    } else {
      line = testLine;
    }
  }

  if (line) {
    page.drawText(line, { x, y, size, font });
    y -= lineHeight;
  }

  return y;
}

function drawRightAlignedText(
  page: any,
  text: string,
  rightX: number,
  y: number,
  font: any,
  size = 12,
) {
  const width = font.widthOfTextAtSize(text, size);
  const x = rightX - width;
  page.drawText(text, { x, y, font, size });
}

export async function generateInvoicePdf(invoice: any) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);

  let y = 800;

  const draw = (text: string, size = 12, color = rgb(0, 0, 0)) => {
    page.drawText(text, { x: 50, y, size, font, color });
    y -= size + 8;
  };

  const totalPaid = invoice.payments.reduce(
    (sum: number, p: any) => sum + p.amount,
    0,
  );
  const balance = invoice.amount - totalPaid;
  const status =
    totalPaid >= invoice.amount
      ? "PAID"
      : totalPaid > 0
        ? "IN PROGRESS"
        : "UNPAID";

  const money = (n: number) => `$${(n / 100).toFixed(2)}`;

  // Branding
  draw("Tanager Ventures LLC", 22);
  draw("Invoice", 14);
  y -= 10;
  draw("3792 W Rockwood Way");
  draw("West Valley City, UT 84120");
  draw("Email: matheus.pina@tanagerventures.com");
  draw("Phone: (978) 504-9133");

  // Invoice info (right-aligned)
  page.drawText(`Invoice #: ${invoice.id}`, { x: 350, y: 780, size: 10, font });
  page.drawText(`Status: ${status}`, {
    x: 350,
    y: 765,
    size: 10,
    font,
    color:
      status === "PAID"
        ? rgb(0, 0.6, 0)
        : status === "IN PROGRESS"
          ? rgb(0.9, 0.6, 0)
          : rgb(0.8, 0, 0),
  });

  y -= 30;

  // Customer info
  draw("Bill To:", 14);
  draw(invoice.job.customer?.name ?? "Deleted customer");
  draw(invoice.job.customer?.phone ?? "No phone number");
  draw(invoice.job.customer?.email ?? "No email");
  y -= 10;

  draw("Job Description:", 14);
  y = drawWrappedText(page, invoice.job.description, 50, y, 495, font, 12);

  y -= 10;
  draw("Invoice Items:", 14);

  page.drawLine({
    start: { x: 50, y },
    end: { x: 545, y },
    thickness: 1,
  });
  y -= 12;

  page.drawText("Description", { x: 50, y, size: 12, font });
  page.drawText("Price", { x: 518, y, size: 12, font });
  y -= 10;

  page.drawLine({
    start: { x: 50, y },
    end: { x: 545, y },
    thickness: 0.5,
  });
  y -= 12;

  const items = invoice.items ?? [];

  items.forEach((item: any) => {
    const startY = y;

    y = drawWrappedText(page, item.description, 50, y, 360, font, 12);

    drawRightAlignedText(page, money(item.price), 545, startY, font, 12);

    y -= 8;
  });

  y -= 20;

  // Totals
  draw(`Invoice Total: ${money(invoice.amount)}`);
  draw(`Total Paid: ${money(totalPaid)}`);
  draw(`Remaining Balance: ${money(balance)}`, 14);

  y -= 20;
  draw("Payments:", 14);

  if (invoice.payments.length === 0) {
    draw("No payments yet");
  } else {
    invoice.payments.forEach((p: any) =>
      draw(`• ${money(p.amount)} — ${p.method}`),
    );
  }

  y -= 30;
  draw("Thank you for your business!", 12);
  draw("Payment is due upon receipt.");

  return Buffer.from(await pdf.save());
}

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const COLORS = {
  primary: rgb(0.1, 0.1, 0.1),
  secondary: rgb(0.4, 0.4, 0.4),
  tableHeader: rgb(0.96, 0.96, 0.96),
  border: rgb(0.9, 0.9, 0.9),
};

function drawWrappedText(
  page: any,
  text: string,
  x: number,
  startY: number,
  maxWidth: number,
  font: any,
  size = 10,
  lineHeight = 14,
) {
  if (!text) return startY;

  const paragraphs = text.split("\n");
  let y = startY;

  for (const paragraph of paragraphs) {
    const words = paragraph.split(" ");
    let line = "";

    for (const word of words) {
      const testLine = line + word + " ";
      const width = font.widthOfTextAtSize(testLine, size);

      if (width > maxWidth && line !== "") {
        page.drawText(line.trim(), {
          x,
          y,
          size,
          font,
          color: COLORS.secondary,
        });
        line = word + " ";
        y -= lineHeight;
      } else {
        line = testLine;
      }
    }

    if (line) {
      page.drawText(line.trim(), { x, y, size, font, color: COLORS.secondary });
      y -= lineHeight;
    }
  }

  return y;
}

function drawRightText(
  page: any,
  text: string,
  rightX: number,
  y: number,
  font: any,
  size = 10,
  color = COLORS.primary,
) {
  const width = font.widthOfTextAtSize(text, size);
  page.drawText(text, { x: rightX - width, y, font, size, color });
}

export async function generateInvoicePdf(invoice: any) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]);
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdf.embedFont(StandardFonts.Helvetica);

  const { width, height } = page.getSize();
  const margin = 50;
  let y = height - margin;

  //Header
  const company = invoice.company || {};
  page.drawText(company.name || "Company Name", {
    x: margin,
    y,
    size: 20,
    font: fontBold,
    color: COLORS.primary,
  });
  y -= 25;

  const companyDetails = [
    company.address,
    company.phone,
    company.email,
    company.website,
  ].filter(Boolean);
  companyDetails.forEach((detail) => {
    page.drawText(detail, {
      x: margin,
      y,
      size: 10,
      font: fontRegular,
      color: COLORS.secondary,
    });
    y -= 14;
  });

  const topY = height - margin;
  page.drawText("INVOICE", {
    x: width - margin - 70,
    y: topY,
    size: 20,
    font: fontBold,
    color: rgb(0.7, 0.7, 0.7),
  });

  let rightY = topY - 30;
  const date = new Date(invoice.createdAt).toLocaleDateString();
  const details = [
    { label: "Invoice #", value: invoice.id.slice(-6).toUpperCase() },
    { label: "Date", value: date },
    { label: "Status", value: invoice.status },
  ];

  details.forEach(({ label, value }) => {
    drawRightText(
      page,
      value,
      width - margin,
      rightY,
      fontBold,
      10,
      COLORS.primary,
    );
    drawRightText(
      page,
      label,
      width - margin - 80,
      rightY,
      fontRegular,
      10,
      COLORS.secondary,
    );
    rightY -= 16;
  });

  y = Math.min(y, rightY) - 20;

  //Bill to and Description

  page.drawLine({
    start: { x: margin, y },
    end: { x: width - margin, y },
    thickness: 1,
    color: COLORS.border,
  });
  y -= 20;

  const sectionStartY = y;

  const col1X = margin;
  page.drawText("Bill To:", {
    x: col1X,
    y: sectionStartY,
    size: 10,
    font: fontBold,
    color: COLORS.secondary,
  });
  let yLeft = sectionStartY - 16;

  const customer = invoice.job.customer || {};
  page.drawText(customer.name || "Deleted Customer", {
    x: col1X,
    y: yLeft,
    size: 12,
    font: fontBold,
    color: COLORS.primary,
  });
  yLeft -= 16;
  if (customer.email) {
    page.drawText(customer.email, {
      x: col1X,
      y: yLeft,
      size: 10,
      font: fontRegular,
      color: COLORS.secondary,
    });
    yLeft -= 14;
  }
  if (customer.phone) {
    page.drawText(customer.phone, {
      x: col1X,
      y: yLeft,
      size: 10,
      font: fontRegular,
      color: COLORS.secondary,
    });
    yLeft -= 14;
  }

  const col2X = margin + 250;
  page.drawText("Job Description:", {
    x: col2X,
    y: sectionStartY,
    size: 10,
    font: fontBold,
    color: COLORS.secondary,
  });

  let yRight = sectionStartY - 16;

  yRight = drawWrappedText(
    page,
    invoice.job.description,
    col2X,
    yRight,
    200,
    fontRegular,
    10,
  );

  y = Math.min(yLeft, yRight) - 40;

  //Items
  page.drawRectangle({
    x: margin,
    y: y - 10,
    width: width - margin * 2,
    height: 24,
    color: COLORS.tableHeader,
  });

  page.drawText("Description", {
    x: margin + 10,
    y: y - 4,
    size: 10,
    font: fontBold,
    color: COLORS.primary,
  });
  drawRightText(
    page,
    "Amount",
    width - margin - 10,
    y - 4,
    fontBold,
    10,
    COLORS.primary,
  );
  y -= 30;

  const items = invoice.items || [];

  items.forEach((item: any) => {
    const startY = y;
    const price = `$${(item.price / 100).toFixed(2)}`;

    drawRightText(
      page,
      price,
      width - margin - 10,
      startY,
      fontRegular,
      10,
      COLORS.primary,
    );

    y = drawWrappedText(
      page,
      item.description,
      margin + 10,
      y,
      350,
      fontRegular,
      10,
    );

    y = Math.min(y, startY - 20);

    page.drawLine({
      start: { x: margin, y: y + 8 },
      end: { x: width - margin, y: y + 8 },
      thickness: 0.5,
      color: COLORS.border,
    });

    y -= 10;
  });

  //Total and Footer
  y -= 10;
  const totalPaid = invoice.payments.reduce(
    (sum: number, p: any) => sum + p.amount,
    0,
  );
  const balance = invoice.amount - totalPaid;

  const drawTotalLine = (label: string, amount: number, isFinal = false) => {
    const text = `$${(amount / 100).toFixed(2)}`;
    drawRightText(
      page,
      text,
      width - margin - 10,
      y,
      isFinal ? fontBold : fontRegular,
      isFinal ? 14 : 10,
      COLORS.primary,
    );
    drawRightText(
      page,
      label,
      width - margin - 100,
      y,
      fontRegular,
      10,
      COLORS.secondary,
    );
    y -= 20;
  };

  drawTotalLine("Total:", invoice.amount);
  drawTotalLine("Paid:", totalPaid);
  y -= 5;
  drawTotalLine("Balance Due:", balance, true);

  const bottomY = 50;
  page.drawText("Thank you for your business!", {
    x: margin,
    y: bottomY + 20,
    size: 12,
    font: fontBold,
    color: COLORS.primary,
  });

  if (company.email || company.phone) {
    const contactText = `Questions? Contact us at ${company.email || ""} ${company.phone ? `or ${company.phone}` : ""}`;
    page.drawText(contactText, {
      x: margin,
      y: bottomY,
      size: 9,
      font: fontRegular,
      color: COLORS.secondary,
    });
  }

  return Buffer.from(await pdf.save());
}

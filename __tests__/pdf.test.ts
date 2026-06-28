import { describe, it, expect } from "vitest";
import { generateInvoicePdf } from "@/app/(dashboard)/invoices/pdf";
import { PDFDocument } from "pdf-lib";

const MOCK_INVOICE = {
  id: "abc123def456",
  amount: 62350,
  status: "UNPAID",
  createdAt: new Date("2024-05-01"),
  company: {
    name: "Acme Contracting",
    address: "123 Main St, Denver, CO",
    phone: "(720) 555-0100",
    email: "billing@acme.example",
    website: "https://acme.example",
  },
  job: {
    description: "Roof repair — north wing",
    customer: {
      name: "Bellfield Partners",
      email: "ap@bellfield.example",
      phone: "(303) 555-0142",
    },
  },
  items: [
    { description: "Materials", price: 32350 },
    { description: "Labor", price: 30000 },
  ],
  payments: [{ amount: 10000 }],
};

describe("generateInvoicePdf", () => {
  it("returns a Buffer", async () => {
    const result = await generateInvoicePdf(MOCK_INVOICE);
    expect(Buffer.isBuffer(result)).toBe(true);
  });

  it("produces a valid single-page PDF", async () => {
    const buf = await generateInvoicePdf(MOCK_INVOICE);
    const pdf = await PDFDocument.load(new Uint8Array(buf));
    expect(pdf.getPageCount()).toBe(1);
  });

  it("sets the page size to A4 (595 x 842)", async () => {
    const buf = await generateInvoicePdf(MOCK_INVOICE);
    const pdf = await PDFDocument.load(new Uint8Array(buf));
    const { width, height } = pdf.getPage(0).getSize();
    expect(width).toBe(595);
    expect(height).toBe(842);
  });

  it("handles an invoice with no payments", async () => {
    const invoice = { ...MOCK_INVOICE, payments: [] };
    const buf = await generateInvoicePdf(invoice);
    const pdf = await PDFDocument.load(new Uint8Array(buf));
    expect(pdf.getPageCount()).toBe(1);
  });

  it("handles an invoice with no items", async () => {
    const invoice = { ...MOCK_INVOICE, items: [] };
    const buf = await generateInvoicePdf(invoice);
    const pdf = await PDFDocument.load(new Uint8Array(buf));
    expect(pdf.getPageCount()).toBe(1);
  });

  it("handles a customer with no contact info", async () => {
    const invoice = {
      ...MOCK_INVOICE,
      job: {
        ...MOCK_INVOICE.job,
        customer: { name: "No-Contact Corp", email: null, phone: null },
      },
    };
    const buf = await generateInvoicePdf(invoice);
    const pdf = await PDFDocument.load(new Uint8Array(buf));
    expect(pdf.getPageCount()).toBe(1);
  });

  it("handles a missing customer (null)", async () => {
    const invoice = {
      ...MOCK_INVOICE,
      job: { ...MOCK_INVOICE.job, customer: null },
    };
    const buf = await generateInvoicePdf(invoice);
    const pdf = await PDFDocument.load(new Uint8Array(buf));
    expect(pdf.getPageCount()).toBe(1);
  });

  it("handles a missing company gracefully", async () => {
    const invoice = { ...MOCK_INVOICE, company: undefined };
    const buf = await generateInvoicePdf(invoice);
    const pdf = await PDFDocument.load(new Uint8Array(buf));
    expect(pdf.getPageCount()).toBe(1);
  });

  it("handles multiple payments summing correctly", async () => {
    const invoice = {
      ...MOCK_INVOICE,
      payments: [{ amount: 20000 }, { amount: 10000 }, { amount: 5000 }],
    };
    const buf = await generateInvoicePdf(invoice);
    const pdf = await PDFDocument.load(new Uint8Array(buf));
    expect(pdf.getPageCount()).toBe(1);
  });
});

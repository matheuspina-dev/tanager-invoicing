import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InvoiceRow } from "@/app/(dashboard)/invoices/InvoiceRow";
import type { InvoiceWithRelations } from "@/lib/types";

// Mock the server actions — they run server-side and cannot execute in jsdom.
vi.mock("@/app/(dashboard)/invoices/actions", () => ({
  updateInvoice: vi.fn(),
  deleteInvoice: vi.fn(),
  emailInvoice: vi.fn(),
}));

const MOCK_INVOICE: InvoiceWithRelations = {
  id: "inv-test-1",
  amount: 62350,
  status: "UNPAID",
  companyId: "co-1",
  jobId: "job-1",
  createdAt: new Date("2024-05-01"),
  job: {
    id: "job-1",
    description: "Roof repair — north wing",
    status: "OPEN",
    companyId: "co-1",
    customerId: "cust-1",
    createdAt: new Date("2024-04-15"),
    customer: {
      id: "cust-1",
      name: "Bellfield Partners",
      phone: null,
      email: null,
      companyId: "co-1",
      createdAt: new Date("2024-01-01"),
    },
  },
  items: [
    {
      id: "item-1",
      invoiceId: "inv-test-1",
      description: "Materials",
      price: 32350,
    },
    {
      id: "item-2",
      invoiceId: "inv-test-1",
      description: "Labor",
      price: 30000,
    },
  ],
  payments: [],
};

describe("InvoiceRow", () => {
  it("renders the job description", () => {
    render(<InvoiceRow invoice={MOCK_INVOICE} />);
    expect(screen.getByText("Roof repair — north wing")).toBeInTheDocument();
  });

  it("renders the formatted invoice amount", () => {
    render(<InvoiceRow invoice={MOCK_INVOICE} />);
    expect(screen.getByText("$623.50")).toBeInTheDocument();
  });

  it("renders the customer name", () => {
    render(<InvoiceRow invoice={MOCK_INVOICE} />);
    expect(screen.getByText("Bellfield Partners")).toBeInTheDocument();
  });

  it("renders each line item description", () => {
    render(<InvoiceRow invoice={MOCK_INVOICE} />);
    expect(screen.getByText(/Materials/)).toBeInTheDocument();
    expect(screen.getByText(/Labor/)).toBeInTheDocument();
  });

  it("shows the edit form when the Edit button is clicked", async () => {
    render(<InvoiceRow invoice={MOCK_INVOICE} />);
    await userEvent.click(screen.getByText("Edit"));
    expect(screen.getByText("Edit invoice")).toBeInTheDocument();
  });

  it("hides the edit form and resets state when Cancel is clicked", async () => {
    render(<InvoiceRow invoice={MOCK_INVOICE} />);
    await userEvent.click(screen.getByText("Edit"));
    await userEvent.click(screen.getByText("Cancel"));
    expect(screen.queryByText("Edit invoice")).not.toBeInTheDocument();
    expect(screen.getByText("Roof repair — north wing")).toBeInTheDocument();
  });

  it("renders an InvoiceStatusBadge with the Unpaid label", () => {
    render(<InvoiceRow invoice={MOCK_INVOICE} />);
    expect(screen.getByTestId("invoice-status-badge")).toBeInTheDocument();
    expect(screen.getByText("Unpaid")).toBeInTheDocument();
  });
});

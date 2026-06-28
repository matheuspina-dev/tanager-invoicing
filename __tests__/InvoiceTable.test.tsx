import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import InvoiceTable from "@/app/components/InvoiceTable";
import type { InvoiceWithRelations } from "@/lib/types";

vi.mock("@/app/(dashboard)/invoices/actions", () => ({
  updateInvoice: vi.fn(),
  deleteInvoice: vi.fn(),
  emailInvoice: vi.fn(),
}));

const MOCK_INVOICE: InvoiceWithRelations = {
  id: "inv-1",
  amount: 50000,
  status: "PAID",
  companyId: "co-1",
  jobId: "job-1",
  createdAt: new Date("2024-06-01"),
  job: {
    id: "job-1",
    description: "Kitchen remodel",
    status: "CLOSED",
    companyId: "co-1",
    customerId: "cust-1",
    createdAt: new Date("2024-05-01"),
    customer: {
      id: "cust-1",
      name: "Smith Residence",
      phone: null,
      email: null,
      companyId: "co-1",
      createdAt: new Date("2024-01-01"),
    },
  },
  items: [{ id: "item-1", invoiceId: "inv-1", description: "Tile work", price: 50000 }],
  payments: [],
};

describe("InvoiceTable", () => {
  it("renders the empty state when given an empty array", () => {
    render(<InvoiceTable invoices={[]} />);
    expect(screen.getByText("No invoices found.")).toBeInTheDocument();
  });

  it("renders a custom empty message", () => {
    render(<InvoiceTable invoices={[]} emptyMessage="Nothing here." />);
    expect(screen.getByText("Nothing here.")).toBeInTheDocument();
  });

  it("renders invoice rows when invoices are provided", () => {
    render(<InvoiceTable invoices={[MOCK_INVOICE]} />);
    expect(screen.getByText("Kitchen remodel")).toBeInTheDocument();
    expect(screen.getByText("$500.00")).toBeInTheDocument();
  });

  it("renders multiple invoices", () => {
    const second: InvoiceWithRelations = {
      ...MOCK_INVOICE,
      id: "inv-2",
      job: {
        ...MOCK_INVOICE.job,
        id: "job-2",
        description: "Bathroom repair",
      },
    };
    render(<InvoiceTable invoices={[MOCK_INVOICE, second]} />);
    expect(screen.getByText("Kitchen remodel")).toBeInTheDocument();
    expect(screen.getByText("Bathroom repair")).toBeInTheDocument();
  });

  it("renders as a list element", () => {
    const { container } = render(<InvoiceTable invoices={[MOCK_INVOICE]} />);
    expect(container.querySelector("ul")).not.toBeNull();
  });
});

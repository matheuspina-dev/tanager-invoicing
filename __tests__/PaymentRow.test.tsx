import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PaymentRow } from "@/app/(dashboard)/payments/PaymentRow";

vi.mock("@/app/(dashboard)/payments/actions", () => ({
  updatePayment: vi.fn(),
  deletePayment: vi.fn(),
}));

const MOCK_PAYMENT = {
  id: "pay-1",
  amount: 20000,
  method: "CASH",
  companyId: "co-1",
  invoiceId: "inv-1",
  invoice: {
    status: "IN_PROGRESS",
    job: {
      description: "Roof replacement",
      customer: { name: "Hartley & Sons" },
    },
  },
};

describe("PaymentRow", () => {
  it("renders the payment amount formatted as dollars", () => {
    render(<PaymentRow payment={MOCK_PAYMENT} />);
    expect(screen.getByText("$200.00")).toBeInTheDocument();
  });

  it("renders the payment method badge", () => {
    render(<PaymentRow payment={MOCK_PAYMENT} />);
    expect(screen.getByText("CASH")).toBeInTheDocument();
  });

  it("renders the job description", () => {
    render(<PaymentRow payment={MOCK_PAYMENT} />);
    expect(screen.getByText("Roof replacement")).toBeInTheDocument();
  });

  it("renders the customer name", () => {
    render(<PaymentRow payment={MOCK_PAYMENT} />);
    expect(screen.getByText(/Hartley & Sons/)).toBeInTheDocument();
  });

  it("shows 'Deleted' when customer is null", () => {
    const payment = {
      ...MOCK_PAYMENT,
      invoice: {
        ...MOCK_PAYMENT.invoice,
        job: { ...MOCK_PAYMENT.invoice.job, customer: null },
      },
    };
    render(<PaymentRow payment={payment} />);
    expect(screen.getByText(/Deleted/)).toBeInTheDocument();
  });

  it("applies correct method color for CASH", () => {
    render(<PaymentRow payment={MOCK_PAYMENT} />);
    const badge = screen.getByText("CASH");
    expect(badge.className).toContain("bg-green-100");
  });

  it("applies correct method color for CARD", () => {
    const payment = { ...MOCK_PAYMENT, method: "CARD" };
    render(<PaymentRow payment={payment} />);
    const badge = screen.getByText("CARD");
    expect(badge.className).toContain("bg-purple-100");
  });

  it("shows the edit form when Edit is clicked", async () => {
    render(<PaymentRow payment={MOCK_PAYMENT} />);
    await userEvent.click(screen.getByText("Edit"));
    expect(screen.getByText("Edit Payment")).toBeInTheDocument();
  });

  it("hides the edit form when Cancel is clicked", async () => {
    render(<PaymentRow payment={MOCK_PAYMENT} />);
    await userEvent.click(screen.getByText("Edit"));
    expect(screen.getByText("Edit Payment")).toBeInTheDocument();
    await userEvent.click(screen.getByText("Cancel"));
    expect(screen.queryByText("Edit Payment")).not.toBeInTheDocument();
  });

  it("pre-fills the amount input in edit mode", async () => {
    render(<PaymentRow payment={MOCK_PAYMENT} />);
    await userEvent.click(screen.getByText("Edit"));
    const amountInput = screen.getByDisplayValue("20000") as HTMLInputElement;
    expect(amountInput.name).toBe("amount");
  });

  it("renders a method select with CASH, CARD, OTHER options in edit mode", async () => {
    render(<PaymentRow payment={MOCK_PAYMENT} />);
    await userEvent.click(screen.getByText("Edit"));
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    expect(select.name).toBe("method");
    expect(select.options).toHaveLength(3);
  });
});

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import InvoiceStatusBadge from "@/app/components/InvoiceStatusBadge";

describe("InvoiceStatusBadge", () => {
  it("renders the human-readable label for PAID", () => {
    render(<InvoiceStatusBadge status="PAID" />);
    expect(screen.getByText("Paid")).toBeInTheDocument();
  });

  it("renders the human-readable label for UNPAID", () => {
    render(<InvoiceStatusBadge status="UNPAID" />);
    expect(screen.getByText("Unpaid")).toBeInTheDocument();
  });

  it("renders In Progress for IN_PROGRESS", () => {
    render(<InvoiceStatusBadge status="IN_PROGRESS" />);
    expect(screen.getByText("In Progress")).toBeInTheDocument();
  });

  it("applies the correct color class for PAID", () => {
    render(<InvoiceStatusBadge status="PAID" />);
    const badge = screen.getByTestId("invoice-status-badge");
    expect(badge.className).toContain("bg-green-100");
    expect(badge.className).toContain("text-green-800");
  });

  it("applies the correct color class for UNPAID", () => {
    render(<InvoiceStatusBadge status="UNPAID" />);
    const badge = screen.getByTestId("invoice-status-badge");
    expect(badge.className).toContain("bg-red-100");
  });

  it("falls back to grey classes for an unrecognised status", () => {
    render(<InvoiceStatusBadge status="CANCELLED" />);
    const badge = screen.getByTestId("invoice-status-badge");
    expect(badge.className).toContain("bg-gray-100");
  });
});

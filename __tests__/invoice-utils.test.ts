import { describe, it, expect } from "vitest";
import {
  calculateTotal,
  formatCurrency,
  getStatusColor,
  getStatusLabel,
  calculateBalanceDue,
} from "@/lib/invoice-utils";

describe("calculateTotal", () => {
  it("returns 0 for an empty item array", () => {
    expect(calculateTotal([])).toBe(0);
  });

  it("sums a single item price", () => {
    expect(calculateTotal([{ price: 5000 }])).toBe(5000);
  });

  it("sums multiple item prices", () => {
    expect(calculateTotal([{ price: 10000 }, { price: 2500 }, { price: 750 }])).toBe(13250);
  });

  it("handles large cent values without precision loss", () => {
    expect(calculateTotal([{ price: 9999999 }, { price: 1 }])).toBe(10000000);
  });
});

describe("formatCurrency", () => {
  it("formats cents as a dollar string", () => {
    expect(formatCurrency(15000)).toBe("$150.00");
  });

  it("formats zero as $0.00", () => {
    expect(formatCurrency(0)).toBe("$0.00");
  });

  it("preserves two decimal places for non-round amounts", () => {
    expect(formatCurrency(199)).toBe("$1.99");
  });
});

describe("getStatusColor", () => {
  it("returns green classes for PAID", () => {
    expect(getStatusColor("PAID")).toBe("bg-green-100 text-green-800");
  });

  it("returns red classes for UNPAID", () => {
    expect(getStatusColor("UNPAID")).toBe("bg-red-100 text-red-800");
  });

  it("returns yellow classes for IN_PROGRESS", () => {
    expect(getStatusColor("IN_PROGRESS")).toBe("bg-yellow-100 text-yellow-800");
  });

  it("returns grey classes for unknown status", () => {
    expect(getStatusColor("UNKNOWN")).toBe("bg-gray-100 text-gray-700");
  });
});

describe("getStatusLabel", () => {
  it("returns Paid for PAID", () => {
    expect(getStatusLabel("PAID")).toBe("Paid");
  });

  it("returns Unpaid for UNPAID", () => {
    expect(getStatusLabel("UNPAID")).toBe("Unpaid");
  });

  it("returns In Progress for IN_PROGRESS", () => {
    expect(getStatusLabel("IN_PROGRESS")).toBe("In Progress");
  });
});

describe("calculateBalanceDue", () => {
  it("returns total when no payments exist", () => {
    expect(calculateBalanceDue(10000, [])).toBe(10000);
  });

  it("subtracts partial payments from total", () => {
    expect(calculateBalanceDue(10000, [3000, 2000])).toBe(5000);
  });

  it("returns 0 when payments equal or exceed total", () => {
    expect(calculateBalanceDue(5000, [5000])).toBe(0);
    expect(calculateBalanceDue(5000, [6000])).toBe(0);
  });
});

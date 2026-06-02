import type { InvoiceItem, InvoiceStatus } from "./types";

/**
 * Sum the prices of all invoice items.
 * Returns 0 for an empty array.
 * All values are integer cents.
 */
export function calculateTotal(items: Pick<InvoiceItem, "price">[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

/**
 * Format an integer-cents value as a USD dollar string.
 * e.g. 15000 → "$150.00"
 */
export function formatCurrency(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/**
 * Return the Tailwind CSS class string for a given invoice status.
 * Falls back to a neutral grey for unknown statuses.
 */
export function getStatusColor(status: string): string {
  switch (status) {
    case "PAID":
      return "bg-green-100 text-green-800";
    case "UNPAID":
      return "bg-red-100 text-red-800";
    case "IN_PROGRESS":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

/**
 * Return a human-readable label for an invoice status.
 * Converts SCREAMING_SNAKE_CASE to Title Case.
 * e.g. "IN_PROGRESS" → "In Progress"
 */
export function getStatusLabel(status: string): string {
  switch (status as InvoiceStatus) {
    case "PAID":
      return "Paid";
    case "UNPAID":
      return "Unpaid";
    case "IN_PROGRESS":
      return "In Progress";
    default:
      return status.replace(/_/g, " ");
  }
}

/**
 * Calculate the balance due for an invoice:
 * total amount minus all recorded payments.
 * Returns 0 if payments exceed the invoice amount.
 */
export function calculateBalanceDue(
  totalCents: number,
  paymentAmounts: number[],
): number {
  const paid = paymentAmounts.reduce((sum, p) => sum + p, 0);
  return Math.max(0, totalCents - paid);
}

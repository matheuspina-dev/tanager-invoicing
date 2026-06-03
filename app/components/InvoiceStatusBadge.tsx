import { getStatusColor, getStatusLabel } from "@/lib/invoice-utils";

interface InvoiceStatusBadgeProps {
  status: string;
}

/**
 * Pill badge that shows an invoice's status with the appropriate Tailwind
 * color class. Reads color and label from the shared invoice-utils helpers.
 */
export default function InvoiceStatusBadge({ status }: InvoiceStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded ${getStatusColor(status)}`}
      data-testid="invoice-status-badge"
    >
      {getStatusLabel(status)}
    </span>
  );
}

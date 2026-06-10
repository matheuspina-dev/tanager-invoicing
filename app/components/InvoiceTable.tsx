"use client";

import type { InvoiceWithRelations } from "@/lib/types";
import { InvoiceRow } from "@/app/(dashboard)/invoices/InvoiceRow";
import EmptyState from "./EmptyState";
import { FileText } from "lucide-react";

interface InvoiceTableProps {
  invoices: InvoiceWithRelations[];
  emptyMessage?: string;
}

/**
 * Renders a list of invoices as InvoiceRow cards.
 * Shows EmptyState when the list is empty.
 */
export default function InvoiceTable({
  invoices,
  emptyMessage = "No invoices found.",
}: InvoiceTableProps) {
  if (invoices.length === 0) {
    return (
      <EmptyState
        icon={<FileText size={40} />}
        heading={emptyMessage}
        description="Invoices you create will appear here."
      />
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-4">
      {invoices.map((invoice) => (
        <InvoiceRow key={invoice.id} invoice={invoice} />
      ))}
    </ul>
  );
}

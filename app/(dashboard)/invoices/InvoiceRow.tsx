"use client";

import { useState } from "react";
import { updateInvoice, deleteInvoice, emailInvoice } from "./actions";
import InvoiceStatusBadge from "@/app/components/InvoiceStatusBadge";
import { formatCurrency } from "@/lib/invoice-utils";
import type { InvoiceWithRelations, InvoiceItem } from "@/lib/types";

interface InvoiceRowProps {
  invoice: InvoiceWithRelations;
}

interface EditableItem {
  description: string;
  price: string;
}

function toEditableItems(items: InvoiceItem[]): EditableItem[] {
  if (items.length === 0) return [{ description: "", price: "" }];
  return items.map((item) => ({
    description: item.description,
    price: String(item.price),
  }));
}

export function InvoiceRow({ invoice }: InvoiceRowProps) {
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<EditableItem[]>(
    toEditableItems(invoice.items),
  );

  const addNewItem = () => {
    setItems([...items, { description: "", price: "" }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (
    index: number,
    field: keyof EditableItem,
    value: string,
  ) => {
    const next = [...items];
    next[index] = { ...next[index], [field]: value };
    setItems(next);
  };

  return (
    <li className="bg-white border border-gray-200 rounded-lg p-4">
      {!editing ? (
        <div className="flex justify-between items-start gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold text-gray-900 truncate">
                {invoice.job.description}
              </p>
              <InvoiceStatusBadge status={invoice.status} />
            </div>
            <p className="font-bold text-lg mt-1 text-gray-900">
              {formatCurrency(invoice.amount)}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {invoice.job.customer?.name ?? "Deleted customer"}
            </p>
            <ul className="mt-2 space-y-0.5 text-sm text-gray-500">
              {invoice.items.map((item, i) => (
                <li key={i}>
                  &bull; {item.description} ({formatCurrency(item.price)})
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-2 shrink-0">
            <div className="flex gap-2">
              <a
                href={`/invoices/${invoice.id}/pdf`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 text-center"
              >
                PDF
              </a>
              <button
                onClick={() => setEditing(true)}
                className="px-3 py-1 text-sm rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Edit
              </button>
            </div>

            <form
              action={async () => {
                setError(null);
                try {
                  await emailInvoice(invoice.id);
                } catch (err: unknown) {
                  setError(
                    err instanceof Error ? err.message : "Failed to send email",
                  );
                }
              }}
            >
              <button
                type="submit"
                className="text-sm text-blue-600 hover:underline w-full text-left"
              >
                Send email
              </button>
            </form>

            <form
              action={async (formData) => {
                setError(null);
                try {
                  await deleteInvoice(formData);
                } catch (err: unknown) {
                  setError(
                    err instanceof Error
                      ? err.message
                      : "Failed to delete invoice",
                  );
                }
              }}
            >
              <input type="hidden" name="id" value={invoice.id} />
              <button
                type="submit"
                onClick={(e) => {
                  if (!confirm("Delete this invoice?")) e.preventDefault();
                }}
                className="text-sm text-red-600 hover:underline w-full text-left"
              >
                Delete
              </button>
            </form>
          </div>

        </div>
      ) : (
        <form
          action={async (formData: FormData) => {
            setError(null);
            try {
              await updateInvoice(formData);
              setEditing(false);
            } catch (err: unknown) {
              setError(
                err instanceof Error
                  ? err.message
                  : "Failed to update invoice",
              );
            }
          }}
          className="space-y-4"
        >
          <input type="hidden" name="id" value={invoice.id} />

          <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
            <span className="font-semibold text-gray-700 text-sm">
              Edit invoice
            </span>
            <select
              name="status"
              defaultValue={invoice.status}
              className="border bg-white text-gray-600 rounded px-2 py-1 text-sm"
            >
              <option value="UNPAID">Unpaid</option>
              <option value="IN_PROGRESS">In progress</option>
              <option value="PAID">Paid</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600">Items</label>
            {items.map((item, index) => (
              <div key={index} className="flex gap-2 items-start">
                <input
                  name={`items[${index}][description]`}
                  value={item.description}
                  onChange={(e) =>
                    handleItemChange(index, "description", e.target.value)
                  }
                  placeholder="Description"
                  required
                  className="flex-grow border rounded px-2 py-1 text-sm text-gray-700"
                />
                <input
                  name={`items[${index}][price]`}
                  type="number"
                  value={item.price}
                  onChange={(e) =>
                    handleItemChange(index, "price", e.target.value)
                  }
                  placeholder="Cents"
                  required
                  className="w-24 border rounded px-2 py-1 text-sm text-gray-700"
                />
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  aria-label="Remove item"
                  className="text-red-500 hover:text-red-700 px-2"
                >
                  &times;
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addNewItem}
              className="text-sm text-blue-600 hover:underline"
            >
              + Add item
            </button>
          </div>

          <div className="flex gap-2 justify-end pt-2 border-t">
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setItems(toEditableItems(invoice.items));
              }}
              className="bg-gray-100 px-4 py-2 text-gray-600 rounded hover:bg-gray-200 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
            >
              Save changes
            </button>
          </div>
        </form>
      )}
      {error && (
        <p className="text-sm text-red-600 mt-2">{error}</p>
      )}
    </li>
  );
}

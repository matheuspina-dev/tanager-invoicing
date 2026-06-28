"use client";

import { useState } from "react";
import { updatePayment, deletePayment } from "./actions";
import { getPaymentMethodColor } from "@/lib/invoice-utils";

export function PaymentRow({ payment }: { payment: any }) {
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <li className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      {!editing ? (
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-bold text-xl text-black">
                ${(payment.amount / 100).toFixed(2)}
              </span>
              <span
                className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold ${getPaymentMethodColor(payment.method)}`}
              >
                {payment.method}
              </span>
            </div>

            <p className="font-medium text-gray-800 mt-1">
              {payment.invoice.job.description}
            </p>

            <p className="text-xs text-gray-500">
              Customer: {payment.invoice.job.customer?.name || "Deleted"} •
              Invoice Status: {payment.invoice.status}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setEditing(true)}
              className="px-3 py-1 text-sm rounded bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              Edit
            </button>

            <form
              action={async (formData) => {
                setError(null);
                try {
                  await deletePayment(formData);
                } catch (err: unknown) {
                  setError(
                    err instanceof Error
                      ? err.message
                      : "Failed to delete payment",
                  );
                }
              }}
            >
              <input type="hidden" name="id" value={payment.id} />
              <button
                type="submit"
                onClick={(e) => {
                  if (!confirm("Delete this payment?")) e.preventDefault();
                }}
                className="px-3 py-1 text-sm rounded bg-white border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
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
              await updatePayment(formData);
              setEditing(false);
            } catch (err: unknown) {
              setError(
                err instanceof Error
                  ? err.message
                  : "Failed to update payment",
              );
            }
          }}
          className="space-y-4"
        >
          <input type="hidden" name="id" value={payment.id} />

          <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
            <span className="font-semibold text-gray-700 text-sm">
              Edit Payment
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="text-xs text-gray-500 hover:underline"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="text-xs text-green-600 font-semibold hover:underline"
              >
                Save
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 font-medium">
                Amount (Cents)
              </label>
              <input
                type="number"
                name="amount"
                defaultValue={payment.amount}
                className="w-full border rounded px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 font-medium">
                Method
              </label>
              <select
                name="method"
                defaultValue={payment.method}
                className="w-full border rounded px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                <option value="CASH">CASH</option>
                <option value="CARD">CARD</option>
                <option value="OTHER">OTHER</option>
              </select>
            </div>
          </div>
        </form>
      )}
      {error && (
        <p className="text-sm text-red-600 mt-2">{error}</p>
      )}
    </li>
  );
}

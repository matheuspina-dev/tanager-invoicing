"use client";

import { useState } from "react";
import { updatePayment, deletePayment } from "./actions";

export function PaymentRow({ payment }: { payment: any }) {
  const [editing, setEditing] = useState(false);

  return (
    <li className="bg-white border rounded-lg p-4">
      {!editing ? (
        <div className="flex justify-between items-center">
          <div>
            <p className="font-semibold text-black">
              {payment.invoice.job.description} - {payment.amount}
            </p>

            <p className="text-sm text-gray-700">
              Customer: {payment.invoice.job.customer.name} - Method:
              {payment.method} - Status: {payment.invoice.status}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setEditing(true)}
              className="px-3 py-1 rounded bg-gray-200 text-gray-600 hover:bg-gray-300 cursor-pointer"
            >
              Edit
            </button>

            <form action={deletePayment}>
              <input type="hidden" name="id" value={payment.id} />
              <button
                type="submit"
                onClick={(e) => {
                  if (!confirm("Delete this payment?")) e.preventDefault();
                }}
                className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 cursor-pointer"
              >
                Delete
              </button>
            </form>
          </div>
        </div>
      ) : (
        <form
          action={async (formData: FormData) => {
            await updatePayment(formData);
            setEditing(false);
          }}
          className="space-y-3"
        >
          <input type="hidden" name="id" value={payment.id} />

          <input
            type="number"
            name="amount"
            defaultValue={payment.amount}
            className="bg-white p-4 rounded-lg border placeholder-gray-600 text-gray-600 space-y-3 w-full"
          />

          <select
            name="method"
            defaultValue={payment.method}
            className="border placeholder-gray-600 text-gray-600 rounded px-3 py-2 w-full"
          >
            <option value="CASH">CASH</option>
            <option value="CARD">CARD</option>
            <option value="OTHER">OTHER</option>
          </select>

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer"
            >
              Save
            </button>

            <button
              type="button"
              onClick={() => setEditing(false)}
              className="bg-gray-200 px-4 py-2 text-gray-600 rounded hover:bg-gray-300 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </li>
  );
}

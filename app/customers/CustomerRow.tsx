"use client";

import { useState } from "react";
import { updateCustomer, deleteCustomer } from "./actions";

export function CustomerRow({ customer }: { customer: any }) {
  const [editing, setEditing] = useState(false);

  const handleSave = async (formData: FormData) => {
    await updateCustomer(formData);
    setEditing(false);
  };
  return (
    <li className="bg-white border rounded-lg p-4">
      {!editing ? (
        <div className="flex justify-between items-center">
          <div>
            <p className="font-semibold text-gray-600">{customer.name}</p>
            <p className="text-sm text-gray-600">
              {customer.phone} - {customer.email}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setEditing(true)}
              className="px-3 py-1 rounded bg-gray-200 text-gray-600 hover:bg-gray-300 cursor-pointer"
            >
              Edit
            </button>

            <form action={deleteCustomer}>
              <input type="hidden" name="id" value={customer.id} />
              <button
                type="submit"
                onClick={(e) => {
                  if (!confirm("Delete this customer?")) {
                    e.preventDefault();
                  }
                }}
                className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 cursor-pointer"
              >
                Delete
              </button>
            </form>
          </div>
        </div>
      ) : (
        <form action={handleSave} className="space-y-3">
          <input type="hidden" name="id" value={customer.id} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input
              name="name"
              defaultValue={customer.name}
              required
              className="border rounded px-3 py-2 placeholder-gray-600 text-gray-600"
            />
            <input
              name="phone"
              defaultValue={customer.phone ?? ""}
              className="border rounded px-3 py-2 placeholder-gray-600 text-gray-600"
            />
            <input
              name="email"
              defaultValue={customer.email ?? ""}
              className="border rounded px-3 py-2 placeholder-gray-600 text-gray-600"
            />
          </div>

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

"use client";

import { useState } from "react";
import { updateCustomer, deleteCustomer } from "./actions";

export function CustomerRow({ customer }: { customer: any }) {
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (formData: FormData) => {
    setError(null);
    try {
      await updateCustomer(formData);
      setEditing(false);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to update customer",
      );
    }
  };
  return (
    <li className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      {!editing ? (
        <div className="flex justify-between items-center">
          <div>
            <p className="font-semibold text-lg text-black">{customer.name}</p>
            <div className="flex flex-col sm:flex-row sm:gap-4 text-sm text-gray-500 mt-1">
              {customer.phone && (
                <span className="flex items-center gap-1">
                  📞 {customer.phone}
                </span>
              )}
              {customer.email && (
                <span className="flex items-center gap-1">
                  ✉️ {customer.email}
                </span>
              )}
              {!customer.phone && !customer.email && (
                <span className="italic text-gray-400">No contact info</span>
              )}
            </div>
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
                  await deleteCustomer(formData);
                } catch (err: unknown) {
                  setError(
                    err instanceof Error
                      ? err.message
                      : "Failed to delete customer",
                  );
                }
              }}
            >
              <input type="hidden" name="id" value={customer.id} />
              <button
                type="submit"
                onClick={(e) => {
                  if (!confirm("Delete this customer?")) {
                    e.preventDefault();
                  }
                }}
                className="px-3 py-1 text-sm rounded bg-white border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
              >
                Delete
              </button>
            </form>
          </div>

        </div>
      ) : (
        <form action={handleSave} className="space-y-4">
          <input type="hidden" name="id" value={customer.id} />

          <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
            <span className="font-semibold text-gray-700 text-sm">
              Edit Customer
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-gray-500 font-medium">Name</label>
              <input
                name="name"
                defaultValue={customer.name}
                required
                className="w-full border rounded px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">Phone</label>
              <input
                name="phone"
                defaultValue={customer.phone ?? ""}
                className="w-full border rounded px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">Email</label>
              <input
                name="email"
                defaultValue={customer.email ?? ""}
                className="w-full border rounded px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
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

"use client";

import { useState } from "react";
import { updateInvoice, deleteInvoice, emailInvoice } from "./actions";

export function InvoiceRow({ invoice }: { invoice: any }) {
  const [editing, setEditing] = useState(false);

  const [items, setItems] = useState(
    invoice.items?.length ? invoice.items : [{ description: "", price: "" }],
  );

  const addNewItem = () => {
    setItems([...items, { description: "", price: "" }]);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_: any, i: number) => i !== index);
    setItems(newItems);
  };

  const handleItemChange = (index: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  return (
    <li className="bg-white border rounded-lg p-4">
      {!editing ? (
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-black">
                {invoice.job.description}
              </p>
              <span
                className={`text-xs px-2 py-0.5 rounded ${
                  invoice.status === "PAID"
                    ? "bg-green-100 text-green-800"
                    : invoice.status === "UNPAID"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {invoice.status}
              </span>
            </div>
            <p className="font-bold text-lg mt-1">
              ${(invoice.amount / 100).toFixed(2)}
            </p>

            <p className="text-sm text-gray-700 mt-1">
              Customer: {invoice.job.customer?.name || "Deleted customer"}
            </p>

            <div className="mt-2 text-sm text-gray-500">
              {invoice.items.map((item: any, i: number) => (
                <div key={i}>
                  • {item.description} (${(item.price / 100).toFixed(2)})
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <a
                href={`/invoices/${invoice.id}/pdf`}
                target="_blank"
                className="px-3 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 cursor-pointer text-center"
              >
                PDF
              </a>
              <button
                onClick={() => setEditing(true)}
                className="px-3 py-1 text-sm rounded bg-gray-200 text-gray-600 hover:bg-gray-300 cursor-pointer"
              >
                Edit
              </button>
            </div>

            <form
              action={async () => {
                await emailInvoice(invoice.id);
                alert("Invoice sent!");
              }}
            >
              <button
                type="submit"
                className="text-sm text-blue-600 hover:underline w-full text-left"
              >
                Send Email
              </button>
            </form>

            <form action={deleteInvoice}>
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
            await updateInvoice(formData);
            setEditing(false);
          }}
          className="space-y-4"
        >
          <input type="hidden" name="id" value={invoice.id} />

          <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
            <span className="font-semibold text-gray-700">Edit Invoice</span>
            <select
              name="status"
              defaultValue={invoice.status}
              className="border bg-white text-gray-600 rounded px-2 py-1 text-sm"
            >
              <option value="UNPAID">UNPAID</option>
              <option value="IN_PROGRESS">IN PROGRESS</option>
              <option value="PAID">PAID</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600">Items</label>
            {items.map((item: any, index: number) => (
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
                  className="text-red-500 hover:text-red-700 px-2"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addNewItem}
              className="text-sm text-blue-600 hover:underline"
            >
              + Add Item
            </button>
          </div>

          <div className="flex gap-2 justify-end pt-2 border-t">
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setItems(invoice.items);
              }}
              className="bg-gray-200 px-4 py-2 text-gray-600 rounded hover:bg-gray-300 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}
    </li>
  );
}

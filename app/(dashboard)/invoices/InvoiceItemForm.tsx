"use client";

import { useState } from "react";

export default function InvoiceItemsForm() {
  const [items, setItems] = useState([{ description: "", price: "" }]);

  return (
    <div className="space-y-3">
      <p className="font-semibold text-black">Invoice Items</p>

      {items.map((item, index) => (
        <div key={index} className="grid grid-cols-3 gap-2">
          <input
            name={`items[${index}][description]`}
            placeholder="Description"
            required
            className="col-span-2 border rounded px-3 py-2"
          />

          <input
            name={`items[${index}][price]`}
            type="number"
            placeholder="Price (cents)"
            required
            className="border rounded px-3 py-2"
          />
        </div>
      ))}

      <button
        type="button"
        onClick={() => setItems([...items, { description: "", price: "" }])}
        className="text-sm text-blue-600 hover:underline"
      >
        + Add another item
      </button>
    </div>
  );
}

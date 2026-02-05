"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

export default function InvoiceItemsForm() {
  const [items, setItems] = useState([{ id: 0, description: "", price: "" }]);

  const removeItem = (index: number) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const addItem = () => {
    setItems([...items, { id: items.length, description: "", price: "" }]);
  };

  return (
    <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm font-semibold text-gray-700">Invoice Items</p>
        <span className="text-xs text-gray-400">Prices in cents</span>
      </div>

      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2 items-start group">
            <div className="flex-grow">
              <input
                name={`items[${index}][description]`}
                placeholder="Item Description"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white placeholder-gray-400 text-gray-800"
              />
            </div>

            <div className="w-28">
              <input
                name={`items[${index}][price]`}
                type="number"
                placeholder="0"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white placeholder-gray-400 text-gray-800"
              />
            </div>

            {items.length > 1 && (
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Remove item"
              >
                <X size={18} />
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addItem}
        className="flex items-center gap-1.5 text-sm text-blue-600 font-medium hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-md transition-colors w-fit mt-2"
      >
        <Plus size={16} />
        Add Item
      </button>
    </div>
  );
}

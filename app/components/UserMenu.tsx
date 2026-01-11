"use client";

import { useState } from "react";

export default function UserMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold"
      >
        M
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow">
          <button className="block w-full px-4 py-2 text-left hover:bg-gray-100">
            Profile
          </button>
          <button className="block w-full px-4 py-2 text-left hover:bg-gray-100">
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

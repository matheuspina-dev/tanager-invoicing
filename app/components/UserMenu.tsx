"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function UserMenu() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  if (status === "loading") {
    return <div className="w-8 h-8 rounded-full bg-gray-300 animate-pulse" />;
  }

  const user = session?.user;
  const initial =
    user?.name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? "?";

  return (
    <div className="relative">
      {/* Avatar / Auth button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-800 text-white font-bold flex items-center justify-center cursor-pointer"
      >
        {user ? initial : "?"}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white border rounded shadow z-50">
          {!user ? (
            <>
              <Link
                href="/login"
                className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => setOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => setOpen(false)}
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <div className="px-4 py-2 text-sm text-gray-500 border-b">
                {user.name || user.email}
              </div>

              <Link
                href="/profile"
                className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => setOpen(false)}
              >
                Profile
              </Link>

              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

"use client";

import UserMenu from "./UserMenu";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

const pageTitles: { [key: string]: string } = {
  "/dashboard": "Dashboard",
  "/customers": "Customers",
  "/invoices": "Invoices",
  "/jobs": "Jobs",
  "/payments": "Payments",
  "/settings": "Company Settings",
  "/profile": "My Profile",
};

export default function TopBar({
  onToggleSidebar,
}: {
  onToggleSidebar: () => void;
}) {
  const pathname = usePathname();
  const pageTitle =
    Object.entries(pageTitles).find(([path]) =>
      pathname.startsWith(path),
    )?.[1] || "Dashboard";

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-10">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        >
          <Menu size={20} />
        </button>

        <h1 className="text-xl font-semibold text-gray-800 tracking-tight">
          {pageTitle}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <UserMenu />
      </div>
    </header>
  );
}

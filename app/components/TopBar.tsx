"use client";

import UserMenu from "./UserMenu";
import { usePathname } from "next/navigation";

const pageTitles: { [key: string]: string } = {
  "/dashboard": "Dashboard",
  "/customers": "Customers",
  "/invoices": "Invoices",
  "/jobs": "Jobs",
  "/payments": "Payments",
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
    <header className="h-16 border-b flex items-center px-4 justify-between bg-background-light">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded hover:bg-gray-200 cursor-pointer"
        >
          ☰
        </button>
        <span className="font-semibold">{pageTitle}</span>
      </div>

      <UserMenu />
    </header>
  );
}

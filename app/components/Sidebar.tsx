"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, Users, FileText, CreditCard } from "lucide-react";

export default function Sidebar({ open }: { open: boolean }) {
  const pathname = usePathname();

  const links = [
    { href: "/jobs", label: "Jobs", icon: <Briefcase size={18} /> },
    { href: "/customers", label: "Customers", icon: <Users size={18} /> },
    { href: "/invoices", label: "Invoices", icon: <FileText size={18} /> },
    { href: "/payments", label: "Payments", icon: <CreditCard size={18} /> },
  ];

  return (
    <aside
      className={`border-r transition-all duration-200 
                  bg-bgLight text-textLight
                  ${open ? "w-64" : "w-16"}`}
    >
      <div className="h-16 flex items-center justify-center border-b">
        <span className="text-blue-600 font-bold text-lg">
          {open ? "Tanager Invoicing" : "TI"}
        </span>
      </div>

      <nav className={`p-2 flex flex-col gap-1 ${open ? "" : "items-center"}`}>
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors
                          ${
                            active
                              ? "bg-blue-600 text-white"
                              : "text-textLight hover:bg-gray-200"
                          }`}
            >
              {link.icon}
              {open ? link.label : null}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

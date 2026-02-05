"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  Users,
  FileText,
  CreditCard,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function Sidebar({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const pathname = usePathname();

  const links = [
    { href: "/jobs", label: "Jobs", icon: <Briefcase size={20} /> },
    { href: "/customers", label: "Customers", icon: <Users size={20} /> },
    { href: "/invoices", label: "Invoices", icon: <FileText size={20} /> },
    { href: "/payments", label: "Payments", icon: <CreditCard size={20} /> },
  ];

  const LinkItem = ({
    href,
    label,
    icon,
  }: {
    href: string;
    label: string;
    icon: React.ReactNode;
  }) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        className={`group flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
          ${open ? "justify-start gap-3" : "justify-center"} 
          ${
            active
              ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }
        `}
      >
        <span
          className={`${
            active ? "text-blue-600" : "text-gray-500 group-hover:text-gray-700"
          }`}
        >
          {icon}
        </span>

        <span
          className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${
            open ? "w-auto opacity-100" : "w-0 opacity-0"
          }`}
        >
          {label}
        </span>
      </Link>
    );
  };

  return (
    <aside
      className={`relative flex flex-col border-r bg-white h-screen transition-all duration-300 ease-in-out z-20 shadow-sm
        ${open ? "w-64" : "w-20"}
      `}
    >
      <button
        onClick={() => setOpen(!open)}
        className="absolute -right-3 top-8 bg-white border border-gray-200 rounded-full p-1 shadow-md hover:bg-gray-50 text-gray-500 z-50 hidden md:block"
      >
        {open ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </button>

      <div
        className={`h-16 flex items-center border-b border-gray-100 mb-2 transition-all duration-300 ${
          open ? "px-6 justify-start" : "justify-center"
        }`}
      >
        {open ? (
          <div className="font-bold text-xl text-gray-900 tracking-tight whitespace-nowrap overflow-hidden">
            <span className="text-blue-600">Tanager</span> Invoicing
          </div>
        ) : (
          <div className="bg-blue-600 text-white rounded-lg w-10 h-10 flex items-center justify-center font-bold text-xl shadow-md">
            TI
          </div>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map((link) => (
          <LinkItem key={link.href} {...link} />
        ))}
      </nav>

      <div className="p-3 border-t border-gray-100">
        <LinkItem
          href="/settings"
          label="Settings"
          icon={<Settings size={20} />}
        />
      </div>
    </aside>
  );
}

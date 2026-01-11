"use client";

import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Optional: auto-close sidebar on small screens
  useEffect(() => {
    if (window.innerWidth < 766) setSidebarOpen(false);
  }, []);

  return (
    <div className="flex min-h-screen bg-bgLight text-textLight transition-colors duration-300">
      <Sidebar open={sidebarOpen} />

      <div className="flex flex-col flex-1">
        <TopBar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

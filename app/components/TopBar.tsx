"use client";

import UserMenu from "./UserMenu";

export default function TopBar({
  onToggleSidebar,
}: {
  onToggleSidebar: () => void;
}) {
  return (
    <header
      className="h-16 border-b flex items-center px-4 justify-between
                 bg-background-light text-text-light
                 transition-colors duration-300"
    >
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded hover:bg-gray-200 cursor-pointer transition-colors"
        >
          ☰
        </button>
        <span className="font-semibold">Dashboard</span>
      </div>

      <div className="flex items-center gap-4">
        <UserMenu />
      </div>
    </header>
  );
}

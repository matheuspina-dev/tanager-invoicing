"use client";
import { useRouter } from "next/navigation";

interface StatusTabsProps {
  currentStatus: string;
  statuses: string[];
}

export default function StatusTabs({
  currentStatus,
  statuses,
}: StatusTabsProps) {
  const router = useRouter();

  function setStatus(value: string) {
    const url = new URL(window.location.href);
    if (value === "ALL") url.searchParams.delete("status");
    else url.searchParams.set("status", value);

    router.push(url.toString());
  }

  return (
    <div className="flex flex-wrap gap-2 mb-6 p-1 bg-gray-100/50 rounded-lg w-fit">
      {statuses.map((s) => {
        const isActive = currentStatus === s;
        return (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`
              px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200
              ${
                isActive
                  ? "bg-white text-blue-600 shadow-sm ring-1 ring-black/5"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
              }
            `}
          >
            {s.replace("_", " ")}
          </button>
        );
      })}
    </div>
  );
}

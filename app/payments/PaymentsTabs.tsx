"use client";
import { useRouter } from "next/navigation";

export default function PaymentsTabs({
  currentStatus,
}: {
  currentStatus: string;
}) {
  const router = useRouter();

  function setStatus(value: string) {
    const url = new URL(window.location.href);
    if (value === "ALL") url.searchParams.delete("status");
    else url.searchParams.set("status", value);

    router.push(url.toString());
  }

  return (
    <div className="flex gap-2 mb-4">
      {["UNPAID", "IN_PROGRESS", "PAID", "ALL"].map((s) => (
        <button
          key={s}
          onClick={() => setStatus(s)}
          className={`px-4 py-2 rounded cursor-pointer ${
            currentStatus === s
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-200 text-gray-600 hover:bg-gray-300"
          }`}
        >
          {s.replace("_", " ")}
        </button>
      ))}
    </div>
  );
}

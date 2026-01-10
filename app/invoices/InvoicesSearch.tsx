"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function InvoicesSearch({
  currentQuery,
}: {
  currentQuery: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(currentQuery);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    const url = new URL(window.location.href);
    if (e.target.value) url.searchParams.set("q", e.target.value);
    else url.searchParams.delete("q");

    router.push(url.toString());
  };

  return (
    <input
      placeholder="Search by job or customer..."
      value={value}
      onChange={onChange}
      className="w-full mb-4 border rounded px-3 py-2"
    />
  );
}

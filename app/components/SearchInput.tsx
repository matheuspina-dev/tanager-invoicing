"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface SearchInputProps {
  placeholder?: string;
  currentQuery: string;
}

export default function SearchInput({
  placeholder = "Search...",
  currentQuery,
}: SearchInputProps) {
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
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full mb-4 border rounded px-3 py-2 placeholder-gray-600 text-gray-600"
    />
  );
}

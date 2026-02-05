"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

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
    <div className="relative w-full mb-6">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search size={16} className="text-gray-400" />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow shadow-sm bg-white"
      />
    </div>
  );
}

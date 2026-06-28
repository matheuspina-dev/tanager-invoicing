"use client";

import { useState } from "react";
import { updateCompany } from "./actions";

export function CompanyForm({ company }: { company: any }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setMessage("");
    try {
      const res = await updateCompany(formData);
      setMessage(res.message);
      setIsError(false);
    } catch (err: unknown) {
      setMessage(
        err instanceof Error ? err.message : "Error updating settings",
      );
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      {message && (
        <div
          className={`p-3 rounded text-sm border ${
            isError
              ? "bg-red-50 text-red-700 border-red-100"
              : "bg-green-50 text-green-700 border-green-100"
          }`}
        >
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Name
          </label>
          <input
            name="name"
            defaultValue={company.name}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <textarea
            name="address"
            defaultValue={company.address || ""}
            placeholder="123 Main St, City, State, Zip"
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            This will appear on your PDF Invoices.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Email
          </label>
          <input
            name="email"
            defaultValue={company.email || ""}
            placeholder="billing@company.com"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Phone
          </label>
          <input
            name="phone"
            defaultValue={company.phone || ""}
            placeholder="(555) 123-4567"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Website
          </label>
          <input
            name="website"
            defaultValue={company.website || ""}
            placeholder="www.example.com"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? "Saving..." : "Save Company Details"}
        </button>
      </div>
    </form>
  );
}

"use client";

import { useState } from "react";
import { registerCompanyOwner, registerEmployee } from "./actions";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"owner" | "employee">("owner");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [successData, setSuccessData] = useState<{ code: string } | null>(null);

  async function handleOwnerSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const res = await registerCompanyOwner(formData);
    if (res.success) {
      setSuccessData({ code: res.companyCode });
    } else {
      setError(res.error);
    }
    setLoading(false);
  }

  async function handleEmployeeSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const res = await registerEmployee(formData);
    if (res.success) {
      router.push("/login?registered=true");
    } else {
      setError(res.error);
      setLoading(false);
    }
  }

  if (successData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Registration Successful!
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Your company has been created. Share this code with your employees
              so they can join.
            </p>

            <div className="mt-6 bg-gray-100 p-4 rounded-md border border-gray-200">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                Company Code
              </p>
              <p className="text-3xl font-mono font-bold text-blue-600 tracking-widest mt-1 select-all">
                {successData.code}
              </p>
            </div>

            <div className="mt-6">
              <Link
                href="/login"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Go to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create an account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
            <button
              type="button"
              onClick={() => {
                setMode("owner");
                setError(null);
              }}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all px-1 ${
                mode === "owner"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Company Owner
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("employee");
                setError(null);
              }}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                mode === "employee"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Employee
            </button>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form
            action={mode === "owner" ? handleOwnerSubmit : handleEmployeeSubmit}
            className="space-y-6"
          >
            {mode === "owner" && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Company Name
                </label>
                <div className="mt-1">
                  <input
                    name="company"
                    required
                    placeholder="Acme Inc."
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  name="name"
                  required
                  placeholder="John Doe"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="john@example.com"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  name="password"
                  type="password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            {mode === "employee" && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Company Code
                </label>
                <div className="mt-1">
                  <input
                    name="companyCode"
                    required
                    placeholder="e.g. A1B2C3"
                    className="uppercase appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-mono"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Ask your manager for this code.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading
                ? "Processing..."
                : mode === "owner"
                  ? "Register & Get Code"
                  : "Join Company"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

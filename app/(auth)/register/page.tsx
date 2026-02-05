"use client";

import { useState } from "react";
import { registerCompanyOwner, registerEmployee } from "./actions";

export default function RegisterPage() {
  const [mode, setMode] = useState<"owner" | "employee">("owner");
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="max-w-md mx-auto mt-10 space-y-6">
      <div className="flex justify-center gap-4">
        <button
          className={`btn ${mode === "owner" ? "btn-primary" : "btn-outline"}`}
          onClick={() => setMode("owner")}
        >
          Company Owner
        </button>
        <button
          className={`btn ${
            mode === "employee" ? "btn-primary" : "btn-outline"
          }`}
          onClick={() => setMode("employee")}
        >
          Employee
        </button>
      </div>

      {message && <div className="text-green-600">{message}</div>}

      {mode === "owner" && (
        <form
          action={async (formData: FormData) => {
            try {
              const res = await registerCompanyOwner(formData);
              setMessage(`Registered! Your company code: ${res.companyCode}`);
            } catch (err: any) {
              setMessage(err.message);
            }
          }}
          className="space-y-4"
        >
          <input
            name="name"
            placeholder="Your Name"
            required
            className="input"
          />
          <input
            name="company"
            placeholder="Company Name"
            required
            className="input"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="input"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="input"
          />
          <button type="submit" className="btn-primary w-full">
            Register as Owner
          </button>
        </form>
      )}

      {mode === "employee" && (
        <form
          action={async (formData: FormData) => {
            try {
              const res = await registerEmployee(formData);
              setMessage(res.message);
            } catch (err: any) {
              setMessage(err.message);
            }
          }}
          className="space-y-4"
        >
          <input
            name="name"
            placeholder="Your Name"
            required
            className="input"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="input"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="input"
          />
          <input
            name="companyCode"
            placeholder="Company Code"
            required
            className="input"
          />
          <button type="submit" className="btn-primary w-full">
            Register as Employee
          </button>
        </form>
      )}
    </div>
  );
}

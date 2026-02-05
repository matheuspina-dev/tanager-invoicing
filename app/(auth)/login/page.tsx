"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    if (!email || !password) {
      setError("Email and password required");
      return;
    }

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError(result.error);
    } else {
      window.location.href = "/customers";
    }
  }

  return (
    <form action={handleSubmit} className="max-w-md mx-auto mt-10 space-y-4">
      {error && <p className="text-red-500">{error}</p>}
      <input
        type="email"
        name="email"
        placeholder="Email"
        required
        className="input w-full"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        required
        className="input w-full"
      />
      <button type="submit" className="btn-primary w-full">
        Login
      </button>
    </form>
  );
}

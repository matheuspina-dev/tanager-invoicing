import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ResetPasswordForm from "./reset-password-form";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return <div className="p-10 text-center text-red-500">Invalid Link</div>;
  }

  const user = await prisma.user.findUnique({
    where: { resetToken: token },
  });

  const now = new Date();
  const isValid = user && user.resetTokenExpiry && user.resetTokenExpiry > now;

  if (!isValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded shadow">
          <h2 className="text-xl font-bold text-red-600 mb-2">Link Expired</h2>
          <p className="text-gray-600 mb-4">
            This password reset link is invalid or has expired.
          </p>
          <Link
            href="/forgot-password"
            className="text-blue-600 hover:underline"
          >
            Request a new one
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Set new password
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <ResetPasswordForm token={token} />
        </div>
      </div>
    </div>
  );
}

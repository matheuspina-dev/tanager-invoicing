import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function LandingPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <nav className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white font-bold p-1.5 rounded">
              TI
            </div>
            <span className="font-bold text-xl text-gray-900">
              Tanager Invoicing
            </span>
          </div>

          <div className="flex items-center gap-4">
            {session ? (
              <Link
                href="/jobs"
                className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-gray-900 font-medium text-sm"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        <section className="py-20 px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
            Manage your service business <br className="hidden md:block" />
            <span className="text-blue-600">without the chaos.</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
            The all-in-one platform for small businesses to track jobs, manage
            customers, send professional invoices, and track payments.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/register"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
            >
              Start For Free
            </Link>
            <Link
              href="#features"
              className="bg-white text-gray-700 border border-gray-300 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-50 transition"
            >
              Learn More
            </Link>
          </div>
        </section>

        <section id="features" className="bg-gray-50 py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-2xl">
                  📋
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Job Tracking
                </h3>
                <p className="text-gray-600">
                  Keep track of every job from "Open" to "Closed". Never lose
                  track of a customer request again.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 text-2xl">
                  💰
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Invoicing
                </h3>
                <p className="text-gray-600">
                  Generate professional PDF invoices in seconds. Email them
                  directly to clients and get paid faster.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 text-2xl">
                  👥
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">CRM</h3>
                <p className="text-gray-600">
                  A dedicated database for all your customers. Access phone
                  numbers, emails, and history instantly.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Tanager Ventures LLC. All rights
            reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="#"
              className="text-gray-500 hover:text-gray-900 text-sm"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="text-gray-500 hover:text-gray-900 text-sm"
            >
              Terms
            </Link>
            <Link
              href="#"
              className="text-gray-500 hover:text-gray-900 text-sm"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

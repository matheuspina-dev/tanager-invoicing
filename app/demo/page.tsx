import { DEMO_INVOICES, DEMO_CUSTOMERS, DEMO_COMPANY } from "@/lib/demo/seed";
import { formatCurrency, getStatusColor, getStatusLabel } from "@/lib/invoice-utils";
import { FileText, Users, Building2 } from "lucide-react";

/**
 * Read-only demo page.
 *
 * Accessible at /demo without authentication. Renders the seeded fixture data
 * so visitors can see the app's data model before signing in.
 */
export default function DemoPage() {
  const totalRevenue = DEMO_INVOICES.filter((i) => i.status === "PAID").reduce(
    (sum, i) => sum + i.amount,
    0,
  );
  const outstanding = DEMO_INVOICES.filter((i) => i.status !== "PAID").reduce(
    (sum, i) => sum + i.amount,
    0,
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white rounded-lg w-8 h-8 flex items-center justify-center font-bold text-sm">
              TI
            </div>
            <span className="font-bold text-gray-900">Tanager Invoicing</span>
          </div>
          <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2 py-1 rounded">
            Demo mode
          </span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Company banner */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-start gap-3">
            <Building2 size={20} className="text-blue-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-gray-900">{DEMO_COMPANY.name}</p>
              {DEMO_COMPANY.address && (
                <p className="text-sm text-gray-500 mt-0.5">
                  {DEMO_COMPANY.address}
                </p>
              )}
              {DEMO_COMPANY.phone && (
                <p className="text-sm text-gray-500">{DEMO_COMPANY.phone}</p>
              )}
            </div>
          </div>
        </section>

        {/* Summary cards */}
        <section
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          aria-label="Summary"
        >
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Total invoices
            </p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {DEMO_INVOICES.length}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Collected
            </p>
            <p className="text-2xl font-bold text-green-700 mt-1">
              {formatCurrency(totalRevenue)}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Outstanding
            </p>
            <p className="text-2xl font-bold text-red-700 mt-1">
              {formatCurrency(outstanding)}
            </p>
          </div>
        </section>

        {/* Invoices */}
        <section>
          <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-4">
            <FileText size={16} className="text-blue-600" />
            Invoices
          </h2>
          <ul className="space-y-3">
            {DEMO_INVOICES.map((inv) => (
              <li
                key={inv.id}
                className="bg-white rounded-xl border border-gray-200 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {inv.job.description}
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {inv.job.customer?.name ?? "No customer"}
                    </p>
                    <ul className="mt-2 space-y-0.5">
                      {inv.items.map((item) => (
                        <li key={item.id} className="text-sm text-gray-500">
                          &bull; {item.description} —{" "}
                          {formatCurrency(item.price)}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-gray-900">
                      {formatCurrency(inv.amount)}
                    </p>
                    <span
                      className={`inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded ${getStatusColor(inv.status)}`}
                    >
                      {getStatusLabel(inv.status)}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Customers */}
        <section>
          <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-4">
            <Users size={16} className="text-blue-600" />
            Customers
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DEMO_CUSTOMERS.map((cust) => (
              <li
                key={cust.id}
                className="bg-white rounded-xl border border-gray-200 p-4"
              >
                <p className="font-semibold text-gray-900">{cust.name}</p>
                {cust.phone && (
                  <p className="text-sm text-gray-500 mt-0.5">{cust.phone}</p>
                )}
                {cust.email && (
                  <p className="text-sm text-gray-500">{cust.email}</p>
                )}
              </li>
            ))}
          </ul>
        </section>

        <p className="text-xs text-gray-400 text-center pb-4">
          Demo data — not connected to a real database. Sign in for full access.
        </p>
      </main>
    </div>
  );
}

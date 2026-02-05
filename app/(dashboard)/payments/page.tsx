import { prisma } from "@/lib/prisma";
import { createPayment } from "./actions";
import { PaymentRow } from "./PaymentRow";
import SearchInput from "../../components/SearchInput";
import StatusTabs from "../../components/StatusTabs";
import { requireCompanyId } from "@/lib/auth";
import { CreditCard } from "lucide-react";

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string; q?: string }>;
}) {
  const companyId = await requireCompanyId();
  const params = await searchParams;
  const status = params?.status || "ALL";
  const q = params?.q || "";

  const payments = await prisma.payment.findMany({
    where: {
      companyId,
      AND: [
        status !== "ALL" ? { invoice: { status } } : {},
        q
          ? {
              OR: [
                {
                  invoice: {
                    job: { description: { contains: q, mode: "insensitive" } },
                  },
                },
                {
                  invoice: {
                    job: {
                      customer: { name: { contains: q, mode: "insensitive" } },
                    },
                  },
                },
              ],
            }
          : {},
      ],
    },
    include: { invoice: { include: { job: { include: { customer: true } } } } },
    orderBy: { createdAt: "desc" },
  });

  const invoices = await prisma.invoice.findMany({
    where: { companyId },
    include: { job: { include: { customer: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <StatusTabs
          currentStatus={status}
          statuses={["UNPAID", "IN_PROGRESS", "PAID", "ALL"]}
        />
        <div className="w-full md:w-1/3">
          <SearchInput currentQuery={q} placeholder="Search payments..." />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <CreditCard size={16} className="text-blue-600" />
          Record Payment
        </h2>

        <form action={createPayment} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              name="invoiceId"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
            >
              <option value="">Select Invoice to Pay</option>
              {invoices.map((invoice) => (
                <option key={invoice.id} value={invoice.id}>
                  #{invoice.id.slice(-4)} - {invoice.job.description} ($
                  {invoice.amount})
                </option>
              ))}
            </select>

            <input
              type="number"
              name="amount"
              placeholder="Amount (e.g. 500)"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="w-full md:w-1/3">
              <select
                name="method"
                defaultValue="CASH"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
              >
                <option value="CASH">CASH</option>
                <option value="CARD">CARD</option>
                <option value="OTHER">OTHER</option>
              </select>
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Record Payment
            </button>
          </div>
        </form>
      </div>

      <ul className="grid grid-cols-1 gap-4">
        {payments.map((payment) => (
          <PaymentRow key={payment.id} payment={payment} />
        ))}
        {payments.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No payments recorded.
          </div>
        )}
      </ul>
    </div>
  );
}

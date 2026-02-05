import { prisma } from "@/lib/prisma";
import { createInvoice } from "./actions";
import { InvoiceRow } from "./InvoiceRow";
import SearchInput from "../../components/SearchInput";
import StatusTabs from "../../components/StatusTabs";
import InvoiceItemsForm from "./InvoiceItemForm";
import { requireCompanyId } from "@/lib/auth";
import { FileText } from "lucide-react";

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string; q?: string }>;
}) {
  const companyId = await requireCompanyId();
  const params = await searchParams;
  const status = params?.status || "ALL";
  const q = params?.q || "";

  const invoices = await prisma.invoice.findMany({
    where: {
      companyId,
      AND: [
        status !== "ALL" ? { status } : {},
        q
          ? {
              OR: [
                { job: { description: { contains: q, mode: "insensitive" } } },
                {
                  job: {
                    customer: { name: { contains: q, mode: "insensitive" } },
                  },
                },
              ],
            }
          : {},
      ],
    },
    include: {
      job: { include: { customer: true } },
      items: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const jobs = await prisma.job.findMany({
    where: { companyId },
    include: { customer: true },
    orderBy: { description: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <StatusTabs
          currentStatus={status}
          statuses={["UNPAID", "IN_PROGRESS", "PAID", "ALL"]}
        />
        <div className="w-full md:w-1/3">
          <SearchInput currentQuery={q} placeholder="Search invoices..." />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileText size={16} className="text-blue-600" />
          Draft New Invoice
        </h2>

        <form action={createInvoice} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              name="jobId"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
            >
              <option value="">Select Job</option>
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.description}{" "}
                  {job.customer
                    ? `(${job.customer.name})`
                    : "- Deleted customer"}
                </option>
              ))}
            </select>

            <select
              name="status"
              defaultValue="UNPAID"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
            >
              <option value="UNPAID">UNPAID</option>
              <option value="IN_PROGRESS">IN PROGRESS</option>
              <option value="PAID">PAID</option>
            </select>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <InvoiceItemsForm />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Create Invoice
            </button>
          </div>
        </form>
      </div>

      <ul className="grid grid-cols-1 gap-4">
        {invoices.map((invoice) => (
          <InvoiceRow key={invoice.id} invoice={invoice} />
        ))}
        {invoices.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No invoices found.
          </div>
        )}
      </ul>
    </div>
  );
}

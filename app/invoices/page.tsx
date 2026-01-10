import { prisma } from "@/lib/prisma";
import { createInvoice } from "./actions";
import { InvoiceRow } from "./InvoiceRow";

export default async function InvoicesPage() {
  const invoices = await prisma.invoice.findMany({
    include: { job: { include: { customer: true } } },
    orderBy: { createdAt: "desc" },
  });

  const jobs = await prisma.job.findMany({
    include: { customer: true },
    orderBy: { description: "asc" },
  });

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-black">Invoices</h1>

      <form
        action={createInvoice}
        className="bg-white p-4 rounded-lg border-gray-100 space-y-3"
      >
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          required
          className="bg-white p-4 rounded-lg border placeholder-gray-600 text-gray-600 space-y-3 w-full"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <select
            name="jobId"
            required
            className="border placeholder-gray-600 text-gray-600 rounded px-3 py-2"
          >
            <option value="">Select Job</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.description} (Customer: {job.customer.name})
              </option>
            ))}
          </select>

          <select
            name="status"
            defaultValue="UNPAID"
            className="border placeholder-gray-600 text-gray-600 rounded px-3 py-2"
          >
            <option value="UNPAID">UNPAID</option>
            <option value="IN_PROGRESS">IN PROGRESS</option>
            <option value="PAID">PAID</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
        >
          Add Invoice
        </button>
      </form>

      <ul className="space-y-3">
        {invoices.map((invoice) => (
          <InvoiceRow key={invoice.id} invoice={invoice} />
        ))}
      </ul>
    </div>
  );
}

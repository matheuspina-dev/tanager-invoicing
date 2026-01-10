import { prisma } from "@/lib/prisma";
import { createPayment } from "./actions";
import { PaymentRow } from "./PaymentRow";

export default async function PaymentsPage() {
  const payments = await prisma.payment.findMany({
    include: { invoice: { include: { job: { include: { customer: true } } } } },
    orderBy: { createdAt: "desc" },
  });

  const invoices = await prisma.invoice.findMany({
    include: { job: { include: { customer: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-black">Payments</h1>

      <form
        action={createPayment}
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
            name="invoiceId"
            required
            className="border placeholder-gray-600 text-gray-600 rounded px-3 py-2"
          >
            <option value="">Select Invoice</option>
            {invoices.map((invoice) => (
              <option key={invoice.id} value={invoice.id}>
                {invoice.job.description}{" "}
                {invoice.job.customer
                  ? `Customer: ${invoice.job.customer.name}`
                  : "Deleted customer"}
                - ${invoice.amount} - {invoice.status}
              </option>
            ))}
          </select>

          <select
            name="method"
            defaultValue="CASH"
            className="border placeholder-gray-600 text-gray-600 rounded px-3 py-2"
          >
            <option value="CASH">CASH</option>
            <option value="CARD">CARD</option>
            <option value="OTHER">OTHER</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
        >
          Add Payment
        </button>
      </form>

      <ul className="space-y-3">
        {payments.map((payment) => (
          <PaymentRow key={payment.id} payment={payment} />
        ))}
      </ul>
    </div>
  );
}

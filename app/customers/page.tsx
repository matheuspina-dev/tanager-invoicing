import { prisma } from "@/lib/prisma";
import { createCustomer } from "./actions";
import { CustomerRow } from "./CustomerRow";
import CustomersSearch from "./CustomersSearch";

export default async function CustomersPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const q = params?.q || "";

  const customers = await prisma.customer.findMany({
    where: q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { phone: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
          ],
        }
      : {},
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-black">Customers</h1>

      <CustomersSearch currentQuery={q} />

      <form
        action={createCustomer}
        className="bg-white p-4 rounded-lg border-gray-100 space-y-3"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <input
            name="name"
            placeholder="Name"
            required
            className="border rounded px-3 py-2 placeholder-gray-600 text-gray-600"
          />
          <input
            name="phone"
            placeholder="Phone"
            className="border rounded px-3 py-2 placeholder-gray-600 text-gray-600"
          />
          <input
            name="email"
            placeholder="Email"
            className="border rounded px-3 py-2 placeholder-gray-600 text-gray-600"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
          >
            Add Customer
          </button>
        </div>
      </form>

      <ul className="space-y-3">
        {customers.map((customer) => (
          <CustomerRow key={customer.id} customer={customer} />
        ))}
      </ul>
    </div>
  );
}

import { prisma } from "@/lib/prisma";
import { createCustomer } from "./actions";
import { CustomerRow } from "./CustomerRow";
import SearchInput from "@/app/components/SearchInput";
import { requireCompanyId } from "@/lib/auth";
import { UserPlus } from "lucide-react";

export default async function CustomersPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const companyId = await requireCompanyId();
  const params = await searchParams;
  const q = params?.q || "";

  const customers = await prisma.customer.findMany({
    where: {
      companyId,
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { phone: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="w-full md:w-1/3">
          <SearchInput currentQuery={q} placeholder="Search customers..." />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <UserPlus size={16} className="text-blue-600" />
          Add New Customer
        </h2>
        <form
          action={createCustomer}
          className="flex flex-col md:flex-row gap-3"
        >
          <input
            name="name"
            placeholder="Name (Required)"
            required
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
          <input
            name="phone"
            placeholder="Phone"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
          <input
            name="email"
            placeholder="Email"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            Add Customer
          </button>
        </form>
      </div>

      <ul className="grid grid-cols-1 gap-4">
        {customers.map((customer) => (
          <CustomerRow key={customer.id} customer={customer} />
        ))}
        {customers.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No customers found.
          </div>
        )}
      </ul>
    </div>
  );
}

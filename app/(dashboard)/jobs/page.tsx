import { prisma } from "@/lib/prisma";
import { createJob } from "./actions";
import { JobRow } from "./JobRow";
import SearchInput from "../../components/SearchInput";
import StatusTabs from "../../components/StatusTabs";
import { requireCompanyId } from "@/lib/auth";
import { Briefcase } from "lucide-react";

export default async function JobsPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string; q?: string }>;
}) {
  const companyId = await requireCompanyId();
  const params = await searchParams;
  const status = params?.status || "ALL";
  const q = params?.q || "";

  const jobs = await prisma.job.findMany({
    where: {
      companyId,
      AND: [
        status !== "ALL" ? { status } : {},
        q
          ? {
              OR: [
                { description: { contains: q, mode: "insensitive" } },
                { customer: { name: { contains: q, mode: "insensitive" } } },
              ],
            }
          : {},
      ],
    },
    include: { customer: true },
    orderBy: { createdAt: "desc" },
  });

  const customers = await prisma.customer.findMany({
    where: { companyId },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <StatusTabs
          currentStatus={status}
          statuses={["OPEN", "IN_PROGRESS", "CLOSED", "ALL"]}
        />
        <div className="w-full md:w-1/3">
          <SearchInput
            currentQuery={q}
            placeholder="Search jobs or customers..."
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Briefcase size={16} className="text-blue-600" />
          Create New Job
        </h2>
        <form action={createJob} className="space-y-4">
          <input
            name="description"
            placeholder="Job Description (e.g. Kitchen Renovation)"
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <select
                name="customerId"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
              >
                <option value="">Select Customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>

            <select
              name="status"
              defaultValue="OPEN"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
            >
              <option value="OPEN">OPEN</option>
              <option value="IN_PROGRESS">IN PROGRESS</option>
              <option value="CLOSED">CLOSED</option>
            </select>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Create Job
            </button>
          </div>
        </form>
      </div>

      <ul className="grid grid-cols-1 gap-4">
        {jobs.map((job) => (
          <JobRow key={job.id} job={job} />
        ))}
        {jobs.length === 0 && (
          <div className="text-center py-10 text-gray-500">No jobs found.</div>
        )}
      </ul>
    </div>
  );
}

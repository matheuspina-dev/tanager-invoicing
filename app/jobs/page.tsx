import { prisma } from "@/lib/prisma";
import { createJob } from "./actions";
import JobsTabs from "./JobsTabs";
import JobsSearch from "./JobsSearch";
import { JobRow } from "./JobRow";

export default async function JobsPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string; q?: string }>;
}) {
  const params = await searchParams;

  const status = params?.status || "ALL";
  const q = params?.q || "";

  const jobs = await prisma.job.findMany({
    where: {
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
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-black">Jobs</h1>

      <JobsTabs currentStatus={status} />
      <JobsSearch currentQuery={q} />

      <form
        action={createJob}
        className="bg-white p-4 rounded-lg border-gray-100 space-y-3"
      >
        <input
          name="description"
          placeholder="Job Description"
          required
          className="bg-white p-4 rounded-lg border placeholder-gray-600 text-gray-600 w-full"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <select
            name="customerId"
            required
            className="border placeholder-gray-600 text-gray-600 rounded px-3 py-2"
          >
            <option value="">Select Customer</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>

          <select
            name="status"
            defaultValue="OPEN"
            className="border placeholder-gray-600 text-gray-600 rounded px-3 py-2"
          >
            <option value="OPEN">OPEN</option>
            <option value="IN_PROGRESS">IN PROGRESS</option>
            <option value="CLOSED">CLOSED</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
        >
          Add Job
        </button>
      </form>

      <ul className="space-y-3">
        {jobs.map((job) => (
          <JobRow key={job.id} job={job} />
        ))}
      </ul>
    </div>
  );
}

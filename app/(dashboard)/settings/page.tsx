import { requireCompanyId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CompanyForm } from "./CompanyForm";
import { Building, Users } from "lucide-react";

export default async function SettingsPage() {
  const companyId = await requireCompanyId();
  const session = await getServerSession(authOptions);

  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: {
      users: {
        select: { id: true, name: true, email: true, role: true },
      },
    },
  });

  if (!company) return <div>Company not found</div>;

  const isOwner = session?.user?.role === "OWNER";

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Manage your company profile and team.</p>
      </div>

      {isOwner && (
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
            <Building className="text-blue-600" size={20} />
            <h2 className="text-lg font-semibold text-gray-900">
              Company Details
            </h2>
          </div>

          <CompanyForm company={company} />
        </section>
      )}

      {isOwner && (
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-blue-900">
                Employee Invite Code
              </h2>
              <p className="text-sm text-blue-700 mt-1 max-w-lg">
                Share this code with your employees. They will need it to
                register and automatically join your company account.
              </p>
            </div>
            <div className="bg-white px-6 py-3 rounded-lg border-2 border-blue-200 border-dashed shadow-sm">
              <span className="text-3xl font-mono font-bold text-blue-600 tracking-widest select-all">
                {company.code}
              </span>
            </div>
          </div>
        </section>
      )}

      <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
          <Users className="text-gray-500" size={18} />
          <h3 className="font-semibold text-gray-700">Team Members</h3>
        </div>
        <ul className="divide-y divide-gray-100">
          {company.users.map((user) => (
            <li
              key={user.id}
              className="px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-bold">
                  {user.name?.[0]}
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${
                  user.role === "OWNER"
                    ? "bg-purple-50 text-purple-700 border-purple-100"
                    : "bg-gray-50 text-gray-600 border-gray-200"
                }`}
              >
                {user.role}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

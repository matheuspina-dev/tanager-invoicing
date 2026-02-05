import "@/app/globals.css";
import DashboardShell from "@/app/components/DashboardShell";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    // redirect to your login page if not logged in
    redirect("/login");
  }

  return <DashboardShell>{children}</DashboardShell>;
}

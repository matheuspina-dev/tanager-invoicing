"use server";

import { prisma } from "@/lib/prisma";
import { requireCompanyId } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateCompany(formData: FormData) {
  const companyId = await requireCompanyId();
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "OWNER") {
    throw new Error("Unauthorized: Only owners can update company settings");
  }

  const name = formData.get("name")?.toString();
  const address = formData.get("address")?.toString();
  const phone = formData.get("phone")?.toString();
  const email = formData.get("email")?.toString();
  const website = formData.get("website")?.toString();

  if (!name) throw new Error("Company Name is required");

  await prisma.company.update({
    where: { id: companyId },
    data: {
      name,
      address,
      phone,
      email,
      website,
    },
  });

  revalidatePath("/settings");
  return { message: "Company details updated successfully" };
}

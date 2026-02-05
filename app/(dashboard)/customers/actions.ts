"use server";

import { prisma } from "../../../lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

async function getUserCompanyId() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.companyId) throw new Error("Unauthorized");
  return session.user.companyId;
}

export async function createCustomer(formData: FormData) {
  const companyId = await getUserCompanyId();
  const name = formData.get("name") as string;
  const phone = formData.get("phone")?.toString() || null;
  const email = formData.get("email")?.toString() || null;

  if (!name) throw new Error("Name is required");

  await prisma.customer.create({ data: { name, phone, email, companyId } });
  revalidatePath("/customers");
}

export async function updateCustomer(formData: FormData) {
  const companyId = await getUserCompanyId();
  const id = formData.get("id") as string;
  if (!id) throw new Error("Customer ID required");

  const customer = await prisma.customer.findFirst({
    where: { id, companyId },
  });
  if (!customer) throw new Error("Customer not found");

  const name = formData.get("name") as string;
  const phone = formData.get("phone")?.toString() || null;
  const email = formData.get("email")?.toString() || null;

  await prisma.customer.update({
    where: { id: customer.id },
    data: { name, phone, email },
  });
  revalidatePath("/customers");
}

export async function deleteCustomer(formData: FormData) {
  const companyId = await getUserCompanyId();
  const id = formData.get("id") as string;
  if (!id) throw new Error("Customer ID required");

  const customer = await prisma.customer.findFirst({
    where: { id, companyId },
  });
  if (!customer) throw new Error("Customer not found");

  const blocked = await prisma.customer.findFirst({
    where: {
      id: customer.id,
      OR: [
        { jobs: { some: { status: { in: ["OPEN", "IN_PROGRESS"] } } } },
        {
          jobs: {
            some: {
              invoices: { some: { status: { in: ["UNPAID", "IN_PROGRESS"] } } },
            },
          },
        },
      ],
    },
  });

  if (blocked) throw new Error("Customer has active jobs or unpaid invoices");

  await prisma.customer.delete({ where: { id: customer.id } });
  revalidatePath("/customers");
}

"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getUserCompanyId } from "@/lib/auth";
import { requireFormId, requireRecord } from "@/lib/server-action-utils";

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
  const id = requireFormId(formData, "id", "Customer ID");

  const customer = await requireRecord(
    () => prisma.customer.findFirst({ where: { id, companyId } }),
    "Customer",
  );

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
  const id = requireFormId(formData, "id", "Customer ID");

  const customer = await requireRecord(
    () => prisma.customer.findFirst({ where: { id, companyId } }),
    "Customer",
  );

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

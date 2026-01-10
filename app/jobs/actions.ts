"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createJob(formData: FormData) {
  const description = formData.get("description") as string;
  const customerId = formData.get("customerId") as string;
  const status = (formData.get("status") as string) || "OPEN";

  if (!description || !customerId)
    throw new Error("Description and Customer required");

  await prisma.job.create({
    data: {
      description,
      customerId,
      status,
    },
  });

  revalidatePath("/jobs");
}

export async function updateJob(formData: FormData) {
  const id = formData.get("id") as string;
  const description = formData.get("description") as string;
  const status = formData.get("status") as string;

  if (!id) throw new Error("Job ID required");

  await prisma.job.update({
    where: { id },
    data: { description, status },
  });

  revalidatePath("/jobs");
}

export async function deleteJob(formData: FormData) {
  const id = formData.get("id") as string;

  if (!id) throw new Error("Job ID required");

  await prisma.job.delete({ where: { id } });

  revalidatePath("/jobs");
}

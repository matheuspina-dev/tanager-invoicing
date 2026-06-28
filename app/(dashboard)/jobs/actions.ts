"use server";

import { prisma } from "../../../lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { validateJobStatus } from "@/lib/validation";

async function getUserCompanyId() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.companyId) throw new Error("Unauthorized");
  return session.user.companyId;
}

export async function createJob(formData: FormData) {
  const companyId = await getUserCompanyId();
  const description = formData.get("description")?.toString();
  const customerId = formData.get("customerId")?.toString();
  const statusRaw = formData.get("status")?.toString() || "OPEN";
  const status = validateJobStatus(statusRaw);

  if (!description || !customerId)
    throw new Error("Description and Customer required");

  await prisma.job.create({
    data: { description, customerId, status, companyId },
  });
  revalidatePath("/jobs");
}

export async function updateJob(formData: FormData) {
  const companyId = await getUserCompanyId();
  const id = formData.get("id")?.toString();
  if (!id) throw new Error("Job ID required");

  const job = await prisma.job.findFirst({ where: { id, companyId } });
  if (!job) throw new Error("Job not found");

  const description =
    formData.get("description")?.toString() || job.description;
  const statusRaw = formData.get("status")?.toString() || job.status;
  const status = validateJobStatus(statusRaw);

  await prisma.job.update({
    where: { id: job.id },
    data: { description, status },
  });
  revalidatePath("/jobs");
}

export async function deleteJob(formData: FormData) {
  const companyId = await getUserCompanyId();
  const id = formData.get("id")?.toString();
  if (!id) throw new Error("Job ID required");

  const job = await prisma.job.findFirst({ where: { id, companyId } });
  if (!job) throw new Error("Job not found");

  await prisma.job.delete({ where: { id: job.id } });
  revalidatePath("/jobs");
}

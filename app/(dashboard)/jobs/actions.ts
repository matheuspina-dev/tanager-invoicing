"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getUserCompanyId } from "@/lib/auth";
import { requireFormId, requireRecord } from "@/lib/server-action-utils";
import { validateJobStatus } from "@/lib/validation";

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
  const id = requireFormId(formData, "id", "Job ID");

  const job = await requireRecord(
    () => prisma.job.findFirst({ where: { id, companyId } }),
    "Job",
  );

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
  const id = requireFormId(formData, "id", "Job ID");

  const job = await requireRecord(
    () => prisma.job.findFirst({ where: { id, companyId } }),
    "Job",
  );

  await prisma.job.delete({ where: { id: job.id } });
  revalidatePath("/jobs");
}

"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";

export async function registerCompanyOwner(formData: FormData) {
  const name = formData.get("name")?.toString();
  const companyName = formData.get("company")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!name || !companyName || !email || !password)
    throw new Error("All fields are required");

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error("Email already registered");

  const code = Math.random().toString(36).substring(2, 8).toUpperCase();

  const company = await prisma.company.create({
    data: { name: companyName, code },
  });

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      companyId: company.id,
      role: "OWNER",
    },
  });

  revalidatePath("/");
  return { message: "Company created successfully", companyCode: code };
}

export async function registerEmployee(formData: FormData) {
  const name = formData.get("name")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const companyCode = formData.get("companyCode")?.toString();

  if (!name || !email || !password || !companyCode)
    throw new Error("All fields are required");

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error("Email already registered");

  const company = await prisma.company.findUnique({
    where: { code: companyCode },
  });
  if (!company) throw new Error("Invalid company code");

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      companyId: company.id,
      role: "EMPLOYEE",
    },
  });

  revalidatePath("/");
  return { message: "Employee registered successfully" };
}

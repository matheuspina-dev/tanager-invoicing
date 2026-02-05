"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function registerCompanyOwner(formData: FormData) {
  const name = formData.get("name")?.toString();
  const companyName = formData.get("company")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!name || !companyName || !email || !password) {
    throw new Error("All fields are required");
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error("Email already registered");

  const code = Math.random().toString(36).substring(2, 8).toUpperCase();

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.$transaction(async (tx) => {
    const company = await tx.company.create({
      data: {
        name: companyName,
        code,
      },
    });

    await tx.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        companyId: company.id,
        role: "OWNER",
      },
    });
  });

  return { success: true, companyCode: code };
}

export async function registerEmployee(formData: FormData) {
  const name = formData.get("name")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const companyCode = formData
    .get("companyCode")
    ?.toString()
    .trim()
    .toUpperCase();

  if (!name || !email || !password || !companyCode) {
    throw new Error("All fields are required");
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error("Email already registered");

  const company = await prisma.company.findUnique({
    where: { code: companyCode },
  });

  if (!company) throw new Error("Invalid Company Code");

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

  return { success: true };
}

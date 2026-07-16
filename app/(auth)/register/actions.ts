"use server";

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { validatePassword, validateEmail } from "@/lib/validation";

export async function registerCompanyOwner(formData: FormData) {
  const name = formData.get("name")?.toString();
  const companyName = formData.get("company")?.toString();
  const emailRaw = formData.get("email")?.toString();
  const passwordRaw = formData.get("password")?.toString();

  if (!name || !companyName || !emailRaw || !passwordRaw) {
    throw new Error("All fields are required");
  }

  const email = validateEmail(emailRaw);
  const password = validatePassword(passwordRaw);

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error("Email already registered");

  const code = crypto.randomBytes(4).toString("hex").toUpperCase();

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
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
  const emailRaw = formData.get("email")?.toString();
  const passwordRaw = formData.get("password")?.toString();
  const companyCode = formData
    .get("companyCode")
    ?.toString()
    .trim()
    .toUpperCase();

  if (!name || !emailRaw || !passwordRaw || !companyCode) {
    throw new Error("All fields are required");
  }

  const email = validateEmail(emailRaw);
  const password = validatePassword(passwordRaw);

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

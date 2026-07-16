"use server";

import type { PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { validatePassword, validateEmail } from "@/lib/validation";

type TransactionClient = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

export type RegisterOwnerResult =
  | { success: true; companyCode: string }
  | { success: false; error: string };

export type RegisterEmployeeResult =
  | { success: true }
  | { success: false; error: string };

export async function registerCompanyOwner(
  formData: FormData,
): Promise<RegisterOwnerResult> {
  const name = formData.get("name")?.toString();
  const companyName = formData.get("company")?.toString();
  const emailRaw = formData.get("email")?.toString();
  const passwordRaw = formData.get("password")?.toString();

  if (!name || !companyName || !emailRaw || !passwordRaw) {
    return { success: false, error: "All fields are required" };
  }

  let email: string;
  let password: string;
  try {
    email = validateEmail(emailRaw);
    password = validatePassword(passwordRaw);
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Invalid input",
    };
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return { success: false, error: "Email already registered" };
  }

  const code = crypto.randomBytes(4).toString("hex").toUpperCase();

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.$transaction(async (tx: TransactionClient) => {
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

export async function registerEmployee(
  formData: FormData,
): Promise<RegisterEmployeeResult> {
  const name = formData.get("name")?.toString();
  const emailRaw = formData.get("email")?.toString();
  const passwordRaw = formData.get("password")?.toString();
  const companyCode = formData
    .get("companyCode")
    ?.toString()
    .trim()
    .toUpperCase();

  if (!name || !emailRaw || !passwordRaw || !companyCode) {
    return { success: false, error: "All fields are required" };
  }

  let email: string;
  let password: string;
  try {
    email = validateEmail(emailRaw);
    password = validatePassword(passwordRaw);
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Invalid input",
    };
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return { success: false, error: "Email already registered" };
  }

  const company = await prisma.company.findUnique({
    where: { code: companyCode },
  });

  if (!company) {
    return { success: false, error: "Invalid Company Code" };
  }

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

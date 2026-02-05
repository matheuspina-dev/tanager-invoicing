import { prisma } from "../lib/prisma";

async function main() {
  // 1️⃣ Create a default company
  const company = await prisma.company.create({
    data: { name: "Default Company" },
  });

  // 2️⃣ Update all existing customers
  await prisma.customer.updateMany({
    data: { companyId: company.id },
  });

  // 3️⃣ Update all existing jobs
  await prisma.job.updateMany({
    data: { companyId: company.id },
  });

  // 4️⃣ Update all existing invoices
  await prisma.invoice.updateMany({
    data: { companyId: company.id },
  });

  // 5️⃣ Update all existing payments
  await prisma.payment.updateMany({
    data: { companyId: company.id },
  });

  console.log("Backfilled all companyId fields!");
}

main();

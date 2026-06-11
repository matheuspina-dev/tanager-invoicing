/**
 * Prisma seed script.
 *
 * Inserts demo data into the development database.
 * Run with:
 *   pnpm db:seed
 *
 * The data matches the static fixtures in lib/demo/seed.ts so the app
 * looks the same whether running against the DB or in demo mode.
 */

import { PrismaClient } from "@prisma/client";
import {
  DEMO_COMPANY,
  DEMO_CUSTOMERS,
  DEMO_JOBS,
  DEMO_INVOICES,
} from "../lib/demo/seed";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding demo data…");

  // Company
  const company = await prisma.company.upsert({
    where: { code: DEMO_COMPANY.code },
    update: {},
    create: {
      id: DEMO_COMPANY.id,
      name: DEMO_COMPANY.name,
      code: DEMO_COMPANY.code,
      address: DEMO_COMPANY.address ?? undefined,
      email: DEMO_COMPANY.email ?? undefined,
      phone: DEMO_COMPANY.phone ?? undefined,
      website: DEMO_COMPANY.website ?? undefined,
    },
  });
  console.log(`  company: ${company.name}`);

  // Customers
  for (const c of DEMO_CUSTOMERS) {
    await prisma.customer.upsert({
      where: { id: c.id },
      update: {},
      create: {
        id: c.id,
        name: c.name,
        phone: c.phone ?? undefined,
        email: c.email ?? undefined,
        companyId: company.id,
      },
    });
  }
  console.log(`  customers: ${DEMO_CUSTOMERS.length}`);

  // Jobs
  for (const j of DEMO_JOBS) {
    await prisma.job.upsert({
      where: { id: j.id },
      update: {},
      create: {
        id: j.id,
        description: j.description,
        status: j.status,
        companyId: company.id,
        customerId: j.customerId ?? undefined,
      },
    });
  }
  console.log(`  jobs: ${DEMO_JOBS.length}`);

  // Invoices with items
  for (const inv of DEMO_INVOICES) {
    await prisma.invoice.upsert({
      where: { id: inv.id },
      update: {},
      create: {
        id: inv.id,
        amount: inv.amount,
        status: inv.status,
        companyId: company.id,
        jobId: inv.jobId,
        items: {
          create: inv.items.map((item) => ({
            id: item.id,
            description: item.description,
            price: item.price,
          })),
        },
      },
    });
  }
  console.log(`  invoices: ${DEMO_INVOICES.length}`);

  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });

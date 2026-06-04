/**
 * Static demo fixtures for the application.
 *
 * These are used in two places:
 *  1. The /demo page, which renders invoice data without a live database.
 *  2. The Prisma seed script (prisma/seed.ts), which inserts them into a
 *     local development database.
 *
 * All monetary amounts are integer cents.
 */

import type {
  Company,
  Customer,
  Job,
  Invoice,
  InvoiceItem,
  Payment,
  InvoiceWithRelations,
} from "../types";

export const DEMO_COMPANY: Company = {
  id: "demo-company-1",
  name: "Peak Contracting LLC",
  code: "PEAK01",
  address: "412 Ridgeline Ave, Denver, CO 80203",
  email: "billing@peakcontracting.example",
  phone: "(720) 555-0190",
  website: "https://peakcontracting.example",
  createdAt: new Date("2024-01-15"),
};

export const DEMO_CUSTOMERS: Customer[] = [
  {
    id: "demo-customer-1",
    name: "Riverside Property Group",
    phone: "(303) 555-0142",
    email: "accounts@riverside.example",
    companyId: DEMO_COMPANY.id,
    createdAt: new Date("2024-02-01"),
  },
  {
    id: "demo-customer-2",
    name: "Hartley & Sons Construction",
    phone: "(720) 555-0277",
    email: "billing@hartley.example",
    companyId: DEMO_COMPANY.id,
    createdAt: new Date("2024-03-10"),
  },
  {
    id: "demo-customer-3",
    name: "Aurora Medical Center",
    phone: "(303) 555-0389",
    email: null,
    companyId: DEMO_COMPANY.id,
    createdAt: new Date("2024-04-22"),
  },
];

export const DEMO_JOBS: Job[] = [
  {
    id: "demo-job-1",
    description: "Commercial HVAC installation — Building A",
    status: "OPEN",
    companyId: DEMO_COMPANY.id,
    customerId: "demo-customer-1",
    createdAt: new Date("2024-05-01"),
  },
  {
    id: "demo-job-2",
    description: "Roof replacement — 14 units",
    status: "OPEN",
    companyId: DEMO_COMPANY.id,
    customerId: "demo-customer-2",
    createdAt: new Date("2024-05-15"),
  },
  {
    id: "demo-job-3",
    description: "Electrical panel upgrade",
    status: "CLOSED",
    companyId: DEMO_COMPANY.id,
    customerId: "demo-customer-3",
    createdAt: new Date("2024-06-10"),
  },
  {
    id: "demo-job-4",
    description: "Plumbing — main line repair",
    status: "OPEN",
    companyId: DEMO_COMPANY.id,
    customerId: "demo-customer-1",
    createdAt: new Date("2024-07-03"),
  },
];

const INVOICE_ITEMS: Record<string, InvoiceItem[]> = {
  "demo-invoice-1": [
    {
      id: "item-1-1",
      invoiceId: "demo-invoice-1",
      description: "HVAC unit (3-ton commercial)",
      price: 425000,
    },
    {
      id: "item-1-2",
      invoiceId: "demo-invoice-1",
      description: "Labor — 2 technicians, 3 days",
      price: 180000,
    },
    {
      id: "item-1-3",
      invoiceId: "demo-invoice-1",
      description: "Refrigerant and fittings",
      price: 18500,
    },
  ],
  "demo-invoice-2": [
    {
      id: "item-2-1",
      invoiceId: "demo-invoice-2",
      description: "Architectural shingles — 22 squares",
      price: 308000,
    },
    {
      id: "item-2-2",
      invoiceId: "demo-invoice-2",
      description: "Tear-off and disposal",
      price: 60000,
    },
    {
      id: "item-2-3",
      invoiceId: "demo-invoice-2",
      description: "Underlayment and ice shield",
      price: 22500,
    },
    {
      id: "item-2-4",
      invoiceId: "demo-invoice-2",
      description: "Labor",
      price: 95000,
    },
  ],
  "demo-invoice-3": [
    {
      id: "item-3-1",
      invoiceId: "demo-invoice-3",
      description: "200A panel and breakers",
      price: 87500,
    },
    {
      id: "item-3-2",
      invoiceId: "demo-invoice-3",
      description: "Permit and inspection fees",
      price: 31000,
    },
    {
      id: "item-3-3",
      invoiceId: "demo-invoice-3",
      description: "Labor — licensed electrician, 2 days",
      price: 96000,
    },
  ],
  "demo-invoice-4": [
    {
      id: "item-4-1",
      invoiceId: "demo-invoice-4",
      description: "Main line excavation and repair",
      price: 145000,
    },
    {
      id: "item-4-2",
      invoiceId: "demo-invoice-4",
      description: "Pipe materials",
      price: 38000,
    },
  ],
};

const DEMO_INVOICES_BASE: Invoice[] = [
  {
    id: "demo-invoice-1",
    amount: 623500,
    status: "UNPAID",
    companyId: DEMO_COMPANY.id,
    jobId: "demo-job-1",
    createdAt: new Date("2024-05-20"),
  },
  {
    id: "demo-invoice-2",
    amount: 485500,
    status: "IN_PROGRESS",
    companyId: DEMO_COMPANY.id,
    jobId: "demo-job-2",
    createdAt: new Date("2024-06-01"),
  },
  {
    id: "demo-invoice-3",
    amount: 214500,
    status: "PAID",
    companyId: DEMO_COMPANY.id,
    jobId: "demo-job-3",
    createdAt: new Date("2024-06-15"),
  },
  {
    id: "demo-invoice-4",
    amount: 183000,
    status: "UNPAID",
    companyId: DEMO_COMPANY.id,
    jobId: "demo-job-4",
    createdAt: new Date("2024-07-10"),
  },
];

const DEMO_PAYMENTS: Payment[] = [
  {
    id: "demo-payment-1",
    amount: 200000,
    method: "Bank transfer",
    companyId: DEMO_COMPANY.id,
    invoiceId: "demo-invoice-2",
    createdAt: new Date("2024-06-20"),
  },
  {
    id: "demo-payment-2",
    amount: 214500,
    method: "Check",
    companyId: DEMO_COMPANY.id,
    invoiceId: "demo-invoice-3",
    createdAt: new Date("2024-06-28"),
  },
];

/** Customer map keyed by id for fast lookup when building relations. */
const customerMap: Record<string, Customer> = Object.fromEntries(
  DEMO_CUSTOMERS.map((c) => [c.id, c]),
);

/** Job map keyed by id. */
const jobMap: Record<string, Job> = Object.fromEntries(
  DEMO_JOBS.map((j) => [j.id, j]),
);

/** Payment map keyed by invoiceId. */
const paymentsByInvoice: Record<string, Payment[]> = {};
for (const p of DEMO_PAYMENTS) {
  if (!paymentsByInvoice[p.invoiceId]) paymentsByInvoice[p.invoiceId] = [];
  paymentsByInvoice[p.invoiceId].push(p);
}

/**
 * Fully hydrated demo invoices with job, customer, items, and payments.
 * Ready to pass directly to InvoiceTable or InvoiceRow without a DB query.
 */
export const DEMO_INVOICES: InvoiceWithRelations[] = DEMO_INVOICES_BASE.map(
  (inv) => {
    const job = jobMap[inv.jobId];
    const customer = job.customerId ? customerMap[job.customerId] : undefined;
    return {
      ...inv,
      job: { ...job, customer: customer ?? null },
      items: INVOICE_ITEMS[inv.id] ?? [],
      payments: paymentsByInvoice[inv.id] ?? [],
    };
  },
);

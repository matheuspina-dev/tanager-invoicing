/**
 * Shared domain types for the invoicing application.
 *
 * These interfaces mirror the Prisma schema and are safe to import from both
 * client components and server code. They intentionally omit Prisma-generated
 * metadata types so the shapes can be used in tests without a database.
 */

export interface Company {
  id: string;
  name: string;
  code: string;
  address?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  createdAt: Date;
}

export interface Customer {
  id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  companyId: string;
  createdAt: Date;
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  description: string;
  /** Price stored as integer cents. */
  price: number;
}

export type InvoiceStatus = "UNPAID" | "IN_PROGRESS" | "PAID";

export interface Invoice {
  id: string;
  /** Amount stored as integer cents. */
  amount: number;
  status: InvoiceStatus | string;
  companyId: string;
  jobId: string;
  createdAt: Date;
}

export interface Job {
  id: string;
  description: string;
  status: string;
  companyId: string;
  customerId?: string | null;
  createdAt: Date;
}

export interface Payment {
  id: string;
  /** Amount stored as integer cents. */
  amount: number;
  method: string;
  companyId: string;
  invoiceId: string;
  createdAt: Date;
}

/** Invoice with all relations included — used in list and detail views. */
export interface InvoiceWithRelations extends Invoice {
  job: Job & { customer?: Customer | null };
  items: InvoiceItem[];
  payments?: Payment[];
}

/** Customer with job count — used in the customers list view. */
export interface CustomerWithJobCount extends Customer {
  _count?: { jobs: number };
}

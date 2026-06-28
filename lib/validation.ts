const INVOICE_STATUSES = ["UNPAID", "IN_PROGRESS", "PAID"] as const;
const JOB_STATUSES = ["OPEN", "IN_PROGRESS", "CLOSED"] as const;
const PAYMENT_METHODS = ["CASH", "CARD", "OTHER"] as const;

export type InvoiceStatus = (typeof INVOICE_STATUSES)[number];
export type JobStatus = (typeof JOB_STATUSES)[number];
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export function validateInvoiceStatus(status: string): InvoiceStatus {
  if (!INVOICE_STATUSES.includes(status as InvoiceStatus)) {
    throw new Error(`Invalid invoice status: ${status}`);
  }
  return status as InvoiceStatus;
}

export function validateJobStatus(status: string): JobStatus {
  if (!JOB_STATUSES.includes(status as JobStatus)) {
    throw new Error(`Invalid job status: ${status}`);
  }
  return status as JobStatus;
}

export function validatePaymentMethod(method: string): PaymentMethod {
  if (!PAYMENT_METHODS.includes(method as PaymentMethod)) {
    throw new Error(`Invalid payment method: ${method}`);
  }
  return method as PaymentMethod;
}

export function validatePassword(password: string): string {
  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters long");
  }
  if (!/[A-Z]/.test(password)) {
    throw new Error("Password must contain at least one uppercase letter");
  }
  if (!/[a-z]/.test(password)) {
    throw new Error("Password must contain at least one lowercase letter");
  }
  if (!/[0-9]/.test(password)) {
    throw new Error("Password must contain at least one number");
  }
  return password;
}

export function validateEmail(email: string): string {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email address");
  }
  return email.toLowerCase().trim();
}

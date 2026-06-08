import { describe, it, expect } from "vitest";
import {
  DEMO_INVOICES,
  DEMO_CUSTOMERS,
  DEMO_COMPANY,
  DEMO_JOBS,
} from "@/lib/demo/seed";

describe("DEMO_COMPANY", () => {
  it("has required fields", () => {
    expect(DEMO_COMPANY.id).toBeTruthy();
    expect(DEMO_COMPANY.name).toBeTruthy();
    expect(DEMO_COMPANY.code).toBeTruthy();
  });
});

describe("DEMO_CUSTOMERS", () => {
  it("contains at least one customer", () => {
    expect(DEMO_CUSTOMERS.length).toBeGreaterThan(0);
  });

  it("every customer belongs to the demo company", () => {
    for (const c of DEMO_CUSTOMERS) {
      expect(c.companyId).toBe(DEMO_COMPANY.id);
    }
  });

  it("every customer has a non-empty name", () => {
    for (const c of DEMO_CUSTOMERS) {
      expect(c.name.length).toBeGreaterThan(0);
    }
  });
});

describe("DEMO_JOBS", () => {
  it("contains at least one job", () => {
    expect(DEMO_JOBS.length).toBeGreaterThan(0);
  });

  it("every job has a description and status", () => {
    for (const j of DEMO_JOBS) {
      expect(j.description.length).toBeGreaterThan(0);
      expect(j.status).toBeTruthy();
    }
  });
});

describe("DEMO_INVOICES", () => {
  it("contains at least four invoices", () => {
    expect(DEMO_INVOICES.length).toBeGreaterThanOrEqual(4);
  });

  it("covers all three invoice status variants", () => {
    const statuses = new Set(DEMO_INVOICES.map((inv) => inv.status));
    expect(statuses.has("UNPAID")).toBe(true);
    expect(statuses.has("IN_PROGRESS")).toBe(true);
    expect(statuses.has("PAID")).toBe(true);
  });

  it("every invoice has at least one line item", () => {
    for (const inv of DEMO_INVOICES) {
      expect(inv.items.length).toBeGreaterThan(0);
    }
  });

  it("every invoice amount matches the sum of its items", () => {
    for (const inv of DEMO_INVOICES) {
      const sum = inv.items.reduce((acc, item) => acc + item.price, 0);
      expect(inv.amount).toBe(sum);
    }
  });

  it("every invoice references a valid job and customer", () => {
    for (const inv of DEMO_INVOICES) {
      expect(inv.job).toBeTruthy();
      expect(inv.job.description.length).toBeGreaterThan(0);
      // customer may be null if the job has no customer, but the job field must exist
      expect(typeof inv.job.customer === "object").toBe(true);
    }
  });
});

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { JobRow } from "@/app/(dashboard)/jobs/JobRow";

vi.mock("@/app/(dashboard)/jobs/actions", () => ({
  updateJob: vi.fn(),
  deleteJob: vi.fn(),
}));

const MOCK_JOB = {
  id: "job-1",
  description: "Commercial HVAC installation",
  status: "OPEN",
  companyId: "co-1",
  customerId: "cust-1",
  customer: { name: "Riverside Property Group" },
};

describe("JobRow", () => {
  it("renders the job description", () => {
    render(<JobRow job={MOCK_JOB} />);
    expect(screen.getByText("Commercial HVAC installation")).toBeInTheDocument();
  });

  it("renders the job status badge", () => {
    render(<JobRow job={MOCK_JOB} />);
    expect(screen.getByText("OPEN")).toBeInTheDocument();
  });

  it("renders the customer name", () => {
    render(<JobRow job={MOCK_JOB} />);
    expect(screen.getByText("Riverside Property Group")).toBeInTheDocument();
  });

  it("shows 'Deleted customer' when customer is null", () => {
    const job = { ...MOCK_JOB, customer: null };
    render(<JobRow job={job} />);
    expect(screen.getByText("Deleted customer")).toBeInTheDocument();
  });

  it("applies correct status color class for OPEN", () => {
    render(<JobRow job={MOCK_JOB} />);
    const badge = screen.getByText("OPEN");
    expect(badge.className).toContain("bg-blue-100");
    expect(badge.className).toContain("text-blue-800");
  });

  it("applies correct status color class for CLOSED", () => {
    const job = { ...MOCK_JOB, status: "CLOSED" };
    render(<JobRow job={job} />);
    const badge = screen.getByText("CLOSED");
    expect(badge.className).toContain("bg-gray-100");
  });

  it("applies correct status color class for IN_PROGRESS", () => {
    const job = { ...MOCK_JOB, status: "IN_PROGRESS" };
    render(<JobRow job={job} />);
    const badge = screen.getByText("IN PROGRESS");
    expect(badge.className).toContain("bg-yellow-100");
  });

  it("shows the edit form when Edit is clicked", async () => {
    render(<JobRow job={MOCK_JOB} />);
    await userEvent.click(screen.getByText("Edit"));
    expect(screen.getByText("Edit Job")).toBeInTheDocument();
  });

  it("hides the edit form when Cancel is clicked", async () => {
    render(<JobRow job={MOCK_JOB} />);
    await userEvent.click(screen.getByText("Edit"));
    expect(screen.getByText("Edit Job")).toBeInTheDocument();
    await userEvent.click(screen.getByText("Cancel"));
    expect(screen.queryByText("Edit Job")).not.toBeInTheDocument();
  });

  it("pre-fills the description input in edit mode", async () => {
    render(<JobRow job={MOCK_JOB} />);
    await userEvent.click(screen.getByText("Edit"));
    const descInput = screen.getByDisplayValue("Commercial HVAC installation") as HTMLInputElement;
    expect(descInput.name).toBe("description");
  });

  it("renders a status select with OPEN, IN PROGRESS, CLOSED options in edit mode", async () => {
    render(<JobRow job={MOCK_JOB} />);
    await userEvent.click(screen.getByText("Edit"));
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    expect(select.name).toBe("status");
    expect(select.options).toHaveLength(3);
  });
});

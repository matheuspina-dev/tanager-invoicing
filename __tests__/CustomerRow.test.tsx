import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CustomerRow } from "@/app/(dashboard)/customers/CustomerRow";

vi.mock("@/app/(dashboard)/customers/actions", () => ({
  updateCustomer: vi.fn(),
  deleteCustomer: vi.fn(),
}));

const MOCK_CUSTOMER = {
  id: "cust-1",
  name: "Riverside Property Group",
  phone: "(303) 555-0142",
  email: "accounts@riverside.example",
  companyId: "co-1",
};

describe("CustomerRow", () => {
  it("renders the customer name", () => {
    render(<CustomerRow customer={MOCK_CUSTOMER} />);
    expect(screen.getByText("Riverside Property Group")).toBeInTheDocument();
  });

  it("renders the customer phone", () => {
    render(<CustomerRow customer={MOCK_CUSTOMER} />);
    expect(screen.getByText(/\(303\) 555-0142/)).toBeInTheDocument();
  });

  it("renders the customer email", () => {
    render(<CustomerRow customer={MOCK_CUSTOMER} />);
    expect(screen.getByText(/accounts@riverside.example/)).toBeInTheDocument();
  });

  it("shows 'No contact info' when phone and email are missing", () => {
    const customer = { ...MOCK_CUSTOMER, phone: null, email: null };
    render(<CustomerRow customer={customer} />);
    expect(screen.getByText("No contact info")).toBeInTheDocument();
  });

  it("shows the edit form when Edit is clicked", async () => {
    render(<CustomerRow customer={MOCK_CUSTOMER} />);
    await userEvent.click(screen.getByText("Edit"));
    expect(screen.getByText("Edit Customer")).toBeInTheDocument();
  });

  it("hides the edit form when Cancel is clicked", async () => {
    render(<CustomerRow customer={MOCK_CUSTOMER} />);
    await userEvent.click(screen.getByText("Edit"));
    expect(screen.getByText("Edit Customer")).toBeInTheDocument();
    await userEvent.click(screen.getByText("Cancel"));
    expect(screen.queryByText("Edit Customer")).not.toBeInTheDocument();
  });

  it("pre-fills the name input with the customer name in edit mode", async () => {
    render(<CustomerRow customer={MOCK_CUSTOMER} />);
    await userEvent.click(screen.getByText("Edit"));
    const nameInput = screen.getByDisplayValue("Riverside Property Group") as HTMLInputElement;
    expect(nameInput).toBeInTheDocument();
    expect(nameInput.name).toBe("name");
  });

  it("renders Edit and Delete buttons in view mode", () => {
    render(<CustomerRow customer={MOCK_CUSTOMER} />);
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("renders Save and Cancel buttons in edit mode", async () => {
    render(<CustomerRow customer={MOCK_CUSTOMER} />);
    await userEvent.click(screen.getByText("Edit"));
    expect(screen.getByText("Save")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });
});

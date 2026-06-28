import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import InvoiceItemsForm from "@/app/(dashboard)/invoices/InvoiceItemForm";

describe("InvoiceItemsForm", () => {
  it("renders one item row by default", () => {
    render(<InvoiceItemsForm />);
    const descriptions = screen.getAllByPlaceholderText("Item Description");
    expect(descriptions).toHaveLength(1);
  });

  it("adds a new item row when Add Item is clicked", async () => {
    render(<InvoiceItemsForm />);
    await userEvent.click(screen.getByText("Add Item"));
    const descriptions = screen.getAllByPlaceholderText("Item Description");
    expect(descriptions).toHaveLength(2);
  });

  it("adds multiple item rows", async () => {
    render(<InvoiceItemsForm />);
    await userEvent.click(screen.getByText("Add Item"));
    await userEvent.click(screen.getByText("Add Item"));
    const descriptions = screen.getAllByPlaceholderText("Item Description");
    expect(descriptions).toHaveLength(3);
  });

  it("does not show a remove button when there is only one item", () => {
    render(<InvoiceItemsForm />);
    expect(screen.queryByTitle("Remove item")).not.toBeInTheDocument();
  });

  it("shows remove buttons when there are multiple items", async () => {
    render(<InvoiceItemsForm />);
    await userEvent.click(screen.getByText("Add Item"));
    const removeButtons = screen.getAllByTitle("Remove item");
    expect(removeButtons.length).toBeGreaterThan(0);
  });

  it("removes an item row when the remove button is clicked", async () => {
    render(<InvoiceItemsForm />);
    await userEvent.click(screen.getByText("Add Item"));
    expect(screen.getAllByPlaceholderText("Item Description")).toHaveLength(2);

    const removeButtons = screen.getAllByTitle("Remove item");
    await userEvent.click(removeButtons[0]);
    expect(screen.getAllByPlaceholderText("Item Description")).toHaveLength(1);
  });

  it("renders price inputs with correct names for form submission", async () => {
    render(<InvoiceItemsForm />);
    await userEvent.click(screen.getByText("Add Item"));
    const priceInputs = screen.getAllByPlaceholderText("0");
    expect(priceInputs[0]).toHaveAttribute("name", "items[0][price]");
    expect(priceInputs[1]).toHaveAttribute("name", "items[1][price]");
  });

  it("renders description inputs with correct names", () => {
    render(<InvoiceItemsForm />);
    const desc = screen.getByPlaceholderText("Item Description");
    expect(desc).toHaveAttribute("name", "items[0][description]");
  });

  it("displays the section header", () => {
    render(<InvoiceItemsForm />);
    expect(screen.getByText("Invoice Items")).toBeInTheDocument();
    expect(screen.getByText("Prices in cents")).toBeInTheDocument();
  });
});

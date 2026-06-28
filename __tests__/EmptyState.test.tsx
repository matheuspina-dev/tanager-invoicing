import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import EmptyState from "@/app/components/EmptyState";

describe("EmptyState", () => {
  it("renders the heading text", () => {
    render(<EmptyState heading="No invoices found." />);
    expect(screen.getByText("No invoices found.")).toBeInTheDocument();
  });

  it("renders the description when provided", () => {
    render(
      <EmptyState heading="Empty" description="Nothing to show here." />,
    );
    expect(screen.getByText("Nothing to show here.")).toBeInTheDocument();
  });

  it("does not render a description element when omitted", () => {
    const { container } = render(<EmptyState heading="Empty" />);
    const paragraphs = container.querySelectorAll("p");
    expect(paragraphs).toHaveLength(1);
  });

  it("renders the icon when provided", () => {
    render(
      <EmptyState
        heading="Empty"
        icon={<span data-testid="custom-icon">icon</span>}
      />,
    );
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });

  it("does not render an icon container when omitted", () => {
    const { container } = render(<EmptyState heading="Empty" />);
    expect(container.querySelector("[aria-hidden]")).toBeNull();
  });

  it("renders the action slot when provided", () => {
    render(
      <EmptyState
        heading="Empty"
        action={<button data-testid="cta">Create</button>}
      />,
    );
    expect(screen.getByTestId("cta")).toBeInTheDocument();
  });

  it("does not render an action container when omitted", () => {
    const { container } = render(<EmptyState heading="Empty" />);
    const divs = container.querySelectorAll("div > div");
    const actionDiv = Array.from(divs).find((d) =>
      d.classList.contains("mt-4"),
    );
    expect(actionDiv).toBeUndefined();
  });
});

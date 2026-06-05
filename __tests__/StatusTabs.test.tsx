import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import StatusTabs from "@/app/components/StatusTabs";

// next/navigation is mocked in vitest.setup.ts via the module mock in vitest.config.ts.
// The mock provides a no-op router.push and a stable useRouter.
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => "/invoices",
  useSearchParams: () => new URLSearchParams(),
}));

// jsdom needs window.location to be writable for the URL constructor calls in StatusTabs.
Object.defineProperty(window, "location", {
  value: { href: "http://localhost/invoices" },
  writable: true,
});

const STATUSES = ["UNPAID", "IN_PROGRESS", "PAID", "ALL"];

describe("StatusTabs", () => {
  it("renders a button for each status", () => {
    render(<StatusTabs currentStatus="ALL" statuses={STATUSES} />);
    expect(screen.getByText("UNPAID")).toBeInTheDocument();
    expect(screen.getByText("IN PROGRESS")).toBeInTheDocument();
    expect(screen.getByText("PAID")).toBeInTheDocument();
    expect(screen.getByText("ALL")).toBeInTheDocument();
  });

  it("renders the correct number of tabs", () => {
    render(<StatusTabs currentStatus="ALL" statuses={STATUSES} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(STATUSES.length);
  });

  it("applies active styles to the current status button", () => {
    render(<StatusTabs currentStatus="PAID" statuses={STATUSES} />);
    const activeBtn = screen.getByText("PAID");
    expect(activeBtn.className).toContain("text-blue-600");
  });

  it("does not apply active styles to inactive tabs", () => {
    render(<StatusTabs currentStatus="PAID" statuses={STATUSES} />);
    const inactiveBtn = screen.getByText("UNPAID");
    expect(inactiveBtn.className).not.toContain("text-blue-600");
  });

  it("calls router.push when a tab is clicked", async () => {
    const push = vi.fn();
    vi.mocked(
      (await import("next/navigation")).useRouter
    ).mockReturnValue({ push } as ReturnType<typeof import("next/navigation").useRouter>);

    render(<StatusTabs currentStatus="ALL" statuses={STATUSES} />);
    await userEvent.click(screen.getByText("UNPAID"));
    expect(push).toHaveBeenCalled();
  });
});

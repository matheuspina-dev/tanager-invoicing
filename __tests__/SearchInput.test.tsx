import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchInput from "@/app/components/SearchInput";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => "/invoices",
  useSearchParams: () => new URLSearchParams(),
}));

Object.defineProperty(window, "location", {
  value: { href: "http://localhost/invoices" },
  writable: true,
});

describe("SearchInput", () => {
  it("renders an input with the default placeholder", () => {
    render(<SearchInput currentQuery="" />);
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  });

  it("renders with a custom placeholder", () => {
    render(<SearchInput currentQuery="" placeholder="Search invoices..." />);
    expect(screen.getByPlaceholderText("Search invoices...")).toBeInTheDocument();
  });

  it("initialises the input value from currentQuery", () => {
    render(<SearchInput currentQuery="plumbing" />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input.value).toBe("plumbing");
  });

  it("updates the input value as the user types", async () => {
    render(<SearchInput currentQuery="" />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    await userEvent.type(input, "roof");
    expect(input.value).toBe("roof");
  });

  it("calls router.push when the input value changes", async () => {
    const push = vi.fn();
    vi.mocked(
      (await import("next/navigation")).useRouter
    ).mockReturnValue({ push } as ReturnType<typeof import("next/navigation").useRouter>);

    render(<SearchInput currentQuery="" />);
    const input = screen.getByRole("textbox");
    await userEvent.type(input, "r");
    expect(push).toHaveBeenCalled();
  });
});

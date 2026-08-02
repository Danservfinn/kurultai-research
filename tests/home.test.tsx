import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "@/app/page";

describe("research index", () => {
  it("states the editorial and authority boundary", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/knowledge that survives review/i);
    expect(screen.getByText(/dreamer proposes\. humans authorize publication\./i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /read the latest synthesis/i })).toHaveAttribute("href", "/research/self-improving-ai-needs-laws/");
  });
});

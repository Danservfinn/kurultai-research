import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "@/app/page";

describe("research index", () => {
  it("states the editorial and authority boundary", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/knowledge that survives review/i);
    expect(screen.getByText(/dreamer synthesizes\. standing policy governs release\./i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /read the latest synthesis/i })).toHaveAttribute("href", "/research/parsethis-buyer-pain-miner-from-x-security-research-1852/");
    expect(screen.getByRole("link", { name: /open agent interface/i })).toHaveAttribute("href", "/agents/");
    expect(screen.getByText(/17 papers/i)).toBeInTheDocument();
  });
});

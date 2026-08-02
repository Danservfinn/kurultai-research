import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ResearchPage } from "@/components/research-page";
import { getPostBySlug } from "@/lib/content";

afterEach(cleanup);

describe("published research page", () => {
  it("explains the frozen pre-publication status without duplicating the subtitle", () => {
    const post = getPostBySlug("self-improving-ai-needs-laws");
    expect(post).toBeDefined();
    render(<ResearchPage post={post!} />);
    expect(screen.getByText(/published by explicit operator authorization on august 2, 2026/i)).toBeInTheDocument();
    expect(screen.getAllByText("Why green tests do not prove a governed release")).toHaveLength(1);
  });

  it("renders public-redacted editions without duplicating the source heading", () => {
    const post = getPostBySlug("hulegu-v2-compiling-autonomy-through-evidence-bound-gates");
    expect(post).toBeDefined();
    render(<ResearchPage post={post!} />);
    expect(screen.getAllByRole("heading", { name: post!.title })).toHaveLength(1);
    expect(screen.getByText(/public redacted edition published under standing operator authorization/i)).toBeInTheDocument();
  });

  it("renders a citation-ready abstract and machine-readable format links", () => {
    const post = getPostBySlug("verification-solvency-agent-commit-rates");
    expect(post).toBeDefined();
    render(<ResearchPage post={post!} />);

    expect(screen.getByRole("heading", { name: "Research summary" })).toBeInTheDocument();
    expect(screen.getByText(post!.excerpt)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Markdown" })).toHaveAttribute("href", `/research/${post!.slug}/index.md`);
    expect(screen.getByRole("link", { name: "JSON" })).toHaveAttribute("href", `/api/v1/research/${post!.slug}.json`);
    expect(screen.getByRole("link", { name: "Citation" })).toHaveAttribute("href", `/research/${post!.slug}/citation.json`);
  });
});

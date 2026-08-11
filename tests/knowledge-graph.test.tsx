import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { KnowledgeGraphFigure } from "@/components/knowledge-graph-figure";
import { getAllPosts, getPostBySlug } from "@/lib/content";
import { renderKnowledgeGraphSvg } from "@/lib/knowledge-graph-svg";

const EXPECTED_SOURCE_COUNTS: Record<string, number> = {
  "parsethis-buyer-pain-miner-from-x-security-research-1852": 10,
  "parsethis-buyer-pain-miner-from-x-security-research-1050": 6,
  "parsethis-buyer-pain-miner-from-x-security-research-2208": 8,
  "parsethis-buyer-pain-miner-from-x-security-research-0611": 12,
  "parsethis-buyer-pain-miner-from-x-security-research-1816": 3,
  "parsethis-buyer-pain-miner-from-x-security-research-2218": 8,
  "parsethis-buyer-pain-miner-from-x-security-research-1414": 7,
  "parsethis-buyer-pain-miner-from-x-security-research-1012": 15,
  "parsethis-buyer-pain-miner-from-x-security-research-0209": 6,
  "parsethis-buyer-pain-miner-from-x-security-research": 8,
  "decision-reconstructible-agent-memory": 10,
  "verification-solvency-agent-commit-rates": 8,
  "hulegu-v2-compiling-autonomy-through-evidence-bound-gates": 26,
  "hermes-behind-the-service-boundary": 18,
  "typed-evidence-authority-separated-agent-architecture": 15,
  "self-improving-ai-needs-laws": 20,
};

describe("whitepaper knowledge graphs", () => {
  it("derives a public-safe source lineage graph for every published paper", () => {
    const posts = getAllPosts();

    expect(posts).toHaveLength(16);
    for (const post of posts) {
      expect(post.knowledgeGraph.sourceCount).toBe(EXPECTED_SOURCE_COUNTS[post.slug]);
      expect(post.knowledgeGraph.families.length).toBeGreaterThanOrEqual(1);
      expect(post.knowledgeGraph.edges.length).toBeGreaterThan(0);
      expect(post.knowledgeGraph.edges.every((edge) => post.knowledgeGraph.sources.some((source) => source.id === edge.sourceId) && post.knowledgeGraph.sources.some((source) => source.id === edge.targetId))).toBe(true);
      expect(post.knowledgeGraph.sources.every((source) => source.familyId.length > 0)).toBe(true);
      expect(post.knowledgeGraph.sources.some((source) => /testg1activationpacket/i.test(source.label))).toBe(false);
      expect(JSON.stringify(post.knowledgeGraph)).not.toMatch(/\/(?:Users|home)\//);
      expect(JSON.stringify(post.knowledgeGraph)).not.toMatch(/\[\[/);
    }
  });

  it("renders a standalone SVG image with source, family, and synthesis nodes", () => {
    const post = getPostBySlug("typed-evidence-authority-separated-agent-architecture");
    expect(post).toBeDefined();

    const svg = renderKnowledgeGraphSvg(post!);

    expect(svg).toMatch(/^<svg/);
    expect(svg).toContain("15 SOURCE RECORDS");
    expect(svg).toContain("NEURAL KNOWLEDGE LINEAGE");
    expect(svg).toContain("source-neuron");
    expect(svg).toContain("inter-source");
    expect(svg).toContain("Harnesses as compositional generalizers");
    expect(svg).toContain("SYNTHESIZED WHITEPAPER");
    expect(svg).toContain("aria-labelledby=");
    expect(svg).not.toMatch(/\/(?:Users|home)\//);
  });

  it("keeps long synthesized-paper titles fully visible instead of ellipsizing them", () => {
    const post = getPostBySlug("decision-reconstructible-agent-memory");
    expect(post).toBeDefined();
    const svg = renderKnowledgeGraphSvg(post!);
    expect(svg).toContain(post!.title);
    expect(svg).not.toContain("Context Becomes…");
  });

  it("shows the graph image and explains what its edges mean", () => {
    const post = getPostBySlug("self-improving-ai-needs-laws");
    expect(post).toBeDefined();

    render(<KnowledgeGraphFigure post={post!} />);

    const image = screen.getByRole("img", { name: /knowledge lineage for self-improving ai needs laws it cannot rewrite/i });
    expect(image).toHaveAttribute("src", "/knowledge-graphs/self-improving-ai-needs-laws.svg?v=2");
    expect(screen.getByText(/sources are rendered as neuron nodes/i)).toBeInTheDocument();
    expect(screen.getByText("20 source records")).toBeInTheDocument();
  });
});

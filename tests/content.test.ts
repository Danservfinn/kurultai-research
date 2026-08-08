import { describe, expect, it } from "vitest";
import { getAllPosts, getPostBySlug, validatePublicPost } from "@/lib/content";

describe("public content boundary", () => {
  it("exports the complete canonical whitepaper corpus in reverse chronology", () => {
    const posts = getAllPosts();
    expect(posts.map((post) => post.slug)).toEqual([
      "parsethis-buyer-pain-miner-from-x-security-research",
      "decision-reconstructible-agent-memory",
      "verification-solvency-agent-commit-rates",
      "hulegu-v2-compiling-autonomy-through-evidence-bound-gates",
      "hermes-behind-the-service-boundary",
      "typed-evidence-authority-separated-agent-architecture",
      "self-improving-ai-needs-laws",
    ]);
    expect(posts.every((post) => post.public && post.status === "published")).toBe(true);
    expect(posts.every((post) => !/hulagu/i.test(post.content))).toBe(true);
    expect(posts.map((post) => post.date)).toEqual([...posts.map((post) => post.date)].sort().reverse());
  });

  it("binds each public-redacted edition to both public and canonical source digests", () => {
    const redacted = getAllPosts().filter((post) => post.publicEdition?.startsWith("public-redacted-"));
    expect(redacted).toHaveLength(4);
    expect(redacted.some((post) => post.title.startsWith("Hulegu v2") && post.aliases?.includes("hulagu-v2-compiling-autonomy-through-evidence-bound-gates"))).toBe(true);
    expect(redacted.every((post) => /^[a-f0-9]{64}$/.test(post.sourceSha256 ?? ""))).toBe(true);
    expect(redacted.every((post) => /^[a-f0-9]{64}$/.test(post.sourceArtifactSha256 ?? ""))).toBe(true);
    expect(redacted.every((post) => post.publicationNote?.includes("Public redacted edition"))).toBe(true);
  });

  it("loads a post by stable slug with provenance", () => {
    const post = getPostBySlug("self-improving-ai-needs-laws");
    expect(post?.title).toBe("Self-Improving AI Needs Laws It Cannot Rewrite");
    expect(post?.provenance.review).toMatch(/independent/i);
    expect(post?.content.length).toBeGreaterThan(5000);
  });

  it("rejects private paths, secrets, wikilinks, and unsafe publication flags", () => {
    const result = validatePublicPost({
      slug: "unsafe",
      title: "Unsafe",
      excerpt: "test",
      date: "2026-08-02",
      topic: "Systems",
      readingMinutes: 1,
      public: true,
      status: "published",
      featured: false,
      content: `Read /${["Users", "example", "private"].join("/")} and [[private note]] from session ${["20260725", "023435", "c2f08d00"].join("_")}`,
      provenance: { synthesis: "test", review: "none", provider: "unknown" },
    });
    expect(result.ok).toBe(false);
    expect(result.errors).toEqual(expect.arrayContaining([expect.stringMatching(/private path/i), expect.stringMatching(/wikilink/i), expect.stringMatching(/session reference/i)]));
  });
});

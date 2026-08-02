import { describe, expect, it } from "vitest";
import { getAllPosts, getPostBySlug, validatePublicPost } from "@/lib/content";

describe("public content boundary", () => {
  it("exports only explicitly published public snapshots", () => {
    const posts = getAllPosts();
    expect(posts.length).toBeGreaterThan(0);
    expect(posts.every((post) => post.public && post.status === "published")).toBe(true);
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
      content: `Read /${["Users", "example", "private"].join("/")} and [[private note]]`,
      provenance: { synthesis: "test", review: "none", provider: "unknown" },
    });
    expect(result.ok).toBe(false);
    expect(result.errors).toEqual(expect.arrayContaining([expect.stringMatching(/private path/i), expect.stringMatching(/wikilink/i)]));
  });
});

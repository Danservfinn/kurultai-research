import { describe, expect, it } from "vitest";
import { buildArticleStructuredData, buildSiteStructuredData, buildSitemap, buildRobots } from "@/lib/seo";
import { getAllPosts } from "@/lib/content";

const SITE = "https://blog.kurult.ai";

describe("SEO and generative-engine discovery artifacts", () => {
  const posts = getAllPosts();

  it("builds verifiable ScholarlyArticle and breadcrumb entities", () => {
    const graph = buildArticleStructuredData(posts[0], SITE) as { "@graph": Array<Record<string, unknown>> };
    const article = graph["@graph"].find((node) => node["@type"] === "ScholarlyArticle");
    const breadcrumbs = graph["@graph"].find((node) => node["@type"] === "BreadcrumbList");

    expect(article).toMatchObject({
      headline: posts[0].title,
      abstract: posts[0].excerpt,
      datePublished: posts[0].date,
      dateModified: posts[0].date,
      articleSection: posts[0].topic,
      isAccessibleForFree: true,
      inLanguage: "en-US",
      mainEntityOfPage: `${SITE}/research/${posts[0].slug}/`,
    });
    expect(Number(article?.wordCount)).toBeGreaterThan(500);
    expect(Array.isArray(article?.citation)).toBe(true);
    expect(breadcrumbs).toBeDefined();
    expect((breadcrumbs?.itemListElement as unknown[])).toHaveLength(2);

    const memoryPost = posts.find((post) => post.slug === "decision-reconstructible-agent-memory");
    expect(memoryPost).toBeDefined();
    const memoryGraph = buildArticleStructuredData(memoryPost!, SITE) as { "@graph": Array<Record<string, unknown>> };
    const memoryArticle = memoryGraph["@graph"].find((node) => node["@type"] === "ScholarlyArticle");
    expect(memoryArticle?.citation).toHaveLength(10);
    expect(memoryArticle?.citation).toContain("Lobu event-sourced agents — source-to-mechanism analysis");
  });

  it("describes the site as a research collection with every paper in an ItemList", () => {
    const graph = buildSiteStructuredData(posts, SITE) as { "@graph": Array<Record<string, unknown>> };
    const collection = graph["@graph"].find((node) => node["@type"] === "CollectionPage");
    expect(collection).toMatchObject({ name: "Kurultai Research", inLanguage: "en-US" });
    expect((collection?.mainEntity as { numberOfItems: number }).numberOfItems).toBe(posts.length);
  });

  it("includes human, agent, and research discovery routes in crawl artifacts", () => {
    const sitemap = buildSitemap(posts, SITE);
    expect(sitemap).toContain(`<loc>${SITE}/</loc>`);
    expect(sitemap).toContain(`<loc>${SITE}/agents/</loc>`);
    for (const post of posts) expect(sitemap).toContain(`<loc>${SITE}/research/${post.slug}/</loc>`);

    const robots = buildRobots(SITE);
    expect(robots).toContain("User-agent: *\nAllow: /");
    expect(robots).toContain(`Sitemap: ${SITE}/sitemap.xml`);
    expect(robots).toContain(`# Agent-readable corpus: ${SITE}/llms.txt`);
  });
});

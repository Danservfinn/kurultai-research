import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Document } from "@/components/document";

describe("document security policy", () => {
  it("embeds a restrictive CSP even if the edge rewrites response headers", () => {
    const markup = renderToStaticMarkup(<Document title="Test" description="Test" canonical="https://blog.kurult.ai"><main>Test</main></Document>);
    expect(markup).toContain('http-equiv="Content-Security-Policy"');
    expect(markup).toContain("script-src &#x27;none&#x27;");
    expect(markup).toContain("default-src &#x27;self&#x27;");
  });

  it("emits complete article discovery metadata and machine-readable structured data", () => {
    const canonical = "https://blog.kurult.ai/research/example/";
    const markup = renderToStaticMarkup(
      <Document
        title="Evidence-Bound Agents — Kurultai Research"
        description="A reviewed architecture for evidence-bound agents."
        canonical={canonical}
        pageType="article"
        datePublished="2026-08-02"
        articleSection="Agent governance"
        keywords={["Agent governance", "evidence-bound agents"]}
        alternates={{
          markdown: `${canonical}index.md`,
          json: "https://blog.kurult.ai/api/v1/research/example.json",
          citation: `${canonical}citation.json`,
        }}
        structuredData={{ "@context": "https://schema.org", "@type": "ScholarlyArticle", headline: "Evidence-Bound Agents" }}
      >
        <main>Test</main>
      </Document>,
    );

    expect(markup).toContain('property="og:type" content="article"');
    expect(markup).toContain('property="og:site_name" content="Kurultai Research"');
    expect(markup).toContain('property="article:published_time" content="2026-08-02"');
    expect(markup).toContain('name="twitter:title" content="Evidence-Bound Agents — Kurultai Research"');
    expect(markup).toContain('rel="alternate" type="text/markdown"');
    expect(markup).toContain('type="application/vnd.citationstyles.csl+json"');
    expect(markup).toContain('type="application/ld+json"');
    expect(markup).toContain('"@type":"ScholarlyArticle"');
    expect(markup).toContain('name="keywords" content="Agent governance, evidence-bound agents"');
  });

  it("supports noindex metadata for error pages", () => {
    const markup = renderToStaticMarkup(
      <Document title="Not found" description="Missing" canonical="https://blog.kurult.ai/" robots="noindex,nofollow"><main>Missing</main></Document>,
    );
    expect(markup).toContain('name="robots" content="noindex,nofollow"');
  });
});

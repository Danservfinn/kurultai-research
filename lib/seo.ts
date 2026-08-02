import type { PublicPost } from "@/lib/content";

const SITE_NAME = "Kurultai Research";
const DEFAULT_IMAGE = "/yassa-immutable-laws.png";

function absoluteUrl(site: string, value: string): string {
  return value.startsWith("http://") || value.startsWith("https://")
    ? value
    : `${site.replace(/\/$/, "")}${value.startsWith("/") ? "" : "/"}${value}`;
}

function xml(value: string): string {
  return value.replace(/[<>&'\"]/g, (character) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "'": "&apos;",
    '"': "&quot;",
  })[character] ?? character);
}

export function extractCitationUrls(markdown: string): string[] {
  const urls = markdown.match(/https?:\/\/[^\s<>"')\]]+/g) ?? [];
  return [...new Set(urls.map((url) => url.replace(/[.,;:!?]+$/, "")))];
}

export function extractCitations(markdown: string): string[] {
  const sourceRows = [...markdown.matchAll(/^\|\s*S\d+\s*\|\s*(.*?)\s*\|/gm)]
    .map((match) => match[1]
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/[`*_]/g, "")
      .trim())
    .filter(Boolean);
  return sourceRows.length > 0 ? [...new Set(sourceRows)] : extractCitationUrls(markdown);
}

export function countArticleWords(markdown: string): number {
  return markdown
    .replace(/^---[\s\S]*?---\s*/, "")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[`#>*_\[\]()|~-]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

export function buildArticleStructuredData(post: PublicPost, site: string): Record<string, unknown> {
  const canonical = `${site.replace(/\/$/, "")}/research/${post.slug}/`;
  const image = absoluteUrl(site, post.heroImage ?? DEFAULT_IMAGE);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${site}/#organization`,
        name: SITE_NAME,
        url: `${site}/`,
      },
      {
        "@type": "ScholarlyArticle",
        "@id": `${canonical}#article`,
        headline: post.title,
        ...(post.subtitle ? { alternativeHeadline: post.subtitle } : {}),
        abstract: post.excerpt,
        description: post.excerpt,
        datePublished: post.date,
        dateModified: post.date,
        articleSection: post.topic,
        keywords: [post.topic, post.title],
        wordCount: countArticleWords(post.content),
        inLanguage: "en-US",
        isAccessibleForFree: true,
        mainEntityOfPage: canonical,
        url: canonical,
        image,
        author: { "@id": `${site}/#organization` },
        publisher: { "@id": `${site}/#organization` },
        citation: extractCitations(post.content),
        encoding: [
          { "@type": "MediaObject", encodingFormat: "text/markdown", contentUrl: `${canonical}index.md` },
          { "@type": "MediaObject", encodingFormat: "application/json", contentUrl: `${site}/api/v1/research/${post.slug}.json` },
          { "@type": "MediaObject", encodingFormat: "application/vnd.citationstyles.csl+json", contentUrl: `${canonical}citation.json` },
        ],
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonical}#breadcrumbs`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: SITE_NAME, item: `${site}/` },
          { "@type": "ListItem", position: 2, name: post.title, item: canonical },
        ],
      },
    ],
  };
}

export function buildSiteStructuredData(posts: PublicPost[], site: string): Record<string, unknown> {
  const itemList = {
    "@type": "ItemList",
    numberOfItems: posts.length,
    itemListElement: posts.map((post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${site}/research/${post.slug}/`,
      name: post.title,
    })),
  };
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": `${site}/#organization`, name: SITE_NAME, url: `${site}/` },
      {
        "@type": "WebSite",
        "@id": `${site}/#website`,
        name: SITE_NAME,
        url: `${site}/`,
        description: "Source-backed research on agent systems, governed autonomy, and reliable intelligence.",
        inLanguage: "en-US",
        publisher: { "@id": `${site}/#organization` },
      },
      {
        "@type": "CollectionPage",
        "@id": `${site}/#collection`,
        name: SITE_NAME,
        url: `${site}/`,
        inLanguage: "en-US",
        isPartOf: { "@id": `${site}/#website` },
        mainEntity: itemList,
      },
    ],
  };
}

export function buildRobots(site: string): string {
  return [
    "User-agent: *",
    "Allow: /",
    `Sitemap: ${site}/sitemap.xml`,
    `# Agent-readable corpus: ${site}/llms.txt`,
    "",
  ].join("\n");
}

export function buildSitemap(posts: PublicPost[], site: string): string {
  const latest = posts[0]?.date;
  const urls = [
    { loc: `${site}/`, lastmod: latest },
    { loc: `${site}/agents/`, lastmod: latest },
    ...posts.map((post) => ({ loc: `${site}/research/${post.slug}/`, lastmod: post.date })),
  ];
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map(({ loc, lastmod }) => `  <url><loc>${xml(loc)}</loc>${lastmod ? `<lastmod>${xml(lastmod)}</lastmod>` : ""}</url>`),
    "</urlset>",
    "",
  ].join("\n");
}

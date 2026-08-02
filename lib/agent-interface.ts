import crypto from "node:crypto";
import type { PublicPost } from "./content";

type ArtifactMap = Record<string, string>;

type AgentItem = {
  id: string;
  title: string;
  subtitle?: string;
  summary: string;
  published_at: string;
  topic: string;
  reading_minutes: number;
  featured: boolean;
  content_sha256: string;
  canonical_source_sha256?: string;
  public_edition?: string;
  provenance: PublicPost["provenance"];
  urls: { html: string; markdown: string; json: string };
};

function sha256(content: string): string {
  return crypto.createHash("sha256").update(content).digest("hex");
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

function itemFor(post: PublicPost, site: string): AgentItem {
  return {
    id: post.slug,
    title: post.title,
    ...(post.subtitle ? { subtitle: post.subtitle } : {}),
    summary: post.excerpt,
    published_at: post.date,
    topic: post.topic,
    reading_minutes: post.readingMinutes,
    featured: post.featured,
    content_sha256: sha256(post.content),
    ...(post.sourceArtifactSha256 ? { canonical_source_sha256: post.sourceArtifactSha256 } : {}),
    ...(post.publicEdition ? { public_edition: post.publicEdition } : {}),
    provenance: post.provenance,
    urls: {
      html: `${site}/research/${post.slug}/`,
      markdown: `${site}/research/${post.slug}/index.md`,
      json: `${site}/api/v1/research/${post.slug}.json`,
    },
  };
}

export function buildAgentArtifacts(posts: PublicPost[], site: string): ArtifactMap {
  const canonicalSite = site.replace(/\/$/, "");
  const items = posts.map((post) => itemFor(post, canonicalSite));
  const updatedAt = posts[0]?.date ?? "1970-01-01";
  const artifacts: ArtifactMap = {};
  const agentItemSchema = {
    type: "object",
    additionalProperties: false,
    required: ["id", "title", "summary", "published_at", "topic", "reading_minutes", "featured", "content_sha256", "provenance", "urls"],
    properties: {
      id: { type: "string", pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$" },
      title: { type: "string" },
      subtitle: { type: "string" },
      summary: { type: "string" },
      published_at: { type: "string", format: "date" },
      topic: { type: "string" },
      reading_minutes: { type: "integer", minimum: 1 },
      featured: { type: "boolean" },
      content_sha256: { type: "string", pattern: "^[a-f0-9]{64}$" },
      canonical_source_sha256: { type: "string", pattern: "^[a-f0-9]{64}$" },
      public_edition: { type: "string" },
      provenance: {
        type: "object",
        additionalProperties: false,
        required: ["synthesis", "review", "provider"],
        properties: {
          synthesis: { type: "string" },
          review: { type: "string" },
          provider: { type: "string" },
        },
      },
      urls: {
        type: "object",
        additionalProperties: false,
        required: ["html", "markdown", "json"],
        properties: {
          html: { type: "string", format: "uri" },
          markdown: { type: "string", format: "uri" },
          json: { type: "string", format: "uri" },
        },
      },
    },
  };

  artifacts["api/v1/index.json"] = JSON.stringify({
    schema_version: "kurultai.research.index.v1",
    schema_url: `${canonicalSite}/api/v1/index.schema.json`,
    title: "Kurultai Research",
    description: "Reviewed, public-safe research on governed autonomy and agent systems.",
    canonical_url: `${canonicalSite}/`,
    updated_at: updatedAt,
    total_items: items.length,
    recommended_ingestion: {
      discovery: `${canonicalSite}/api/v1/index.json`,
      full_corpus: `${canonicalSite}/llms-full.txt`,
      change_detection: "Compare item.content_sha256; fetch only changed Markdown or JSON records.",
    },
    items,
  }, null, 2) + "\n";

  artifacts["api/v1/schema.json"] = JSON.stringify({
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: `${canonicalSite}/api/v1/schema.json`,
    title: "Kurultai Research item response",
    type: "object",
    additionalProperties: false,
    required: ["schema_version", "item", "content"],
    properties: {
      schema_version: { const: "kurultai.research.item.v1" },
      item: agentItemSchema,
      content: {
        type: "object",
        additionalProperties: false,
        required: ["media_type", "body"],
        properties: {
          media_type: { const: "text/markdown" },
          body: { type: "string" },
        },
      },
    },
  }, null, 2) + "\n";

  artifacts["api/v1/index.schema.json"] = JSON.stringify({
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: `${canonicalSite}/api/v1/index.schema.json`,
    title: "Kurultai Research discovery index",
    type: "object",
    additionalProperties: false,
    required: ["schema_version", "schema_url", "title", "description", "canonical_url", "updated_at", "total_items", "recommended_ingestion", "items"],
    properties: {
      schema_version: { const: "kurultai.research.index.v1" },
      schema_url: { type: "string", format: "uri" },
      title: { type: "string" },
      description: { type: "string" },
      canonical_url: { type: "string", format: "uri" },
      updated_at: { type: "string", format: "date" },
      total_items: { type: "integer", minimum: 0 },
      recommended_ingestion: {
        type: "object",
        additionalProperties: false,
        required: ["discovery", "full_corpus", "change_detection"],
        properties: {
          discovery: { type: "string", format: "uri" },
          full_corpus: { type: "string", format: "uri" },
          change_detection: { type: "string" },
        },
      },
      items: { type: "array", items: agentItemSchema },
    },
  }, null, 2) + "\n";

  for (const [index, post] of posts.entries()) {
    const item = items[index];
    artifacts[`research/${post.slug}/index.md`] = post.content;
    artifacts[`api/v1/research/${post.slug}.json`] = JSON.stringify({
      schema_version: "kurultai.research.item.v1",
      item,
      content: { media_type: "text/markdown", body: post.content },
    }, null, 2) + "\n";
  }

  artifacts["llms.txt"] = [
    "# Kurultai Research",
    "",
    "> Reviewed, public-safe research on governed autonomy, agent systems, and reliable intelligence.",
    "",
    "## Agent ingestion",
    "",
    `- [Bounded JSON index](${canonicalSite}/api/v1/index.json): Start here for metadata, stable URLs, provenance, and SHA-256 change detection.`,
    `- [Complete corpus](${canonicalSite}/llms-full.txt): Every published paper as Markdown in one request.`,
    `- [Index JSON Schema](${canonicalSite}/api/v1/index.schema.json): Contract for the bounded discovery index.`,
    `- [Item JSON Schema](${canonicalSite}/api/v1/schema.json): Contract for self-contained item responses.`,
    `- [JSON Feed](${canonicalSite}/feed.json): Standard JSON Feed 1.1 for incremental discovery.`,
    `- [Atom feed](${canonicalSite}/feed.xml): Standard Atom feed for polling clients.`,
    `- [Human and CLI guide](${canonicalSite}/agents/): Copy-ready curl and jq examples.`,
    "",
    "Prefer the bounded JSON index, compare `content_sha256`, then fetch only changed `urls.markdown` resources. Raw Markdown is canonical for ingestion; HTML is for human reading.",
    "",
    "## Publication boundary",
    "",
    "Standing operator policy authorizes canonical synthesized whitepapers only after source, review, privacy, exact-hash, build, and public-readback gates pass. This site contains frozen snapshots and has no access to the private Brain or runtime.",
    "",
    "## Research",
    "",
    ...items.map((item) => `- [${item.title}](${item.urls.markdown}): ${item.summary}`),
    "",
  ].join("\n");

  artifacts["llms-full.txt"] = [
    "# Kurultai Research — complete agent corpus",
    "",
    `Corpus index: ${canonicalSite}/api/v1/index.json`,
    `Updated: ${updatedAt}`,
    `Items: ${posts.length}`,
    "",
    ...posts.flatMap((post, index) => [
      "---",
      `id: ${post.slug}`,
      `title: ${post.title}`,
      `published_at: ${post.date}`,
      `topic: ${post.topic}`,
      `content_sha256: ${items[index].content_sha256}`,
      `canonical_url: ${items[index].urls.html}`,
      "---",
      "",
      post.content,
      "",
    ]),
  ].join("\n");

  artifacts["feed.json"] = JSON.stringify({
    version: "https://jsonfeed.org/version/1.1",
    title: "Kurultai Research",
    home_page_url: `${canonicalSite}/`,
    feed_url: `${canonicalSite}/feed.json`,
    description: "Reviewed, public-safe research on governed autonomy and agent systems.",
    items: posts.map((post, index) => ({
      id: items[index].urls.html,
      url: items[index].urls.html,
      title: post.title,
      summary: post.excerpt,
      content_text: post.content,
      date_published: `${post.date}T00:00:00Z`,
      tags: [post.topic],
      _kurultai: { content_sha256: items[index].content_sha256, markdown_url: items[index].urls.markdown },
    })),
  }, null, 2) + "\n";

  artifacts["feed.xml"] = [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<feed xmlns="http://www.w3.org/2005/Atom">',
    "  <title>Kurultai Research</title>",
    `  <id>${canonicalSite}/</id>`,
    `  <link href="${canonicalSite}/feed.xml" rel="self"/>`,
    `  <link href="${canonicalSite}/"/>`,
    "  <author><name>Kurultai Research</name></author>",
    `  <updated>${updatedAt}T00:00:00Z</updated>`,
    ...posts.flatMap((post, index) => [
      "  <entry>",
      `    <title>${xml(post.title)}</title>`,
      `    <id>${items[index].urls.html}</id>`,
      `    <link href="${items[index].urls.html}"/>`,
      `    <link href="${items[index].urls.markdown}" rel="alternate" type="text/markdown"/>`,
      `    <updated>${post.date}T00:00:00Z</updated>`,
      `    <summary>${xml(post.excerpt)}</summary>`,
      "  </entry>",
    ]),
    "</feed>",
    "",
  ].join("\n");

  return artifacts;
}

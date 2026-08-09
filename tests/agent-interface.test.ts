import crypto from "node:crypto";
import Ajv2020 from "ajv/dist/2020";
import addFormats from "ajv-formats";
import { describe, expect, it } from "vitest";
import { buildAgentArtifacts } from "@/lib/agent-interface";
import { getStableBuildTimestamp } from "@/lib/build-metadata";
import { getAllPosts } from "@/lib/content";

const SITE = "https://blog.kurult.ai";

describe("agent-first research interface", () => {
  const posts = getAllPosts();
  const artifacts = buildAgentArtifacts(posts, SITE);

  it("publishes a bounded JSON discovery index with stable content URLs and hashes", () => {
    const index = JSON.parse(artifacts["api/v1/index.json"]);

    expect(index.schema_version).toBe("kurultai.research.index.v1");
    expect(index.total_items).toBe(posts.length);
    expect(index.items).toHaveLength(posts.length);
    expect(index.items[0]).toMatchObject({
      id: posts[0].slug,
      title: posts[0].title,
      published_at: posts[0].date,
      content_sha256: posts[0].sourceSha256,
      urls: {
        html: `${SITE}/research/${posts[0].slug}/`,
        markdown: `${SITE}/research/${posts[0].slug}/index.md`,
        json: `${SITE}/api/v1/research/${posts[0].slug}.json`,
      },
    });
    expect(index.items[0]).not.toHaveProperty("content");
  });

  it("publishes exact Markdown plus self-contained JSON for every paper", () => {
    for (const post of posts) {
      const markdownPath = `research/${post.slug}/index.md`;
      const jsonPath = `api/v1/research/${post.slug}.json`;
      const record = JSON.parse(artifacts[jsonPath]);

      expect(artifacts[markdownPath]).toBe(post.content);
      expect(record.schema_version).toBe("kurultai.research.item.v1");
      expect(record.item.id).toBe(post.slug);
      expect(record.content).toEqual({ media_type: "text/markdown", body: post.content });
      expect(record.item.content_sha256).toBe(
        crypto.createHash("sha256").update(post.content).digest("hex"),
      );
    }
  });

  it("publishes CSL-JSON citation records for every paper", () => {
    for (const post of posts) {
      const citation = JSON.parse(artifacts[`research/${post.slug}/citation.json`]);
      expect(citation).toMatchObject({
        id: post.slug,
        type: "report",
        title: post.title,
        issued: { "date-parts": [[Number(post.date.slice(0, 4)), Number(post.date.slice(5, 7)), Number(post.date.slice(8, 10))]] },
        URL: `${SITE}/research/${post.slug}/`,
        publisher: "Kurultai Research",
        genre: "Whitepaper",
      });
      expect(citation.author).toEqual([{ literal: "Kurultai Research" }]);
    }
  });

  it("offers common discovery formats and a complete single-request corpus", () => {
    expect(artifacts["llms.txt"]).toContain("## Agent ingestion");
    expect(artifacts["llms.txt"]).toContain(`${SITE}/api/v1/index.json`);
    expect(artifacts["llms.txt"]).toContain(`${SITE}/llms-full.txt`);
    expect(artifacts["llms-full.txt"]).toContain(posts[0].content);

    const feed = JSON.parse(artifacts["feed.json"]);
    expect(feed.version).toBe("https://jsonfeed.org/version/1.1");
    expect(feed.items).toHaveLength(posts.length);
    expect(feed.items[0].content_text).toBe(posts[0].content);
    expect(artifacts["feed.xml"]).toContain("<feed xmlns=\"http://www.w3.org/2005/Atom\">");
    expect(artifacts["feed.xml"]).toContain("<author><name>Kurultai Research</name></author>");
    for (const post of posts) expect(artifacts["llms-full.txt"]).toContain(post.content);
  });

  it("publishes schemas that validate the discovery index and every item response", () => {
    const itemSchema = JSON.parse(artifacts["api/v1/schema.json"]);
    const indexSchema = JSON.parse(artifacts["api/v1/index.schema.json"]);
    const index = JSON.parse(artifacts["api/v1/index.json"]);
    const ajv = new Ajv2020({ strict: true });
    addFormats(ajv);

    expect(index.schema_url).toBe(`${SITE}/api/v1/index.schema.json`);
    expect(ajv.compile(indexSchema)(index)).toBe(true);
    const validateItem = ajv.compile(itemSchema);
    for (const post of posts) {
      expect(validateItem(JSON.parse(artifacts[`api/v1/research/${post.slug}.json`]))).toBe(true);
    }
  });

  it("derives reproducible build timestamps from explicit or source metadata", () => {
    expect(getStableBuildTimestamp(posts, {})).toBe("2026-08-09T00:00:00.000Z");
    expect(getStableBuildTimestamp(posts, { SOURCE_DATE_EPOCH: "1785686400" })).toBe("2026-08-02T16:00:00.000Z");
  });
});
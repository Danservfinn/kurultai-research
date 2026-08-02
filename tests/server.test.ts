import { describe, expect, it } from "vitest";
import { getCacheControl, getContentType, getRedirectTarget, resolveRequestPath } from "@/lib/server-utils";

describe("static server path resolution", () => {
  it("maps clean routes to generated index files", () => {
    expect(resolveRequestPath("/", "/srv/dist")).toBe("/srv/dist/index.html");
    expect(resolveRequestPath("/research/example", "/srv/dist")).toBe("/srv/dist/research/example/index.html");
  });

  it("resolves a legacy publication slug to its renamed canonical route", () => {
    const redirects = { "/research/hulagu-v2-compiling-autonomy-through-evidence-bound-gates/": "/research/hulegu-v2-compiling-autonomy-through-evidence-bound-gates/" };
    expect(getRedirectTarget("/research/hulagu-v2-compiling-autonomy-through-evidence-bound-gates", redirects)).toBe(redirects["/research/hulagu-v2-compiling-autonomy-through-evidence-bound-gates/"]);
    expect(getRedirectTarget("/%E0%A4%A", redirects)).toBeNull();
  });

  it("serves agent representations with specific media types", () => {
    expect(getContentType("/srv/dist/research/example/index.md")).toBe("text/markdown; charset=utf-8");
    expect(getContentType("/srv/dist/feed.json")).toBe("application/feed+json; charset=utf-8");
    expect(getContentType("/srv/dist/feed.xml")).toBe("application/atom+xml; charset=utf-8");
    expect(getContentType("/srv/dist/sitemap.xml")).toBe("application/xml; charset=utf-8");
  });

  it("revalidates mutable agent resources instead of caching them as immutable", () => {
    expect(getCacheControl("/srv/dist/api/v1/index.json")).toBe("public, max-age=60, must-revalidate");
    expect(getCacheControl("/srv/dist/research/example/index.md")).toBe("public, max-age=60, must-revalidate");
    expect(getCacheControl("/srv/dist/feed.xml")).toBe("public, max-age=60, must-revalidate");
    expect(getCacheControl("/srv/dist/knowledge-graphs/example.svg")).toBe("public, max-age=60, must-revalidate");
    expect(getCacheControl("/srv/dist/fonts/outfit.woff2")).toBe("public, max-age=86400, immutable");
  });

  it("rejects traversal and malformed paths", () => {
    expect(resolveRequestPath("/../../private", "/srv/dist")).toBeNull();
    expect(resolveRequestPath("/%2e%2e/%2e%2e/private", "/srv/dist")).toBeNull();
    expect(resolveRequestPath("/%E0%A4%A", "/srv/dist")).toBeNull();
  });
});

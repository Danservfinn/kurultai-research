import { describe, expect, it } from "vitest";
import { getRedirectTarget, resolveRequestPath } from "@/lib/server-utils";

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

  it("rejects traversal and malformed paths", () => {
    expect(resolveRequestPath("/../../private", "/srv/dist")).toBeNull();
    expect(resolveRequestPath("/%2e%2e/%2e%2e/private", "/srv/dist")).toBeNull();
    expect(resolveRequestPath("/%E0%A4%A", "/srv/dist")).toBeNull();
  });
});

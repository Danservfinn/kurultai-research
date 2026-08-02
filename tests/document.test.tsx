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
});

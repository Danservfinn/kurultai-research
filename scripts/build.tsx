import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { createRequire } from "node:module";
import { renderToStaticMarkup } from "react-dom/server";
import Home from "@/app/page";
import { Document } from "@/components/document";
import { ResearchPage } from "@/components/research-page";
import { AgentPage } from "@/components/agent-page";
import { buildAgentArtifacts } from "@/lib/agent-interface";
import { getStableBuildTimestamp } from "@/lib/build-metadata";
import { getAllPosts } from "@/lib/content";
import { renderKnowledgeGraphSvg } from "@/lib/knowledge-graph-svg";
import { buildArticleStructuredData, buildRobots, buildSiteStructuredData, buildSitemap } from "@/lib/seo";

const ROOT = process.cwd();
const require = createRequire(import.meta.url);
const DIST = path.join(ROOT, "dist");
const PUBLIC = path.join(ROOT, "public");
const SITE = "https://blog.kurult.ai";

function write(relative: string, content: string | Buffer) {
  const target = path.join(DIST, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
}

function html(node: React.ReactNode) {
  return "<!doctype html>" + renderToStaticMarkup(node);
}

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });
fs.cpSync(PUBLIC, DIST, { recursive: true });
fs.copyFileSync(path.join(ROOT, "app", "globals.css"), path.join(DIST, "styles.css"));

for (const [pkg, source, target] of [
  ["@fontsource-variable/outfit", "outfit-latin-wght-normal.woff2", "fonts/outfit.woff2"],
  ["@fontsource-variable/jetbrains-mono", "jetbrains-mono-latin-wght-normal.woff2", "fonts/jetbrains-mono.woff2"],
] as const) {
  const packageRoot = path.dirname(require.resolve(`${pkg}/package.json`));
  write(target, fs.readFileSync(path.join(packageRoot, "files", source)));
}

const posts = getAllPosts();
write("index.html", html(<Document
  title="Kurultai Research — Governed AI Agent Systems"
  description="Source-backed research on AI agent governance, evidence-bound autonomy, verification, and reliable intelligence."
  canonical={`${SITE}/`}
  keywords={["AI agent governance", "governed autonomy", "agent systems", "AI verification"]}
  structuredData={buildSiteStructuredData(posts, SITE)}
><Home /></Document>));
write("agents/index.html", html(<Document title="Agent Interface — Kurultai Research" description="Stable JSON, exact Markdown, content hashes, and feeds for ingesting Kurultai Research." canonical={`${SITE}/agents/`}><AgentPage /></Document>));
for (const post of posts) {
  write(`knowledge-graphs/${post.slug}.svg`, renderKnowledgeGraphSvg(post));
  const canonical = `${SITE}/research/${post.slug}/`;
  write(`research/${post.slug}/index.html`, html(<Document
    title={`${post.title} — Kurultai Research`}
    description={post.excerpt}
    canonical={canonical}
    image={post.heroImage}
    pageType="article"
    datePublished={post.date}
    articleSection={post.topic}
    keywords={[post.topic, post.title]}
    alternates={{
      markdown: `${canonical}index.md`,
      json: `${SITE}/api/v1/research/${post.slug}.json`,
      citation: `${canonical}citation.json`,
    }}
    structuredData={buildArticleStructuredData(post, SITE)}
  ><ResearchPage post={post} /></Document>));
}
const redirects = Object.fromEntries(posts.flatMap((post) => (post.aliases ?? []).map((alias) => [`/research/${alias}/`, `/research/${post.slug}/`])));
write("redirects.json", JSON.stringify(redirects, null, 2));
write("404.html", html(<Document title="Not found — Kurultai Research" description="The requested research page was not found." canonical={`${SITE}/`} robots="noindex,nofollow"><main className="manifesto-shell" id="main-content"><p>Signal not found.</p><a className="primary-link" href="/">Return to research</a></main></Document>));
write("robots.txt", buildRobots(SITE));
write("sitemap.xml", buildSitemap(posts, SITE));
const agentArtifacts = buildAgentArtifacts(posts, SITE);
for (const [relative, content] of Object.entries(agentArtifacts)) write(relative, content);

const files: Record<string, string> = {};
for (const relative of ["index.html", "agents/index.html", "404.html", "robots.txt", "styles.css", "sitemap.xml", "redirects.json", ...Object.keys(agentArtifacts), ...posts.flatMap((post) => [`research/${post.slug}/index.html`, `knowledge-graphs/${post.slug}.svg`])]) {
  files[relative] = crypto.createHash("sha256").update(fs.readFileSync(path.join(DIST, relative))).digest("hex");
}
write("build-manifest.json", JSON.stringify({ schemaVersion: 1, builtAt: getStableBuildTimestamp(posts), postCount: posts.length, files }, null, 2));
console.log(JSON.stringify({ status: "built", dist: DIST, postCount: posts.length, fileCount: Object.keys(files).length }));

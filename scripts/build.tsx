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
write("index.html", html(<Document title="Kurultai Research" description="Source-backed research on agent systems, governed autonomy, and reliable intelligence." canonical={SITE}><Home /></Document>));
write("agents/index.html", html(<Document title="Agent Interface — Kurultai Research" description="Stable JSON, exact Markdown, content hashes, and feeds for ingesting Kurultai Research." canonical={`${SITE}/agents/`}><AgentPage /></Document>));
for (const post of posts) {
  write(`knowledge-graphs/${post.slug}.svg`, renderKnowledgeGraphSvg(post));
  write(`research/${post.slug}/index.html`, html(<Document title={`${post.title} — Kurultai Research`} description={post.excerpt} canonical={`${SITE}/research/${post.slug}/`} image={post.heroImage}><ResearchPage post={post} /></Document>));
}
const redirects = Object.fromEntries(posts.flatMap((post) => (post.aliases ?? []).map((alias) => [`/research/${alias}/`, `/research/${post.slug}/`])));
write("redirects.json", JSON.stringify(redirects, null, 2));
write("404.html", html(<Document title="Not found — Kurultai Research" description="The requested research page was not found." canonical={SITE}><main className="manifesto-shell" id="main-content"><p>Signal not found.</p><a className="primary-link" href="/">Return to research</a></main></Document>));
write("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${SITE}/</loc></url>${posts.map((post) => `<url><loc>${SITE}/research/${post.slug}/</loc><lastmod>${post.date}</lastmod></url>`).join("")}</urlset>`);
const agentArtifacts = buildAgentArtifacts(posts, SITE);
for (const [relative, content] of Object.entries(agentArtifacts)) write(relative, content);

const files: Record<string, string> = {};
for (const relative of ["index.html", "agents/index.html", "styles.css", "sitemap.xml", "redirects.json", ...Object.keys(agentArtifacts), ...posts.flatMap((post) => [`research/${post.slug}/index.html`, `knowledge-graphs/${post.slug}.svg`])]) {
  files[relative] = crypto.createHash("sha256").update(fs.readFileSync(path.join(DIST, relative))).digest("hex");
}
write("build-manifest.json", JSON.stringify({ schemaVersion: 1, builtAt: getStableBuildTimestamp(posts), postCount: posts.length, files }, null, 2));
console.log(JSON.stringify({ status: "built", dist: DIST, postCount: posts.length, fileCount: Object.keys(files).length }));

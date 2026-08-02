import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { createRequire } from "node:module";
import { renderToStaticMarkup } from "react-dom/server";
import Home from "@/app/page";
import { Document } from "@/components/document";
import { ResearchPage } from "@/components/research-page";
import { getAllPosts } from "@/lib/content";

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
for (const post of posts) {
  write(`research/${post.slug}/index.html`, html(<Document title={`${post.title} — Kurultai Research`} description={post.excerpt} canonical={`${SITE}/research/${post.slug}/`} image={post.heroImage}><ResearchPage post={post} /></Document>));
}
write("404.html", html(<Document title="Not found — Kurultai Research" description="The requested research page was not found." canonical={SITE}><main className="manifesto-shell" id="main-content"><p>Signal not found.</p><a className="primary-link" href="/">Return to research</a></main></Document>));
write("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${SITE}/</loc></url>${posts.map((post) => `<url><loc>${SITE}/research/${post.slug}/</loc><lastmod>${post.date}</lastmod></url>`).join("")}</urlset>`);
write("llms.txt", ["# Kurultai Research", "", "> Source-backed research on agent systems, governed autonomy, and reliable intelligence.", "", "## Publication boundary", "", "Dreamer proposes. Humans authorize publication. This site contains frozen, reviewed snapshots and has no access to the private Brain or runtime.", "", "## Research", "", ...posts.map((post) => `- [${post.title}](${SITE}/research/${post.slug}/): ${post.excerpt}`), ""].join("\n"));

const files: Record<string, string> = {};
for (const relative of ["index.html", "styles.css", "llms.txt", "sitemap.xml", ...posts.map((post) => `research/${post.slug}/index.html`)]) {
  files[relative] = crypto.createHash("sha256").update(fs.readFileSync(path.join(DIST, relative))).digest("hex");
}
write("build-manifest.json", JSON.stringify({ schemaVersion: 1, builtAt: new Date().toISOString(), postCount: posts.length, files }, null, 2));
console.log(JSON.stringify({ status: "built", dist: DIST, postCount: posts.length, fileCount: Object.keys(files).length }));

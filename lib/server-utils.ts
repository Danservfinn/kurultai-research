import path from "node:path";

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
};

export function getContentType(filePath: string): string {
  const name = path.basename(filePath);
  if (name === "feed.json") return "application/feed+json; charset=utf-8";
  if (name === "citation.json") return "application/vnd.citationstyles.csl+json; charset=utf-8";
  if (name === "feed.xml") return "application/atom+xml; charset=utf-8";
  return MIME[path.extname(filePath).toLowerCase()] ?? "application/octet-stream";
}

export function getCacheControl(filePath: string): string {
  const extension = path.extname(filePath).toLowerCase();
  return [".woff2", ".png"].includes(extension)
    ? "public, max-age=86400, immutable"
    : "public, max-age=60, must-revalidate";
}

export function getRedirectTarget(urlPath: string, redirects: Record<string, string>): string | null {
  let decoded: string;
  try { decoded = decodeURIComponent(urlPath.split("?", 1)[0]); } catch { return null; }
  if (decoded.includes("\0") || decoded.split("/").includes("..")) return null;
  const clean = decoded.replace(/^\/+|\/+$/g, "");
  const normalized = clean ? `/${clean}/` : "/";
  return redirects[normalized] ?? null;
}

export function resolveRequestPath(urlPath: string, distRoot: string): string | null {
  let decoded: string;
  try { decoded = decodeURIComponent(urlPath.split("?", 1)[0]); } catch { return null; }
  if (decoded.includes("\0") || decoded.split("/").includes("..")) return null;
  const clean = decoded.replace(/^\/+/, "");
  const relative = clean === "" ? "index.html" : path.extname(clean) ? clean : path.join(clean, "index.html");
  const resolved = path.resolve(distRoot, relative);
  const root = path.resolve(distRoot) + path.sep;
  if (resolved !== path.resolve(distRoot, "index.html") && !resolved.startsWith(root)) return null;
  return resolved;
}

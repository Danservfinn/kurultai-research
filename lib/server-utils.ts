import path from "node:path";

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

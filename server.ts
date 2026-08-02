import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { getCacheControl, getContentType, getRedirectTarget, resolveRequestPath } from "./lib/server-utils";

const ROOT = path.resolve(process.env.DIST_ROOT || path.join(process.cwd(), "dist"));
const HOST = process.env.HOST || "127.0.0.1";
const PORT = Number(process.env.PORT || 18804);
let REDIRECTS: Record<string, string> = {};
try { REDIRECTS = JSON.parse(fs.readFileSync(path.join(ROOT, "redirects.json"), "utf8")) as Record<string, string>; } catch { REDIRECTS = {}; }

const HEADERS = {
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
  "referrer-policy": "strict-origin-when-cross-origin",
  "permissions-policy": "camera=(), microphone=(), geolocation=()",
  "access-control-allow-origin": "*",
  "content-security-policy": "default-src 'self'; img-src 'self' data:; style-src 'self'; font-src 'self'; script-src 'none'; connect-src 'self'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'",
};

const server = http.createServer((req, res) => {
  Object.entries(HEADERS).forEach(([key, value]) => res.setHeader(key, value));
  if (!req.url || !["GET", "HEAD"].includes(req.method || "")) {
    res.writeHead(405, { allow: "GET, HEAD" }); return res.end();
  }
  if (req.url.split("?", 1)[0] === "/health") {
    res.writeHead(200, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
    return res.end(req.method === "HEAD" ? undefined : JSON.stringify({ status: "ok", service: "kurultai-research", visibility: "public", contentMode: "frozen-reviewed-snapshots" }));
  }
  const redirect = getRedirectTarget(req.url, REDIRECTS);
  if (redirect) {
    res.writeHead(308, { location: redirect, "cache-control": "public, max-age=86400" });
    return res.end();
  }
  let target = resolveRequestPath(req.url, ROOT);
  if (!target || !fs.existsSync(target) || !fs.statSync(target).isFile()) {
    target = path.join(ROOT, "404.html"); res.statusCode = 404;
  }
  res.setHeader("content-type", getContentType(target));
  res.setHeader("cache-control", getCacheControl(target));
  if (req.method === "HEAD") return res.end();
  fs.createReadStream(target).on("error", () => { if (!res.headersSent) res.writeHead(500); res.end(); }).pipe(res);
});

server.listen(PORT, HOST, () => console.log(`kurultai-research listening on http://${HOST}:${PORT}`));

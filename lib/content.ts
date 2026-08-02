import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { buildKnowledgeGraph, type KnowledgeGraph } from "@/lib/knowledge-graph";

export type Provenance = {
  synthesis: string;
  review: string;
  provider: string;
};

export type PublicPost = {
  slug: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  date: string;
  topic: string;
  readingMinutes: number;
  public: boolean;
  status: "published" | "draft";
  featured: boolean;
  heroImage?: string;
  content: string;
  provenance: Provenance;
  sourceSha256?: string;
  sourceArtifactSha256?: string;
  publicEdition?: "public-redacted-v1" | "public-redacted-v2-brand-normalized" | "public-redacted-v3-zero-legacy-spelling";
  publicationNote?: string;
  canonicalSlug?: string;
  aliases?: string[];
  knowledgeGraph: KnowledgeGraph;
};

type ManifestPost = Omit<PublicPost, "content" | "knowledgeGraph"> & {
  sourceFile: string;
  sourceSha256: string;
};

type Manifest = { schemaVersion: number; posts: ManifestPost[] };

const ROOT = process.cwd();
const MANIFEST_PATH = path.join(ROOT, "content", "publication-manifest.json");
const SNAPSHOT_ROOT = path.join(ROOT, "content", "snapshots");
const PRIVATE_PATTERNS: Array<[RegExp, string]> = [
  [/\/(?:Users|home)\/[A-Za-z0-9._-]+\//, "private path"],
  [/\[\[[^\]]+\]\]/, "internal wikilink"],
  [/(?:api[_-]?key|secret|password|authorization)\s*[:=]\s*[^\s]+/i, "credential-shaped value"],
  [/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/, "private key"],
  [/20\d{6}_\d{6}_[0-9a-f]{8}/, "private session reference"],
];

export function validatePublicPost<T extends Pick<PublicPost, "public" | "status" | "content">>(post: T): { ok: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!post.public) errors.push("post is not marked public");
  if (post.status !== "published") errors.push("post is not published");
  for (const [pattern, label] of PRIVATE_PATTERNS) {
    if (pattern.test(post.content)) errors.push(`content contains ${label}`);
  }
  return { ok: errors.length === 0, errors };
}

function readManifest(): Manifest {
  return JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8")) as Manifest;
}

function materialize(entry: ManifestPost): PublicPost {
  const safeName = path.basename(entry.sourceFile);
  if (safeName !== entry.sourceFile) throw new Error(`Unsafe source filename for ${entry.slug}`);
  const sourcePath = path.join(SNAPSHOT_ROOT, safeName);
  const content = fs.readFileSync(sourcePath, "utf8");
  const digest = crypto.createHash("sha256").update(content).digest("hex");
  if (digest !== entry.sourceSha256) {
    throw new Error(`Frozen source hash mismatch for ${entry.slug}`);
  }
  const { sourceFile: _sourceFile, ...metadata } = entry;
  void _sourceFile;
  const post: PublicPost = { ...metadata, content, knowledgeGraph: buildKnowledgeGraph(content) };
  const validation = validatePublicPost(post);
  if (!validation.ok) {
    throw new Error(`Public content boundary failed for ${entry.slug}: ${validation.errors.join(", ")}`);
  }
  return post;
}

export function getAllPosts(): PublicPost[] {
  return readManifest().posts
    .filter((entry) => entry.public && entry.status === "published")
    .map(materialize)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPostBySlug(slug: string): PublicPost | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}

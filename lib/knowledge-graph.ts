export type KnowledgeFamily = {
  id: string;
  label: string;
  description: string;
};

export type KnowledgeSource = {
  id: string;
  label: string;
  detail: string;
  familyId: string;
};

export type KnowledgeRelation = "shared-neighborhood" | "cross-domain";

export type KnowledgeEdge = {
  sourceId: string;
  targetId: string;
  relation: KnowledgeRelation;
  reason: string;
};

export type KnowledgeGraph = {
  sourceCount: number;
  sources: KnowledgeSource[];
  families: KnowledgeFamily[];
  edges: KnowledgeEdge[];
};

const FAMILY_DEFINITIONS: KnowledgeFamily[] = [
  { id: "governance", label: "Governance + authority", description: "Policy, safety, control, and authorization" },
  { id: "evidence", label: "Evidence + verification", description: "Tests, audits, receipts, and measured findings" },
  { id: "architecture", label: "Architecture + operations", description: "Designs, implementations, runtimes, and loops" },
  { id: "research", label: "Research + synthesis", description: "Studies, surveys, prior art, and doctrine" },
];

const STOP_WORDS = new Set([
  "about", "after", "agent", "architecture", "article", "before", "brain", "design", "evidence", "exact", "from", "into", "local", "paper", "public", "report", "review", "source", "study", "system", "that", "their", "this", "through", "used", "with",
]);

function splitTableRow(line: string): string[] {
  return line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim());
}

function stripMarkdown(value: string): string {
  return value
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/<https?:\/\/[^>]+>/g, "")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/[*_~]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[.,;:]$/, "");
}

function pathLabel(value: string): string {
  const withoutHash = value.replace(/\s+at SHA-256.*$/i, "");
  const parts = withoutHash.split("/").filter(Boolean);
  const last = parts[parts.length - 1] ?? withoutHash;
  return last
    .replace(/\.(?:md|json|ya?ml|html?|py)$/i, "")
    .replace(/^\d{4}-\d{2}-\d{2}-/, "")
    .replace(/^S\d+[-_]/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function sourceLabel(source: string): string {
  const pathCandidate = source.replace(/`/g, "").trim();
  if (pathCandidate.includes("/") || /\.(?:md|json|ya?ml|html?|py)(?:\s|$)/i.test(pathCandidate)) return pathLabel(pathCandidate);
  return stripMarkdown(source);
}

function classify(text: string): string {
  const value = text.toLowerCase();
  if (/authority|authoriz|policy|threat|safety|control|privilege|broker|consent|tenant|govern|law|immutable rule/.test(value)) return "governance";
  if (/test|receipt|readback|validat|audit|evidence|benchmark|review|falsif|evaluation|certificate|provenance|attest/.test(value)) return "evidence";
  if (/architect|design|plan|implementation|runtime|harness|graph|framework|system|loop|gate|compiler|state machine|service/.test(value)) return "architecture";
  return "research";
}

function parseSourceTable(content: string): KnowledgeSource[] {
  const lines = content.split("\n");
  for (let index = 0; index < lines.length - 2; index += 1) {
    const headerLine = lines[index];
    const dividerLine = lines[index + 1];
    if (!/^\s*\|.*\|\s*$/.test(headerLine) || !/^\s*\|(?:\s*:?-{3,}:?\s*\|)+\s*$/.test(dividerLine)) continue;

    const headers = splitTableRow(headerLine).map((header) => stripMarkdown(header).toLowerCase());
    const sourceIndex = headers.indexOf("source");
    if (sourceIndex < 0) continue;
    const idIndex = headers.findIndex((header) => header === "id" || header === "#");
    if (idIndex < 0) continue;

    const detailIndexes = headers
      .map((header, cellIndex) => ({ header, cellIndex }))
      .filter(({ header }) => /role|kind|type|used for/.test(header))
      .map(({ cellIndex }) => cellIndex);
    const sources: KnowledgeSource[] = [];

    for (let rowIndex = index + 2; rowIndex < lines.length && /^\s*\|.*\|\s*$/.test(lines[rowIndex]); rowIndex += 1) {
      const cells = splitTableRow(lines[rowIndex]);
      const rawId = stripMarkdown(cells[idIndex] ?? "");
      if (!/^(?:S|C)?\d+$/i.test(rawId)) continue;
      const label = sourceLabel(cells[sourceIndex] ?? "");
      const detail = detailIndexes.map((cellIndex) => stripMarkdown(cells[cellIndex] ?? "")).filter(Boolean).join(" — ");
      if (!label) continue;
      sources.push({ id: rawId.toUpperCase(), label, detail, familyId: classify(`${label} ${detail}`) });
    }

    if (sources.length > 1) return sources;
  }
  return [];
}

function parseReferenceList(content: string): KnowledgeSource[] {
  const lines = content.split("\n");
  const headingIndex = lines.findIndex((line) => /^#{2,4}\s+.*(?:references|evidence and references)\s*$/i.test(line.trim()));
  if (headingIndex < 0) return [];

  const sources: KnowledgeSource[] = [];
  for (let index = headingIndex + 1; index < lines.length; index += 1) {
    const line = lines[index].trim();
    if (/^#{1,4}\s+/.test(line)) break;
    const match = line.match(/^(\d+)\.\s+(.+)$/);
    if (!match) continue;
    const full = stripMarkdown(match[2]);
    const label = full.split(/:\s|\.\s/)[0].trim();
    sources.push({ id: `R${match[1]}`, label: label || `Reference ${match[1]}`, detail: full, familyId: classify(full) });
  }
  return sources;
}

function tokens(source: KnowledgeSource): Set<string> {
  return new Set(`${source.label} ${source.detail}`.toLowerCase().match(/[a-z][a-z0-9-]{3,}/g)?.filter((token) => !STOP_WORDS.has(token)) ?? []);
}

function buildEdges(sources: KnowledgeSource[]): KnowledgeEdge[] {
  const edges: KnowledgeEdge[] = [];
  const seen = new Set<string>();
  const add = (sourceId: string, targetId: string, relation: KnowledgeRelation, reason: string) => {
    if (sourceId === targetId) return;
    const pair = [sourceId, targetId].sort().join("::");
    if (seen.has(pair)) return;
    seen.add(pair);
    edges.push({ sourceId, targetId, relation, reason });
  };

  for (const family of FAMILY_DEFINITIONS) {
    const members = sources.filter((source) => source.familyId === family.id);
    for (let index = 1; index < members.length; index += 1) {
      add(members[index - 1].id, members[index].id, "shared-neighborhood", `Both sources are classified in ${family.label} from their frozen public role metadata`);
    }
    if (members.length > 3) {
      add(members[0].id, members[Math.floor(members.length / 2)].id, "shared-neighborhood", `Both sources are classified in ${family.label} from their frozen public role metadata`);
    }
  }

  const tokenSets = new Map(sources.map((source) => [source.id, tokens(source)]));
  const candidates: Array<{ left: KnowledgeSource; right: KnowledgeSource; shared: string[] }> = [];
  for (let leftIndex = 0; leftIndex < sources.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < sources.length; rightIndex += 1) {
      const left = sources[leftIndex];
      const right = sources[rightIndex];
      if (left.familyId === right.familyId) continue;
      const shared = [...(tokenSets.get(left.id) ?? [])].filter((token) => tokenSets.get(right.id)?.has(token));
      if (shared.length >= 2) candidates.push({ left, right, shared });
    }
  }
  candidates
    .sort((a, b) => b.shared.length - a.shared.length || `${a.left.id}-${a.right.id}`.localeCompare(`${b.left.id}-${b.right.id}`))
    .slice(0, Math.max(1, Math.min(6, Math.floor(sources.length / 4))))
    .forEach(({ left, right, shared }) => add(left.id, right.id, "cross-domain", `Public labels or role metadata share: ${shared.slice(0, 3).join(", ")}`));

  return edges;
}

export function buildKnowledgeGraph(content: string): KnowledgeGraph {
  const sources = parseSourceTable(content);
  const resolvedSources = sources.length ? sources : parseReferenceList(content);
  if (!resolvedSources.length) throw new Error("Published paper has no parseable source manifest or reference list");
  const familyIds = new Set(resolvedSources.map((source) => source.familyId));
  const families = FAMILY_DEFINITIONS.filter((family) => familyIds.has(family.id));
  return { sourceCount: resolvedSources.length, sources: resolvedSources, families, edges: buildEdges(resolvedSources) };
}

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

export type KnowledgeGraph = {
  sourceCount: number;
  sources: KnowledgeSource[];
  families: KnowledgeFamily[];
};

const FAMILY_DEFINITIONS: KnowledgeFamily[] = [
  { id: "governance", label: "Governance + authority", description: "Policy, safety, control, and authorization" },
  { id: "evidence", label: "Evidence + verification", description: "Tests, audits, receipts, and measured findings" },
  { id: "architecture", label: "Architecture + operations", description: "Designs, implementations, runtimes, and loops" },
  { id: "research", label: "Research + synthesis", description: "Studies, surveys, prior art, and doctrine" },
];

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

export function buildKnowledgeGraph(content: string): KnowledgeGraph {
  const sources = parseSourceTable(content);
  const resolvedSources = sources.length ? sources : parseReferenceList(content);
  if (!resolvedSources.length) throw new Error("Published paper has no parseable source manifest or reference list");
  const familyIds = new Set(resolvedSources.map((source) => source.familyId));
  const families = FAMILY_DEFINITIONS.filter((family) => familyIds.has(family.id));
  return { sourceCount: resolvedSources.length, sources: resolvedSources, families };
}

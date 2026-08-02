import type { PublicPost } from "@/lib/content";

function escapeXml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[character] ?? character);
}

function truncate(value: string, length: number): string {
  return value.length > length ? `${value.slice(0, length - 1).trim()}…` : value;
}

export function renderKnowledgeGraphSvg(post: PublicPost): string {
  const { knowledgeGraph: graph } = post;
  const familyCount = graph.families.length;
  const columnWidth = 1520 / familyCount;
  const maxSources = Math.max(...graph.families.map((family) => graph.sources.filter((source) => source.familyId === family.id).length));
  const sourceStartY = 156;
  const rowPitch = 72;
  const familyY = sourceStartY + maxSources * rowPitch + 26;
  const synthesisY = familyY + 132;
  const height = synthesisY + 168;
  const titleId = `kg-title-${post.slug}`;
  const descriptionId = `kg-description-${post.slug}`;

  const familyMarkup = graph.families.map((family, familyIndex) => {
    const x = 40 + familyIndex * columnWidth;
    const nodeWidth = columnWidth - 24;
    const sources = graph.sources.filter((source) => source.familyId === family.id);
    const sourceMarkup = sources.map((source, sourceIndex) => {
      const y = sourceStartY + sourceIndex * rowPitch;
      const centerX = x + nodeWidth / 2;
      return `<g class="source-node"><title>${escapeXml(`${source.label}${source.detail ? ` — ${source.detail}` : ""}`)}</title><path d="M ${centerX} ${y + 54} L ${centerX} ${familyY}"/><rect x="${x}" y="${y}" width="${nodeWidth}" height="54" rx="8"/><text class="source-id" x="${x + 14}" y="${y + 21}">${escapeXml(source.id)}</text><text class="source-label" x="${x + 52}" y="${y + 21}">${escapeXml(truncate(source.label, 48))}</text><text class="source-detail" x="${x + 52}" y="${y + 40}">${escapeXml(truncate(source.detail, 52))}</text></g>`;
    }).join("");
    const familyCenter = x + nodeWidth / 2;
    return `${sourceMarkup}<g class="family-node"><path d="M ${familyCenter} ${familyY + 62} L 800 ${synthesisY}"/><rect x="${x}" y="${familyY}" width="${nodeWidth}" height="62" rx="10"/><text class="family-label" x="${x + 16}" y="${familyY + 25}">${escapeXml(family.label)}</text><text class="family-detail" x="${x + 16}" y="${familyY + 45}">${escapeXml(family.description)}</text></g>`;
  }).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 ${height}" role="img" aria-labelledby="${titleId} ${descriptionId}"><title id="${titleId}">Knowledge lineage for ${escapeXml(post.title)}</title><desc id="${descriptionId}">${graph.sourceCount} source records grouped into evidence families and connected to the synthesized paper.</desc><style>@font-face{font-family:Outfit;src:local('Outfit')}@font-face{font-family:JetBrains Mono;src:local('JetBrains Mono')}text{font-family:Outfit,Arial,sans-serif}.canvas{fill:#18201c}.grid{stroke:#fbfcf7;stroke-opacity:.055}.kicker,.source-id,.family-detail,.source-count{font-family:'JetBrains Mono',monospace}.kicker{font-size:14px;letter-spacing:2.5px;fill:#d9ff70}.graph-title{font-size:32px;font-weight:560;fill:#fbfcf7}.source-count{font-size:13px;letter-spacing:1.5px;fill:#aeb9b1}.source-node path,.family-node path{stroke:#89958c;stroke-opacity:.36;stroke-width:1.2;fill:none}.source-node rect{fill:#202a25;stroke:#fbfcf7;stroke-opacity:.12}.source-id{font-size:12px;fill:#d9ff70}.source-label{font-size:14px;font-weight:580;fill:#fbfcf7}.source-detail{font-size:10.5px;fill:#aeb9b1}.family-node rect{fill:#d9ff70}.family-label{font-size:16px;font-weight:650;fill:#18201c}.family-detail{font-size:10px;fill:#35413b}.paper-node rect{fill:#f2f1eb}.paper-kicker{font-family:'JetBrains Mono',monospace;font-size:12px;letter-spacing:2px;fill:#6a7b58}.paper-title{font-size:23px;font-weight:650;fill:#18201c}.paper-detail{font-size:12px;fill:#35413b}</style><rect class="canvas" width="1600" height="${height}"/><g class="grid">${Array.from({ length: 25 }, (_, index) => `<path d="M ${index * 68} 0 V ${height}"/>`).join("")}${Array.from({ length: Math.ceil(height / 68) }, (_, index) => `<path d="M 0 ${index * 68} H 1600"/>`).join("")}</g><text class="kicker" x="40" y="48">KNOWLEDGE LINEAGE</text><text class="graph-title" x="40" y="88">Sources connected through evidence families</text><text class="source-count" x="1560" y="49" text-anchor="end">${graph.sourceCount} SOURCE RECORDS</text>${familyMarkup}<g class="paper-node"><rect x="390" y="${synthesisY}" width="820" height="104" rx="14"/><text class="paper-kicker" x="420" y="${synthesisY + 31}">SYNTHESIZED PAPER</text><text class="paper-title" x="420" y="${synthesisY + 61}">${escapeXml(truncate(post.title, 70))}</text><text class="paper-detail" x="420" y="${synthesisY + 84}">Frozen public snapshot · ${escapeXml(post.date)} · ${graph.sourceCount} traceable inputs</text></g></svg>`;
}

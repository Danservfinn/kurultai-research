import type { PublicPost } from "@/lib/content";

function escapeXml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[character] ?? character);
}

function truncate(value: string, length: number): string {
  return value.length > length ? `${value.slice(0, length - 1).trim()}…` : value;
}

type NodePosition = { x: number; y: number };

function curvedPath(from: NodePosition, to: NodePosition): string {
  const bend = Math.max(32, Math.abs(to.y - from.y) * 0.28);
  return `M ${from.x} ${from.y} C ${from.x} ${from.y + bend}, ${to.x} ${to.y - bend}, ${to.x} ${to.y}`;
}

function neuronDendrites(x: number, y: number, seed: number): string {
  const angles = [205, 245, 300, 338, 22, 65, 112, 158];
  return angles.map((angle, index) => {
    const radians = (angle + (seed % 9) - 4) * Math.PI / 180;
    const length = 12 + ((seed + index * 7) % 9);
    const x2 = x + Math.cos(radians) * length;
    const y2 = y + Math.sin(radians) * length;
    const x3 = x2 + Math.cos(radians + (index % 2 ? .35 : -.35)) * 7;
    const y3 = y2 + Math.sin(radians + (index % 2 ? .35 : -.35)) * 7;
    return `<path d="M ${x} ${y} Q ${x2} ${y2} ${x3} ${y3}"/>`;
  }).join("");
}

export function renderKnowledgeGraphSvg(post: PublicPost): string {
  const { knowledgeGraph: graph } = post;
  const familyCount = graph.families.length;
  const columnWidth = 1520 / familyCount;
  const maxSources = Math.max(...graph.families.map((family) => graph.sources.filter((source) => source.familyId === family.id).length));
  const sourceStartY = 184;
  const rowPitch = 78;
  const familyY = sourceStartY + maxSources * rowPitch + 54;
  const synthesisY = familyY + 144;
  const legendY = synthesisY + 142;
  const height = legendY + 82;
  const titleId = `kg-title-${post.slug}`;
  const descriptionId = `kg-description-${post.slug}`;
  const positions = new Map<string, NodePosition>();

  for (const [familyIndex, family] of graph.families.entries()) {
    const x = 54 + familyIndex * columnWidth;
    const sources = graph.sources.filter((source) => source.familyId === family.id);
    for (const [sourceIndex, source] of sources.entries()) {
      positions.set(source.id, { x: x + 27, y: sourceStartY + sourceIndex * rowPitch + 27 });
    }
  }

  const interSourceMarkup = graph.edges.map((edge) => {
    const from = positions.get(edge.sourceId);
    const to = positions.get(edge.targetId);
    if (!from || !to) return "";
    return `<g class="inter-source ${edge.relation}"><title>${escapeXml(`${edge.sourceId} ↔ ${edge.targetId}: ${edge.reason}`)}</title><path d="${curvedPath(from, to)}"/></g>`;
  }).join("");

  const familyMarkup = graph.families.map((family, familyIndex) => {
    const x = 40 + familyIndex * columnWidth;
    const nodeWidth = columnWidth - 24;
    const familyCenter = x + nodeWidth / 2;
    const sources = graph.sources.filter((source) => source.familyId === family.id);
    const sourceMarkup = sources.map((source, sourceIndex) => {
      const position = positions.get(source.id)!;
      const y = sourceStartY + sourceIndex * rowPitch;
      return `<g class="source-neuron"><title>${escapeXml(`${source.label}${source.detail ? ` — ${source.detail}` : ""}`)}</title><path class="axon" d="${curvedPath(position, { x: familyCenter, y: familyY })}"/><g class="dendrites">${neuronDendrites(position.x, position.y, sourceIndex + familyIndex * 11)}</g><circle class="soma-halo" cx="${position.x}" cy="${position.y}" r="15"/><circle class="soma" cx="${position.x}" cy="${position.y}" r="8"/><rect class="source-card" x="${x + 50}" y="${y}" width="${nodeWidth - 50}" height="56" rx="11"/><text class="source-id" x="${x + 66}" y="${y + 20}">${escapeXml(source.id)}</text><text class="source-label" x="${x + 102}" y="${y + 20}">${escapeXml(truncate(source.label, 34))}</text><text class="source-detail" x="${x + 66}" y="${y + 40}">${escapeXml(truncate(source.detail, 43))}</text></g>`;
    }).join("");
    return `${sourceMarkup}<g class="family-neuron"><path d="M ${familyCenter} ${familyY + 64} C ${familyCenter} ${familyY + 104}, 800 ${synthesisY - 38}, 800 ${synthesisY}"/><circle class="hub-halo" cx="${familyCenter}" cy="${familyY + 32}" r="28"/><circle class="hub" cx="${familyCenter}" cy="${familyY + 32}" r="17"/><rect x="${x + 14}" y="${familyY + 72}" width="${nodeWidth - 28}" height="50" rx="12"/><text class="family-label" x="${x + 28}" y="${familyY + 94}">${escapeXml(family.label)}</text><text class="family-detail" x="${x + 28}" y="${familyY + 111}">${escapeXml(family.description)}</text></g>`;
  }).join("");

  const description = `${graph.sourceCount} source neurons with ${graph.edges.length} deterministic source-to-source relationships, grouped into evidence neighborhoods and connected to the synthesized paper.`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 ${height}" role="img" data-graph-version="2" data-source-count="${graph.sourceCount}" data-edge-count="${graph.edges.length}" aria-labelledby="${titleId} ${descriptionId}"><title id="${titleId}">Knowledge lineage for ${escapeXml(post.title)}</title><desc id="${descriptionId}">${escapeXml(description)}</desc><defs><radialGradient id="brain-glow"><stop offset="0" stop-color="#193c52" stop-opacity=".72"/><stop offset=".72" stop-color="#0d1f35" stop-opacity=".24"/><stop offset="1" stop-color="#07111f" stop-opacity="0"/></radialGradient><filter id="soft-glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="5"/></filter></defs><style>text{font-family:Outfit,Arial,sans-serif}.canvas{fill:#07111f}.brain-glow{fill:url(#brain-glow)}.brain-outline{fill:none;stroke:#6bdcff;stroke-opacity:.12;stroke-width:2}.brain-fold{fill:none;stroke:#a88bff;stroke-opacity:.09;stroke-width:1.4}.kicker,.source-id,.family-detail,.source-count,.legend text{font-family:'JetBrains Mono',monospace}.kicker{font-size:14px;letter-spacing:2.6px;fill:#6bdcff}.graph-title{font-size:31px;font-weight:580;fill:#f5f9ff}.graph-subtitle{font-size:13px;fill:#9db2c7}.source-count{font-size:13px;letter-spacing:1.5px;fill:#ffcc73}.inter-source path{fill:none;stroke-width:1.7}.inter-source.shared-neighborhood path{stroke:#a88bff;stroke-opacity:.58;stroke-dasharray:3 7}.inter-source.cross-domain path{stroke:#ffb85c;stroke-opacity:.72;stroke-dasharray:9 5}.source-neuron .axon{fill:none;stroke:#64dbf7;stroke-opacity:.34;stroke-width:1.2}.dendrites path{fill:none;stroke:#79e5ff;stroke-opacity:.72;stroke-width:1}.soma-halo{fill:#51d7ff;opacity:.22;filter:url(#soft-glow)}.soma{fill:#e8fbff;stroke:#6bdcff;stroke-width:2}.source-card{fill:#0d1c2c;fill-opacity:.9;stroke:#98dff1;stroke-opacity:.13}.source-id{font-size:11px;font-weight:700;fill:#ffcc73}.source-label{font-size:13px;font-weight:620;fill:#f5f9ff}.source-detail{font-size:9.5px;fill:#91a7bc}.family-neuron>path{fill:none;stroke:#ffb85c;stroke-opacity:.58;stroke-width:2}.hub-halo{fill:#ffb85c;opacity:.18;filter:url(#soft-glow)}.hub{fill:#ffcc73;stroke:#fff0c8;stroke-width:2}.family-neuron rect{fill:#13293b;stroke:#ffcc73;stroke-opacity:.5}.family-label{font-size:14px;font-weight:680;fill:#ffdf9e}.family-detail{font-size:9px;fill:#9db2c7}.paper-node rect{fill:#f4f1e8}.paper-kicker{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:2px;fill:#6b6c55}.paper-title{font-size:21px;font-weight:680;fill:#07111f}.paper-detail{font-size:11px;fill:#465360}.legend text{font-size:10px;fill:#9db2c7}.legend-title{fill:#d7e7f6!important;letter-spacing:1.5px}</style><rect class="canvas" width="1600" height="${height}"/><ellipse class="brain-glow" cx="800" cy="${familyY / 2 + 90}" rx="720" ry="${familyY / 2 + 30}"/><path class="brain-outline" d="M 800 126 C 655 74 488 132 404 248 C 280 252 205 358 240 480 C 164 578 227 724 355 744 C 430 862 605 888 800 812 C 995 888 1170 862 1245 744 C 1373 724 1436 578 1360 480 C 1395 358 1320 252 1196 248 C 1112 132 945 74 800 126 Z"/><path class="brain-fold" d="M 800 132 C 770 250 825 342 792 456 C 760 568 823 674 800 806 M 420 258 C 530 314 505 412 612 460 C 700 500 642 612 714 690 M 1180 258 C 1070 314 1095 412 988 460 C 900 500 958 612 886 690 M 294 498 C 430 470 506 546 566 650 M 1306 498 C 1170 470 1094 546 1034 650"/><text class="kicker" x="40" y="48">NEURAL KNOWLEDGE LINEAGE</text><text class="graph-title" x="40" y="88">Sources as neurons in an interconnected evidence network</text><text class="graph-subtitle" x="40" y="114">Topology is generated only from the frozen public source manifest or references.</text><text class="source-count" x="1560" y="50" text-anchor="end">${graph.sourceCount} SOURCE RECORDS · ${graph.edges.length} INTER-SOURCE LINKS</text>${interSourceMarkup}${familyMarkup}<g class="paper-node"><rect x="330" y="${synthesisY}" width="940" height="94" rx="18"/><text class="paper-kicker" x="366" y="${synthesisY + 28}">SYNTHESIZED WHITEPAPER</text><text class="paper-title" x="366" y="${synthesisY + 57}">${escapeXml(truncate(post.title, 78))}</text><text class="paper-detail" x="366" y="${synthesisY + 78}">Frozen public snapshot · ${escapeXml(post.date)} · ${graph.sourceCount} traceable inputs</text></g><g class="legend"><text class="legend-title" x="40" y="${legendY}">EDGE SEMANTICS</text><path d="M 190 ${legendY - 4} H 258" stroke="#a88bff" stroke-width="2" stroke-dasharray="3 7"/><text x="272" y="${legendY}">shared evidence neighborhood</text><path d="M 515 ${legendY - 4} H 583" stroke="#ffb85c" stroke-width="2" stroke-dasharray="9 5"/><text x="597" y="${legendY}">cross-domain metadata overlap</text><path d="M 860 ${legendY - 4} H 928" stroke="#64dbf7" stroke-width="2"/><text x="942" y="${legendY}">source feeds synthesis neighborhood</text><text x="40" y="${legendY + 30}">Inter-source links are deterministic lineage cues from public role metadata—not causal proof, consensus, or equal evidentiary weight.</text></g></svg>`;
}

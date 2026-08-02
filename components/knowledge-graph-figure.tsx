import type { PublicPost } from "@/lib/content";

export function KnowledgeGraphFigure({ post }: { post: PublicPost }) {
  return (
    <figure className="knowledge-graph">
      <div className="knowledge-graph-heading">
        <div>
          <span>Knowledge lineage</span>
          <h2>How this paper was connected</h2>
        </div>
        <strong>{post.knowledgeGraph.sourceCount} source records</strong>
      </div>
      <div className="knowledge-graph-frame">
        <img
          src={`/knowledge-graphs/${post.slug}.svg`}
          width="1600"
          height="1000"
          alt={`Knowledge lineage for ${post.title}: ${post.knowledgeGraph.sourceCount} source records grouped into evidence families and connected to the synthesized paper`}
        />
      </div>
      <figcaption>
        <span>Graph reading</span>
        <p>Edges show source record to evidence family to synthesized paper. Grouping is derived from the frozen public source manifest; it shows lineage, not causal proof or equal evidentiary weight.</p>
      </figcaption>
    </figure>
  );
}

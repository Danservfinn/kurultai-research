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
          alt={`Neural knowledge lineage for ${post.title}: ${post.knowledgeGraph.sourceCount} source records shown as neurons with ${post.knowledgeGraph.edges.length} deterministic inter-source links, grouped into evidence neighborhoods and connected to the synthesized paper`}
        />
      </div>
      <figcaption>
        <span>Graph reading</span>
        <p>Sources are rendered as neuron nodes. Violet links mark a shared evidence neighborhood; amber links mark cross-domain overlap in frozen public labels or role metadata; cyan paths feed synthesis neighborhoods. These are deterministic lineage cues—not causal proof, consensus, or equal evidentiary weight.</p>
      </figcaption>
    </figure>
  );
}

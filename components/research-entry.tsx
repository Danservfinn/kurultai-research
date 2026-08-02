import type { PublicPost } from "@/lib/content";

export function ResearchEntry({ post }: { post: PublicPost }) {
  return (
    <article className="research-entry">
      <div className="entry-index">01</div>
      <div className="entry-copy">
        <div className="eyebrow-row"><span>{post.topic}</span><span>{post.readingMinutes} min read</span><span>Reviewed</span></div>
        <h3><a href={`/research/${post.slug}/`}>{post.title}</a></h3>
        <p>{post.excerpt}</p>
      </div>
      <a className="entry-arrow" href={`/research/${post.slug}/`} aria-label={`Read ${post.title}`}>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" /></svg>
      </a>
    </article>
  );
}

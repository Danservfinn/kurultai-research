import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import type { PublicPost } from "@/lib/content";

export function ResearchPage({ post }: { post: PublicPost }) {
  const body = post.content
    .replace(/^---[\s\S]*?---\s*/, "")
    .replace(/^# .*\n/, "")
    .replace(post.subtitle ? `*${post.subtitle}*` : "", "");
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="article-page">
        <div className="article-rail"><a href="/">← Research index</a><span>{post.topic}</span></div>
        <header className="article-header">
          <div className="article-meta"><span>{post.date}</span><span>{post.readingMinutes} min read</span><span>Frozen source</span></div>
          <h1>{post.title}</h1>
          {post.subtitle && <p className="article-subtitle">{post.subtitle}</p>}
          <div className="provenance-strip">
            <div><b>Source</b><span>{post.provenance.synthesis}</span></div>
            <div><b>Review</b><span>{post.provenance.review}</span></div>
            <div><b>Model record</b><span>{post.provenance.provider}</span></div>
          </div>
        </header>
        {post.heroImage && <figure className="article-hero-image"><img src={post.heroImage} width="1672" height="940" alt="Immutable rules separating proposal, authority, evidence, and recovery" /></figure>}
        <aside className="publication-update"><b>Publication update</b><p>Published by explicit operator authorization on August 2, 2026. Status language inside the article reflects its frozen July 24 pre-publication snapshot.</p></aside>
        <article className="prose-shell">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
            a: ({ href, children }) => <a href={href} rel="noreferrer">{children}</a>,
            img: ({ src, alt }) => typeof src === "string" ? <img src={src} width="1200" height="675" alt={alt ?? "Research diagram"} /> : null,
          }}>{body}</ReactMarkdown>
        </article>
        <aside className="article-close">
          <span>PUBLICATION NOTE</span>
          <p>This is a frozen public snapshot. It cannot reach the private Brain, mutate runtime state, or update itself.</p>
          <a href="/">Return to research index <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></a>
        </aside>
      </main>
      <SiteFooter />
    </>
  );
}

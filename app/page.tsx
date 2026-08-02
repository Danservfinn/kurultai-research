import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { SignalField } from "@/components/signal-field";
import { ResearchEntry } from "@/components/research-entry";
import { getAllPosts } from "@/lib/content";

export default function Home() {
  const posts = getAllPosts();
  const featured = posts.find((post) => post.featured) ?? posts[0];

  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <section className="hero-shell">
          <div className="hero-copy">
            <div className="hero-kicker"><span className="live-pip" />Knowledge systems / 2026</div>
            <h1>Knowledge that<br /> survives review.</h1>
            <p>Research on governed autonomy, agent systems, and reliable intelligence—compiled from evidence, tested against failure, and published only after review.</p>
            {featured && <a className="primary-link" href={`/research/${featured.slug}/`}>Read the latest synthesis <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></a>}
          </div>
          <SignalField />
          <div className="hero-aside"><span>PUBLICATION PROTOCOL</span><p>Dreamer proposes. Humans authorize publication.</p></div>
        </section>

        <section className="research-shell" id="research">
          <div className="section-heading"><span>01 / RESEARCH</span><h2>Current signals</h2><p>Distilled findings with explicit provenance, evidence boundaries, and operational limits.</p></div>
          <div className="research-list">
            {posts.length ? posts.map((post) => <ResearchEntry key={post.slug} post={post} />) : <div className="empty-state"><h3>No public research yet.</h3><p>Candidate work remains behind the review gate.</p></div>}
          </div>
        </section>

        <section className="method-shell" id="method">
          <div className="method-intro"><span>02 / METHOD</span><h2>Not a content machine.<br />An evidence pipeline.</h2></div>
          <ol className="method-list">
            <li><b>01</b><div><h3>Observe</h3><p>Public sources and engineering evidence enter as immutable, provenance-bearing artifacts.</p></div><span>Inputs remain recheckable</span></li>
            <li><b>02</b><div><h3>Synthesize</h3><p>Dreamer looks for mechanisms, contradictions, and decision boundaries—not summaries for their own sake.</p></div><span>Claims stay bounded</span></li>
            <li><b>03</b><div><h3>Challenge</h3><p>Independent review tests source fidelity, privacy, novelty, and whether conclusions outrun the evidence.</p></div><span>Rejection is evidence</span></li>
            <li><b>04</b><div><h3>Release</h3><p>Only exact, public-safe snapshots cross the publication boundary. The private Brain never serves the site.</p></div><span>Static and auditable</span></li>
          </ol>
        </section>

        <section className="manifesto-shell">
          <p>“The goal is not to sound certain. It is to make uncertainty inspectable.”</p>
          <span>KURULTAI RESEARCH PRINCIPLE 01</span>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

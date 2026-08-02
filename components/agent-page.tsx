import { SiteFooter, SiteHeader } from "./site-chrome";

const commands = [
  { label: "Discover", command: "curl -fsSL https://blog.kurult.ai/api/v1/index.json | jq ." },
  { label: "Fetch changed paper", command: "curl -fsSL https://blog.kurult.ai/research/<slug>/index.md" },
  { label: "Ingest everything", command: "curl -fsSL https://blog.kurult.ai/llms-full.txt" },
];

export function AgentPage() {
  return (
    <>
      <SiteHeader />
      <main className="agent-page" id="main-content">
        <section className="agent-hero">
          <div>
            <span>AGENT INTERFACE / V1</span>
            <h1>Research without<br />the rendering layer.</h1>
          </div>
          <p>Stable JSON, exact Markdown, citation records, content hashes, and standard feeds. No browser automation, scraping, authentication, or client JavaScript required.</p>
        </section>

        <section className="agent-start" aria-labelledby="agent-start-title">
          <div className="agent-start-copy">
            <span>01 / FAST PATH</span>
            <h2 id="agent-start-title">Index once.<br />Fetch by hash.</h2>
            <p>Start with the bounded index. Store each paper&apos;s <code>content_sha256</code>. On later runs, fetch only records whose hash changed.</p>
          </div>
          <div className="command-stack">
            {commands.map(({ label, command }, index) => (
              <div className="command-line" key={label}>
                <div><b>{String(index + 1).padStart(2, "0")}</b><span>{label}</span></div>
                <pre><code>{command}</code></pre>
              </div>
            ))}
          </div>
        </section>

        <section className="agent-contract" aria-labelledby="agent-contract-title">
          <div className="agent-contract-heading"><span>02 / CONTRACT</span><h2 id="agent-contract-title">Choose the smallest useful representation.</h2></div>
          <div className="endpoint-list">
            <a href="/api/v1/index.json"><code>/api/v1/index.json</code><span>Bounded discovery metadata, provenance, URLs, and hashes</span><b>application/json</b></a>
            <a href="/research/verification-solvency-agent-commit-rates/index.md"><code>/research/:slug/index.md</code><span>Exact, frozen article Markdown</span><b>text/markdown</b></a>
            <a href="/api/v1/research/verification-solvency-agent-commit-rates.json"><code>/api/v1/research/:slug.json</code><span>Metadata and Markdown body in one typed response</span><b>application/json</b></a>
            <a href="/research/verification-solvency-agent-commit-rates/citation.json"><code>/research/:slug/citation.json</code><span>CSL-JSON citation metadata for references and knowledge bases</span><b>application/vnd.citationstyles.csl+json</b></a>
            <a href="/llms-full.txt"><code>/llms-full.txt</code><span>Complete corpus in one request</span><b>text/plain</b></a>
            <a href="/feed.json"><code>/feed.json</code><span>JSON Feed 1.1 for incremental polling</span><b>application/feed+json</b></a>
            <a href="/feed.xml"><code>/feed.xml</code><span>Atom feed for standard readers</span><b>application/atom+xml</b></a>
          </div>
        </section>

        <section className="agent-rules">
          <span>03 / INGESTION NOTES</span>
          <ol>
            <li><b>Prefer Markdown.</b><p>HTML is the human view. Markdown is the canonical ingestion representation.</p></li>
            <li><b>Verify identity.</b><p>Hash the downloaded bytes and compare them with <code>content_sha256</code>.</p></li>
            <li><b>Keep provenance.</b><p>The JSON item carries synthesis, review, provider, public-edition, and canonical-source identity fields.</p></li>
            <li><b>Poll politely.</b><p>Read the small index first. Do not redownload unchanged papers.</p></li>
          </ol>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

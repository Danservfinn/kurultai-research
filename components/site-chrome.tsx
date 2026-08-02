export function Wordmark() {
  return (
    <a className="wordmark" href="/" aria-label="Kurultai Research home">
      <span className="wordmark-mark" aria-hidden="true"><i /><i /><i /></span>
      <span>KURULTAI</span>
      <span className="wordmark-section">RESEARCH</span>
    </a>
  );
}

export function SiteHeader() {
  return (
    <header className="site-header">
      <Wordmark />
      <nav aria-label="Primary navigation">
        <a href="/#research">Research</a>
        <a href="/#method">Method</a>
        <a href="/llms.txt">For agents</a>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <Wordmark />
      <p>Independent systems research from the Kurultai knowledge loop.</p>
      <div><span>Source-backed</span><span>Review-gated</span><span>Public-safe snapshots</span></div>
    </footer>
  );
}

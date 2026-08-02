export function SignalField() {
  return (
    <div className="signal-field" aria-label="A visual map of evidence moving through synthesis and review">
      <div className="signal-grid" aria-hidden="true" />
      <div className="orbit orbit-one" aria-hidden="true"><span /></div>
      <div className="orbit orbit-two" aria-hidden="true"><span /></div>
      <div className="orbit orbit-three" aria-hidden="true"><span /></div>
      <div className="signal-core"><b>01</b><span>Published synthesis</span></div>
      <span className="signal-label label-source">SOURCE</span>
      <span className="signal-label label-synthesis">SYNTHESIS</span>
      <span className="signal-label label-review">REVIEW</span>
      <span className="signal-label label-release">RELEASE</span>
    </div>
  );
}

// §9 Phase 0 — clearly labeled placeholder marker for sections whose real
// content is pending source facts from Peter. Never replaced by plausible
// filler; must be gone before the domain is pointed.
export function PendingMarker({ label = "CONTENT PENDING" }: { label?: string }) {
  return (
    <span className="inline-block border border-line px-1 py-0.5 font-mono text-data tracking-wider text-muted">
      [ {label} ]
    </span>
  );
}

// Mono section label in the §5.4 spirit — indexed like channels on a
// telemetry page. Accent is reserved for data/links, so the index sits in
// primary text and the label in secondary.
export function SectionHeader({
  index,
  label,
}: {
  index: string;
  label: string;
}) {
  return (
    <div className="mb-4 flex items-baseline gap-1 border-b border-line pb-1">
      <span className="font-mono text-data text-fg">{index}</span>
      <h2 className="font-mono text-data uppercase tracking-widest text-muted">
        {label}
      </h2>
    </div>
  );
}

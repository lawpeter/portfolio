export function GaugeLoader({ label = "Loading model" }: { label?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex h-full min-h-20 items-center justify-center"
    >
      <div className="w-32 font-mono text-data text-muted">
        <div className="mb-1 flex items-baseline justify-between gap-1">
          <span>{label.toUpperCase()}</span>
          <span className="text-accent-text">WAIT</span>
        </div>
        <div className="overflow-hidden border border-line p-0.5" aria-hidden="true">
          <span className="gauge-loader__needle block h-0.5 w-1/4 bg-accent" />
        </div>
      </div>
    </div>
  );
}

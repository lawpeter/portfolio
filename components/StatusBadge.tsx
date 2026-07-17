// Square-cornered mono readout badge (§5.6: data-readout badges use
// square/flat borders). The status string is data — it gets the accent.
export function StatusBadge({ status }: { status: string }) {
  return (
    <span className="inline-block border border-line px-1 py-0.5 font-mono text-data whitespace-nowrap text-accent-text">
      {status}
    </span>
  );
}

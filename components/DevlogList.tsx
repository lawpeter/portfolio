import Link from "next/link";
import type { DevlogEntry } from "@/lib/content";

function formatDate(d: Date): string {
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// Devlog entry rows (§3.4): mono date, title, project tag cross-linking to
// the tagged project's writeup.
export function DevlogList({ entries }: { entries: DevlogEntry[] }) {
  return (
    <ul className="divide-y divide-line border-y border-line">
      {entries.map((entry) => (
        <li
          key={entry.slug}
          className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 py-1"
        >
          <time
            dateTime={formatDate(entry.date)}
            className="font-mono text-data text-muted"
          >
            {formatDate(entry.date)}
          </time>
          <Link
            href={`/devlog/${entry.slug}`}
            className="underline underline-offset-2 hover:text-accent-text"
          >
            {entry.title}
          </Link>
          {entry.project && (
            <Link
              href={`/projects/${entry.project}`}
              className="ml-auto font-mono text-data uppercase text-muted hover:text-accent-text"
            >
              [{entry.project}]
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}

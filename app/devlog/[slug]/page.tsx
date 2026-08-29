import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDevlogEntries, getDevlogEntry, getProject } from "@/lib/content";
import { Prose } from "@/components/Prose";

function formatDate(d: Date): string {
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function generateStaticParams() {
  return getDevlogEntries().map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const entry = getDevlogEntry((await params).slug);
  if (!entry) return {};
  return { title: `${entry.title} | Devlog | Peter Law` };
}

// Individual devlog entry (§3.4) — cross-links back to its project.
export default async function DevlogEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const entry = getDevlogEntry((await params).slug);
  if (!entry) notFound();

  const project = getProject(entry.project);

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-2 py-8 sm:px-4">
      <nav className="flex flex-wrap gap-3 font-mono text-data">
        <Link
          href="/devlog"
          className="text-accent-text underline underline-offset-2 hover:text-accent"
        >
          ← DEVLOG
        </Link>
        {project && (
          <Link
            href={`/projects/${project.slug}`}
            className="text-accent-text underline underline-offset-2 hover:text-accent"
          >
            PROJECT: {project.title.toUpperCase()} →
          </Link>
        )}
      </nav>

      <header className="mt-4">
        <time
          dateTime={formatDate(entry.date)}
          className="font-mono text-data text-muted"
        >
          {formatDate(entry.date)}
        </time>
        <h1 className="mt-1 text-3xl font-medium">{entry.title}</h1>
      </header>

      <div className="mt-4">
        <Prose>{entry.body}</Prose>
      </div>
    </main>
  );
}

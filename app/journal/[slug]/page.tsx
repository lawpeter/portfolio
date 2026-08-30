import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Prose } from "@/components/Prose";
import { getJournalEntries, getJournalEntry } from "@/lib/content";

export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

function formatDate(date: Date): string {
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function generateStaticParams() {
  return getJournalEntries().map((entry) => ({ slug: entry.slug }));
}

// Unlinked and noindex is not privacy. Anyone with a URL can read a published
// page, and crawlers may ignore the directive. Never put sensitive material in
// this collection.
export default async function JournalEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const entry = getJournalEntry((await params).slug);
  if (!entry?.published) notFound();

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-2 py-8 sm:px-4">
      <header>
        <p className="font-mono text-data uppercase tracking-wide text-muted">
          Journal
        </p>
        <time
          dateTime={formatDate(entry.date)}
          className="mt-4 block font-mono text-data text-muted"
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

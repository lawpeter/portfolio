import type { Metadata } from "next";
import Link from "next/link";
import { getDevlogEntries } from "@/lib/content";
import { DevlogList } from "@/components/DevlogList";

export const metadata: Metadata = {
  title: "Devlog | Peter Law",
  description:
    "Reverse-chronological development log across Peter Law's projects.",
};

// Full devlog archive (§3.4); the main page shows only recent entries.
export default function DevlogArchive() {
  const entries = getDevlogEntries();

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-2 py-8 sm:px-4">
      <nav>
        <Link
          href="/"
          className="text-accent-text underline underline-offset-2 hover:text-accent"
        >
          Index
        </Link>
      </nav>
      <h1 className="mt-4 text-3xl font-medium">Devlog</h1>
      <p className="mt-1 font-mono text-data text-muted">
        {entries.length} {entries.length === 1 ? "ENTRY" : "ENTRIES"} /
        REVERSE-CHRONOLOGICAL
      </p>
      <div className="mt-4">
        <DevlogList entries={entries} />
      </div>
    </main>
  );
}

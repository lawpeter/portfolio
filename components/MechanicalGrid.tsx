import Image from "next/image";
import Link from "next/link";
import type { MechanicalEntry } from "@/lib/content";

export function MechanicalGrid({ entries }: { entries: MechanicalEntry[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {entries.map((entry) => (
        <article key={entry.slug} className="border border-line">
          <div
            className="relative w-full border-b border-line"
            style={{ aspectRatio: entry.image.aspect ?? "3 / 2" }}
          >
            <Image
              src={entry.image.src}
              alt={entry.image.caption}
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="p-2">
            <h3 className="text-xl font-medium">{entry.title}</h3>
            <p className="mt-1 leading-relaxed text-muted">
              {entry.description}
            </p>
            {(entry.software || entry.year) && (
              <p className="mt-1 font-mono text-data text-muted">
                {[entry.software, entry.year].filter(Boolean).join(" / ")}
              </p>
            )}
            {entry.projectSlug && (
              <p className="mt-1">
                <Link
                  href={`/projects/${entry.projectSlug}`}
                  className="text-accent-text underline underline-offset-2 hover:text-accent"
                >
                  Project
                </Link>
              </p>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

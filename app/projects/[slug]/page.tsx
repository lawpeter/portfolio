import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDevlogEntries, getProject, getProjects, projectPath } from "@/lib/content";
import { Prose } from "@/components/Prose";
import { StatusBadge } from "@/components/StatusBadge";
import { PendingMarker } from "@/components/PendingMarker";
import { DevlogList } from "@/components/DevlogList";
import { ModelViewer } from "@/components/ModelViewer";
import { PhotoFrame } from "@/components/PhotoFrame";

// Deep-dive writeup route (§3.5). Overview-depth content for Phase 0; the
// route and rendering pipeline are the final architecture.
export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  return {
    title: `${project.title} — Peter Law`,
    description: project.summary,
    alternates: { canonical: projectPath(project) },
    openGraph: { title: project.title, description: project.summary, url: projectPath(project) },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const project = getProject((await params).slug);
  if (!project) notFound();

  const relatedDevlog = getDevlogEntries().filter(
    (e) => e.project === project.slug,
  );

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-2 py-8 sm:px-4">
      <nav className="font-mono text-data">
        <Link
          href={`/#${project.slug}`}
          className="text-accent-text underline underline-offset-2 hover:text-accent"
        >
          ← INDEX
        </Link>
      </nav>

      <header className="mt-4 flex flex-wrap items-center justify-between gap-1">
        <h1 className="text-3xl font-medium">{project.title}</h1>
        <StatusBadge status={project.status} />
      </header>

      {project.repoUrl && (
        <p className="mt-1 font-mono text-data">
          <a
            href={project.repoUrl}
            className="text-accent-text underline underline-offset-2 hover:text-accent"
          >
            {project.sourceLabel} ↗
          </a>
        </p>
      )}

      {project.contentPending && (
        <p className="mt-3">
          <PendingMarker />
        </p>
      )}

      {project.modelPath && project.images[0] && (
        <figure className="mt-4">
          <div className="aspect-4/3 w-full border border-line">
            <ModelViewer modelPath={project.modelPath} fallbackSrc={project.images[0].src} fallbackAlt={project.images[0].caption} label={`${project.title.toUpperCase()} / DRAG TO ORBIT`} />
          </div>
          <figcaption className="mt-1 text-sm text-muted">{project.slug === "stair-robot" ? "Team CAD assembly. Most mechanical design and CAD by teammates; my work focused on software, electronics mounting, and integration." : "Enclosure / assembly in active iteration."}</figcaption>
        </figure>
      )}
      <div className="mt-4">
        <Prose>{project.body}</Prose>
      </div>

      {project.images.length > 0 && (
        <section aria-label="Photos" className="mt-6 max-w-reading space-y-3">
          {project.images.map((img, i) => (
            <PhotoFrame
              key={img.src}
              src={img.src}
              alt={img.caption}
              fig={String(i + 1).padStart(2, "0")}
              caption={img.caption}
              aspect={img.aspect}
            />
          ))}
        </section>
      )}

      {relatedDevlog.length > 0 && (
        <section aria-label="Related devlog entries" className="mt-8">
          <h2 className="mb-2 font-mono text-data uppercase tracking-widest text-muted">
            Devlog — {project.title}
          </h2>
          <DevlogList entries={relatedDevlog} />
        </section>
      )}
    </main>
  );
}

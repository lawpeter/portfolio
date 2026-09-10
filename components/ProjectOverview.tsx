import Link from "next/link";
import { projectPath, type Project } from "@/lib/content";
import { StatusBadge } from "./StatusBadge";
import { PendingMarker } from "./PendingMarker";

// Main-page overview card for a flagship project (§4: overview depth here,
// full writeup on its own route).
export function ProjectOverview({ project, compact = false }: { project: Project; compact?: boolean }) {
  return (
    <article id={project.slug} className="scroll-mt-4">
      <div className="flex flex-wrap items-center justify-between gap-1">
        <h3 className={`${compact ? "text-xl" : "text-2xl"} font-medium`}>{project.title}</h3>
        <StatusBadge status={project.status} />
      </div>
      <p className="mt-2 max-w-reading leading-relaxed text-fg">
        {project.summary}
      </p>
      {project.contentPending && (
        <p className="mt-2">
          <PendingMarker />
        </p>
      )}
      <p className="mt-2 flex flex-wrap gap-3 font-mono text-data">
        <Link
          className="text-accent-text underline underline-offset-2 hover:text-accent"
          href={projectPath(project)}
        >
          FULL WRITEUP →
        </Link>
        {project.repoUrl && (
          <a
            className="text-accent-text underline underline-offset-2 hover:text-accent"
            href={project.repoUrl}
          >
            {project.sourceLabel} ↗
          </a>
        )}
      </p>
    </article>
  );
}

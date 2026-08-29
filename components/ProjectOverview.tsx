import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/content";
import { StatusBadge } from "./StatusBadge";

export function ProjectOverview({ project }: { project: Project }) {
  const featured = project.prominence === "featured";
  const image = project.images[0];

  return (
    <article
      id={project.slug}
      className={
        featured
          ? "scroll-mt-16 border-y border-line py-2 sm:grid sm:grid-cols-[1.2fr_1fr] sm:gap-3"
          : "scroll-mt-16 border-b border-line pb-3"
      }
    >
      {featured && image && (
        <div className="relative mb-2 aspect-3/2 border border-line sm:mb-0">
          <Image
            src={image.src}
            alt={image.caption}
            fill
            sizes="(min-width: 640px) 55vw, 100vw"
            className="object-cover"
            priority
          />
        </div>
      )}
      <div className={featured ? "flex flex-col justify-center" : undefined}>
        <div className="flex flex-wrap items-center justify-between gap-1">
          <h3 className={featured ? "text-3xl font-medium" : "text-2xl font-medium"}>
            {project.title}
          </h3>
          {project.status && <StatusBadge status={project.status} />}
        </div>
        <p className="mt-2 max-w-reading leading-relaxed text-fg">
          {project.summary}
        </p>
        <p className="mt-2 flex flex-wrap gap-3">
          <Link
            className="text-accent-text underline underline-offset-2 hover:text-accent"
            href={`/projects/${project.slug}`}
          >
            Full writeup
          </Link>
          {project.repoUrl && (
            <a
              className="text-accent-text underline underline-offset-2 hover:text-accent"
              href={project.repoUrl}
            >
              Source
            </a>
          )}
        </p>
      </div>
    </article>
  );
}

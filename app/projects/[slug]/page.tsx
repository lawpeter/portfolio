import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDevlogEntries, getProject, getProjects } from "@/lib/content";
import { Prose } from "@/components/Prose";
import { StatusBadge } from "@/components/StatusBadge";
import { DevlogList } from "@/components/DevlogList";
import { PhotoFrame } from "@/components/PhotoFrame";
import { RobotWalkthrough } from "@/components/robot-walkthrough/RobotWalkthrough";
import { FluidSimPipeline } from "@/components/FluidSimPipeline";
import { ModelViewer } from "@/components/ModelViewer";

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
    title: `${project.title} | Peter Law`,
    description: project.summary,
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
  const hasRobotWalkthrough =
    project.slug === "stair-robot" && Boolean(project.modelPath);
  const hasKeyboardModel =
    project.slug === "keyboard" && Boolean(project.modelPath);
  const photosLead = project.slug === "cd-player";

  const projectPhotos = (
    <section aria-label="Photos" className="max-w-reading space-y-3">
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
  );

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-2 py-8 sm:px-4">
      <nav>
        <Link
          href={`/#${project.slug}`}
          className="text-accent-text underline underline-offset-2 hover:text-accent"
        >
          Index
        </Link>
      </nav>

      <header className="mt-4 flex flex-wrap items-center justify-between gap-1">
        <h1 className="text-3xl font-medium">{project.title}</h1>
        {project.status && <StatusBadge status={project.status} />}
      </header>

      {project.repoUrl && (
        <p className="mt-1">
          <a
            href={project.repoUrl}
            className="text-accent-text underline underline-offset-2 hover:text-accent"
          >
            Source
          </a>
        </p>
      )}

      {photosLead && project.images.length > 0 && (
        <div className="mt-4">{projectPhotos}</div>
      )}

      {hasKeyboardModel && project.modelPath && (
        <section
          aria-label="Interactive keyboard PCB model"
          className="mt-4 aspect-[8/5] max-w-reading border border-line"
        >
          <ModelViewer
            modelPath={project.modelPath}
            fallbackSrc={project.images[0]?.src}
            fallbackAlt="Interactive model of the custom keyboard PCB"
            label="DRAG TO ORBIT / KEYBOARD PCB"
          />
        </section>
      )}

      <div className={photosLead ? "mt-3" : "mt-4"}>
        {hasRobotWalkthrough && project.modelPath ? (
          <RobotWalkthrough body={project.body} modelPath={project.modelPath} />
        ) : (
          <>
            {project.slug === "fluidsim" && <FluidSimPipeline />}
            <Prose>{project.body}</Prose>
          </>
        )}
      </div>

      {!hasRobotWalkthrough && !photosLead && project.images.length > 0 && (
        <div className="mt-6">{projectPhotos}</div>
      )}

      {relatedDevlog.length > 0 && (
        <section aria-label="Related devlog entries" className="mt-8">
          <h2 className="mb-2 font-mono text-data uppercase tracking-wide text-muted">
            Devlog: {project.title}
          </h2>
          <DevlogList entries={relatedDevlog} />
        </section>
      )}
    </main>
  );
}

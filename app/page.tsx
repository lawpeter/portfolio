import { getDevlogEntries, getProjects } from "@/lib/content";
import { ProjectOverview } from "@/components/ProjectOverview";
import { SectionHeader } from "@/components/SectionHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { PendingMarker } from "@/components/PendingMarker";
import { DevlogList } from "@/components/DevlogList";
import Link from "next/link";

const EMAIL = "lawpeterp@gmail.com";
const GITHUB = "https://github.com/lawpeter";

// §4 section order: Hero → Sim wing → CAD wing → About → Side projects →
// Devlog → Contact/footer. Generous spacing BETWEEN sections, tight spacing
// inside data components (§5.4).
export default function Home() {
  const projects = getProjects();
  const simWing = projects.filter((p) => p.wing === "sim");
  const cadWing = projects.filter((p) => p.wing === "cad");
  const sideProjects = projects.filter((p) => p.tier === "side");
  const recentDevlog = getDevlogEntries().slice(0, 5);

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-2 py-8 sm:px-4">
      {/* Hero — deliberately restrained; hero polish is a later phase (§9) */}
      <header className="py-8">
        <p className="font-mono text-data text-muted">PETERLAW.DEV</p>
        <h1 className="mt-1 text-5xl font-medium">Peter Law</h1>
        <p className="mt-2 max-w-reading text-lg leading-relaxed text-muted">
          CS + Mechanical Engineering double major at UH Mānoa, aimed at
          guidance, navigation &amp; control and flight software.
        </p>
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 border-y border-line py-1 font-mono text-data">
          <span>
            <span className="text-muted">FOCUS </span>
            <span className="text-accent-text">GNC / FLIGHT SOFTWARE</span>
          </span>
          <span>
            <span className="text-muted">EDU </span>
            CS + ME, UH MĀNOA
          </span>
          <a
            href="#contact"
            className="text-accent-text underline underline-offset-2 hover:text-accent"
          >
            CONTACT ↓
          </a>
        </div>
      </header>

      <section aria-label="Simulation projects" className="py-6">
        <SectionHeader index="01" label="/ SIM WING" />
        <div className="space-y-6">
          {simWing.map((p) => (
            <ProjectOverview key={p.slug} project={p} />
          ))}
        </div>
      </section>

      <section aria-label="Hardware and CAD projects" className="py-6">
        <SectionHeader index="02" label="/ CAD WING" />
        <div className="space-y-6">
          {cadWing.map((p) => (
            <ProjectOverview key={p.slug} project={p} />
          ))}
        </div>
      </section>

      <section id="about" aria-label="About" className="py-6">
        <SectionHeader index="03" label="/ ABOUT" />
        <div className="max-w-reading space-y-2 leading-relaxed">
          <p>
            I&apos;m a computer science and mechanical engineering double major
            at the University of Hawaiʻi at Mānoa. The overlap is the point:
            the math behind an F1 car&apos;s traction control, a drone&apos;s
            EKF, and a spacecraft&apos;s attitude control is the same
            discipline at different scales, and that discipline — guidance,
            navigation &amp; control, and the flight software that runs it —
            is where I&apos;m headed.
          </p>
          <p>
            The color scheme on this site has an origin story: my first car
            was a 2010 BMW E60, and the graphite-and-orange palette here is
            lifted from its instrument-cluster illumination.
          </p>
          <p>
            Hobbies and the rest of the personal section:{" "}
            <PendingMarker label="CONTENT PENDING" />
          </p>
        </div>
      </section>

      <section aria-label="Side projects" className="py-6">
        <SectionHeader index="04" label="/ SIDE PROJECTS" />
        <div className="grid gap-2 sm:grid-cols-2">
          {sideProjects.map((p) => (
            <article
              key={p.slug}
              id={p.slug}
              className="border border-line p-2"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-1">
                <h3 className="text-lg font-medium">{p.title}</h3>
                <StatusBadge status={p.status} />
              </div>
              <p className="mt-1 text-muted">{p.summary}</p>
              <p className="mt-1">
                {p.contentPending ? (
                  <PendingMarker />
                ) : (
                  <Link
                    href={`/projects/${p.slug}`}
                    className="font-mono text-data text-accent-text underline underline-offset-2 hover:text-accent"
                  >
                    FULL WRITEUP →
                  </Link>
                )}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section aria-label="Devlog" className="py-6">
        <SectionHeader index="05" label="/ DEVLOG" />
        <DevlogList entries={recentDevlog} />
        <p className="mt-2">
          <Link
            href="/devlog"
            className="font-mono text-data text-accent-text underline underline-offset-2 hover:text-accent"
          >
            FULL ARCHIVE →
          </Link>
        </p>
      </section>

      <footer id="contact" className="py-6">
        <SectionHeader index="06" label="/ CONTACT" />
        <div className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-data">
          <a
            href={`mailto:${EMAIL}`}
            className="text-accent-text underline underline-offset-2 hover:text-accent"
          >
            EMAIL: {EMAIL}
          </a>
          <a
            href={GITHUB}
            className="text-accent-text underline underline-offset-2 hover:text-accent"
          >
            GITHUB ↗
          </a>
          <span className="text-muted">
            LINKEDIN <PendingMarker label="PENDING" />
          </span>
          <span className="text-muted">
            RESUME <PendingMarker label="PENDING" />
          </span>
        </div>
      </footer>
    </main>
  );
}

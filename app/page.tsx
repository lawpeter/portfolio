import { getDevlogEntries, getProjects } from "@/lib/content";
import { CadReveal } from "@/components/cad-reveal/CadReveal";
import { ProjectOverview } from "@/components/ProjectOverview";
import { SectionHeader } from "@/components/SectionHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { PendingMarker } from "@/components/PendingMarker";
import { DevlogList } from "@/components/DevlogList";
import Link from "next/link";

const EMAIL = "lawpeterp@gmail.com";
const GITHUB = "https://github.com/lawpeter";
const LINKEDIN = "https://www.linkedin.com/in/lawpeterp";

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
      {/* Hero — instrument-cluster density, everything functional: identity,
          targeting readout, full link set, and channel-list section nav */}
      <header className="flex min-h-[70vh] flex-col justify-center py-8">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <p className="font-mono text-data text-muted">PETERLAW.DEV</p>
          <div className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-data">
            <a
              href={GITHUB}
              className="text-accent-text underline underline-offset-2 hover:text-accent"
            >
              GITHUB ↗
            </a>
            <a
              href={LINKEDIN}
              className="text-accent-text underline underline-offset-2 hover:text-accent"
            >
              LINKEDIN ↗
            </a>
            <a
              href="/resume.pdf"
              download="Peter-Law-Resume.pdf"
              className="text-accent-text underline underline-offset-2 hover:text-accent"
            >
              RESUME ↓
            </a>
            <a
              href={`mailto:${EMAIL}`}
              className="text-accent-text underline underline-offset-2 hover:text-accent"
            >
              EMAIL
            </a>
          </div>
        </div>
        <h1 className="mt-4 text-6xl font-medium tracking-tight sm:text-7xl">
          Peter Law
        </h1>
        <p className="mt-3 max-w-reading text-lg leading-relaxed text-muted">
          CS + Mechanical Engineering double major at UH Mānoa, aimed at
          guidance, navigation &amp; control and flight software.
        </p>
        <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 font-mono text-data">
          <span>
            <span className="text-muted">FOCUS </span>
            <span className="text-accent-text">GNC / FLIGHT SOFTWARE</span>
          </span>
          <span>
            <span className="text-muted">EDU </span>
            CS + ME, UH MĀNOA
          </span>
        </div>
        <hr className="mt-4 border-accent" />
        <nav
          aria-label="Sections"
          className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-data"
        >
          {[
            ["01", "SIM WING", "#sim-wing"],
            ["02", "CAD WING", "#cad-wing"],
            ["03", "ABOUT", "#about"],
            ["04", "SIDE PROJECTS", "#side-projects"],
            ["05", "DEVLOG", "#devlog"],
            ["06", "CONTACT", "#contact"],
          ].map(([index, label, href]) => (
            <a
              key={href}
              href={href}
              className="group whitespace-nowrap text-muted hover:text-fg"
            >
              <span className="text-fg group-hover:text-accent-text">
                {index}
              </span>{" "}
              {label}
            </a>
          ))}
        </nav>
      </header>

      <section id="sim-wing" aria-label="Simulation projects" className="scroll-mt-4 py-6">
        <SectionHeader index="01" label="/ SIM WING" />
        <div className="space-y-6">
          {simWing.map((p) => (
            <ProjectOverview key={p.slug} project={p} />
          ))}
        </div>
      </section>

      <section id="cad-wing" aria-label="Hardware and CAD projects" className="scroll-mt-4 py-6">
        <SectionHeader index="02" label="/ CAD WING" />
        <div className="space-y-6">
          {cadWing.map((p) => (
            <div key={p.slug} className="space-y-4">
              {p.hasCADReveal && p.modelPath && (
                <CadReveal
                  modelPath={p.modelPath}
                  poster={p.images[0]?.src}
                  posterCaption={
                    p.images[0]?.caption ?? `${p.title} — CAD assembly`
                  }
                  title={p.title}
                />
              )}
              <ProjectOverview project={p} />
            </div>
          ))}
        </div>
      </section>

      <section id="about" aria-label="About" className="scroll-mt-4 py-6">
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
            Outside of engineering, most of it still somehow involves wheels
            or an engine: motorsport and vehicle dynamics are a long-running
            interest — it&apos;s basically why this site looks the way it does
            — and I hope to build an electric drift kart from a hoverboard hub
            motor and a salvaged battery pack. My first car was a 2010 BMW
            E60, which is where the graphite-and-orange color scheme actually
            comes from. I carspot when I&apos;m out and about, and winters are
            for snowboarding.
          </p>
          <p>
            I&apos;ll also chase an adventure on foot — a same-day summit of
            Mt. Fuji via the Yoshida Trail — or just wander: living in Tokyo
            this year turned into a deep dive on Japanese material culture,
            hunting down selvedge denim and JDM watches in Harajuku and
            Shimokitazawa.
          </p>
        </div>
      </section>

      <section id="side-projects" aria-label="Side projects" className="scroll-mt-4 py-6">
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

      <section id="devlog" aria-label="Devlog" className="scroll-mt-4 py-6">
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
          <a
            href={LINKEDIN}
            className="text-accent-text underline underline-offset-2 hover:text-accent"
          >
            LINKEDIN ↗
          </a>
          <a
            href="/resume.pdf"
            download="Peter-Law-Resume.pdf"
            className="text-accent-text underline underline-offset-2 hover:text-accent"
          >
            RESUME ↓
          </a>
        </div>
      </footer>
    </main>
  );
}

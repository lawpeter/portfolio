import type { ReactNode } from "react";
import Link from "next/link";
import { DevlogList } from "@/components/DevlogList";
import { MechanicalGrid } from "@/components/MechanicalGrid";
import { ProjectOverview } from "@/components/ProjectOverview";
import { SectionHeader } from "@/components/SectionHeader";
import { SiteHeader, EMAIL, GITHUB, LINKEDIN } from "@/components/SiteHeader";
import {
  getDevlogEntries,
  getMechanicalEntries,
  getProjects,
} from "@/lib/content";

type HomeSection = {
  id: string;
  label: string;
  ariaLabel: string;
  content: ReactNode;
};

export default function Home() {
  const projects = getProjects();
  const mechanicalEntries = getMechanicalEntries();
  const recentDevlog = getDevlogEntries().slice(0, 5);

  // Visibility, navigation, and numbering all derive from this one list.
  const sections: HomeSection[] = [
    {
      id: "projects",
      label: "Projects",
      ariaLabel: "Projects",
      content: (
        <div className="space-y-3">
          {projects.map((project) => (
            <ProjectOverview key={project.slug} project={project} />
          ))}
        </div>
      ),
    },
    ...(mechanicalEntries.length > 0
      ? [
          {
            id: "mechanical-design",
            label: "Mechanical Design",
            ariaLabel: "Mechanical design",
            content: <MechanicalGrid entries={mechanicalEntries} />,
          },
        ]
      : []),
    {
      id: "about",
      label: "About",
      ariaLabel: "About",
      content: (
        <div className="max-w-reading space-y-2 leading-relaxed">
          <p>
            I&apos;m pursuing bachelor&apos;s degrees in mechanical engineering and
            computer science at the University of Hawaiʻi at Mānoa. As far as
            my advisors and I know, I&apos;m the first student at UH to combine
            them as a double major. I chose both because I like working where
            physical systems, electronics, and software meet.
          </p>
          <p>
            I&apos;m interested in robotics, embedded systems, simulation, and
            mechanical design. On team projects, I&apos;m most useful at the
            boundaries between disciplines: writing software, integrating
            electronics, helping with fabrication, and keeping the pieces
            working together.
          </p>
          <p>
            My first car was a 2010 BMW E60. Its graphite interior and orange
            instrument lighting are the reason this site looks the way it does.
          </p>
          <p>
            Outside of engineering, most of it still somehow involves wheels
            or an engine: motorsport and vehicle dynamics are a long-running
            interest, and I hope to build an electric drift kart from a
            hoverboard hub motor and a salvaged battery pack. I carspot when
            I&apos;m out and about, and winters are for snowboarding.
          </p>
          <p>
            I&apos;ll also chase an adventure on foot, including a same-day summit
            of Mt. Fuji via the Yoshida Trail, or just wander. I spent Spring
            2026 studying in Tokyo, which turned into a deep dive on Japanese
            material culture, hunting down selvedge denim and JDM watches in
            Harajuku and Shimokitazawa.
          </p>
        </div>
      ),
    },
    ...(recentDevlog.length > 0
      ? [
          {
            id: "devlog",
            label: "Devlog",
            ariaLabel: "Devlog",
            content: (
              <>
                <DevlogList entries={recentDevlog} />
                <p className="mt-2">
                  <Link
                    href="/devlog"
                    className="text-accent-text underline underline-offset-2 hover:text-accent"
                  >
                    Full archive
                  </Link>
                </p>
              </>
            ),
          },
        ]
      : []),
    {
      id: "contact",
      label: "Contact",
      ariaLabel: "Contact",
      content: (
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          <a
            href={`mailto:${EMAIL}`}
            className="text-accent-text underline underline-offset-2 hover:text-accent"
          >
            Email: {EMAIL}
          </a>
          <a href={GITHUB} className="text-accent-text underline underline-offset-2 hover:text-accent">
            GitHub
          </a>
          <a href={LINKEDIN} className="text-accent-text underline underline-offset-2 hover:text-accent">
            LinkedIn
          </a>
          <a
            href="/resume.pdf"
            download="Peter-Law-Resume.pdf"
            className="text-accent-text underline underline-offset-2 hover:text-accent"
          >
            Résumé ↓
          </a>
        </div>
      ),
    },
  ];

  const navigation = sections.map(({ id, label }, index) => ({
    id,
    label,
    index: String(index + 1).padStart(2, "0"),
  }));

  return (
    <>
      <SiteHeader sections={navigation} />
      <main className="mx-auto w-full max-w-4xl flex-1 px-2 sm:px-4">
        <section
          aria-labelledby="home-title"
          className="flex min-h-[70vh] flex-col justify-center py-8"
        >
          <h1 id="home-title" className="text-6xl font-medium tracking-tight sm:text-7xl">
            Peter Law
          </h1>
          <p className="mt-3 max-w-reading text-lg leading-relaxed text-muted">
            Mechanical Engineering + Computer Science at UH Mānoa. Spring 2028.
          </p>
          <div className="mt-4 font-mono text-data">
            <span className="text-muted">EDU </span>
            CS + ME, UH MĀNOA
          </div>
          <hr className="mt-4 border-accent" />
        </section>

        {sections.map((section, index) => (
          <section
            key={section.id}
            id={section.id}
            aria-label={section.ariaLabel}
            className="scroll-mt-16 py-6"
          >
            <SectionHeader
              index={String(index + 1).padStart(2, "0")}
              label={`/ ${section.label}`}
            />
            {section.content}
          </section>
        ))}
      </main>
      <footer className="mx-auto w-full max-w-4xl border-t border-line px-2 py-2 font-mono text-data text-muted sm:px-4">
        PETERLAW.DEV / HONOLULU, HAWAIʻI
      </footer>
    </>
  );
}

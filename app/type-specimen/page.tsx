import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";

const plexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  weight: ["400", "500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IBM Plex Sans Type Specimen | Peter Law",
  robots: { index: false, follow: false },
};

export default function TypeSpecimenPage() {
  return (
    <main
      className={`${plexSans.variable} min-h-screen bg-graphite px-2 py-4 text-fg sm:px-4`}
      style={{ fontFamily: "var(--font-ibm-plex-sans), system-ui, sans-serif" }}
    >
      <div className="mx-auto max-w-4xl">
        <header className="border-y border-line py-1 font-mono text-data text-muted">
          TYPE SPECIMEN / CANDIDATE 01 / IBM PLEX SANS + IBM PLEX MONO
        </header>

        <section className="border-b border-line py-6">
          <p className="font-mono text-data text-muted">DISPLAY / HERO</p>
          <h1 className="mt-2 text-6xl font-medium tracking-tight sm:text-7xl">
            Peter Law
          </h1>
          <p className="mt-2 text-lg text-muted">
            Mechanical Engineering + Computer Science at UH Mānoa. Spring 2028.
          </p>
        </section>

        <section className="grid gap-4 border-b border-line py-4 md:grid-cols-[1.25fr_1fr]">
          <div>
            <p className="font-mono text-data text-muted">RUNNING TEXT / ABOUT</p>
            <p className="mt-2 max-w-reading leading-relaxed">
              I&apos;m pursuing bachelor&apos;s degrees in mechanical engineering and
              computer science at the University of Hawaiʻi at Mānoa. As far as
              my advisors and I know, I&apos;m the first student at UH to combine
              them as a double major. I chose both because I like working where
              physical systems, electronics, and software meet. On team
              projects, I&apos;m most useful at the boundaries between disciplines:
              writing software, integrating electronics, helping with
              fabrication, and keeping the pieces working together.
            </p>
          </div>
          <div className="space-y-3">
            <div>
              <p className="font-mono text-data text-muted">PROJECT TITLE</p>
              <h2 className="mt-1 text-3xl font-medium">Stair-Climbing Robot</h2>
            </div>
            <div>
              <p className="font-mono text-data text-muted">SECTION NAVIGATION</p>
              <nav className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm">
                <a href="#projects" className="underline underline-offset-2">01 Projects</a>
                <a href="#about" className="underline underline-offset-2">02 About</a>
                <a href="#contact" className="underline underline-offset-2">03 Contact</a>
              </nav>
            </div>
            <div>
              <p className="font-mono text-data text-muted">INSTRUMENT LABEL</p>
              <span className="mt-1 inline-block border border-line px-1 py-0.5 font-mono text-data text-accent-text">
                COMPLETE
              </span>
            </div>
          </div>
        </section>

        <section className="py-4">
          <p className="font-mono text-data text-muted">FIGURE CAPTION</p>
          <figure className="mt-2 max-w-reading border border-line">
            {/* A plain image keeps browser full-page specimen captures stable. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/photos/stair-robot/stairmaster-side.jpg"
              alt="STAIRMASTER competition robot"
              className="aspect-3/2 w-full object-cover"
            />
            <figcaption className="border-t border-line px-1 py-0.5 font-mono text-data text-muted">
              <span className="text-fg">FIG 01</span> — STAIRMASTER competition robot
            </figcaption>
          </figure>
        </section>
      </div>
    </main>
  );
}

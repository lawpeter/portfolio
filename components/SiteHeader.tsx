export const EMAIL = "lawpeterp@gmail.com";
export const GITHUB = "https://github.com/lawpeter";
export const LINKEDIN = "https://www.linkedin.com/in/lawpeterp";

type SectionLink = {
  id: string;
  index: string;
  label: string;
};

export function SiteHeader({ sections }: { sections: SectionLink[] }) {
  return (
    <header className="border-y border-line bg-graphite">
      <div className="mx-auto w-full max-w-4xl px-2 sm:px-4">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 py-1 font-mono text-data">
          <Link href="/" className="text-fg hover:text-accent-text">
            PETERLAW.DEV
          </Link>
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            <a href={GITHUB} className="text-accent-text underline underline-offset-2 hover:text-accent">
              GITHUB ↗
            </a>
            <a href={LINKEDIN} className="text-accent-text underline underline-offset-2 hover:text-accent">
              LINKEDIN ↗
            </a>
            <a
              href="/resume.pdf"
              download="Peter-Law-Resume.pdf"
              className="text-accent-text underline underline-offset-2 hover:text-accent"
            >
              RESUME ↓
            </a>
            <a href="#contact" className="text-accent-text underline underline-offset-2 hover:text-accent">
              CONTACT
            </a>
          </div>
        </div>
        <nav
          aria-label="Sections"
          className="flex flex-wrap gap-x-4 gap-y-1 border-t border-line py-1 font-mono text-data"
        >
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="group whitespace-nowrap text-muted hover:text-fg"
            >
              <span className="text-fg group-hover:text-accent-text">
                {section.index}
              </span>{" "}
              {section.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
import Link from "next/link";

import Link from "next/link";
import { ModelViewer } from "@/components/ModelViewer";
import { getProjects, projectPath } from "@/lib/content";
import { ProjectOverview } from "@/components/ProjectOverview";
import { SectionHeader } from "@/components/SectionHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { PhotoFrame } from "@/components/PhotoFrame";

const links = [["GITHUB ↗", "https://github.com/lawpeter"], ["LINKEDIN ↗", "https://www.linkedin.com/in/lawpeterp"], ["EMAIL", "mailto:lawpeterp@gmail.com"]];
const sections = [["01", "SELECTED PROJECTS", "selected-projects"], ["02", "ADDITIONAL / EARLIER WORK", "earlier-work"], ["03", "MECHANICAL DESIGN + FABRICATION", "mechanical-design"], ["04", "HOBBY BUILDS", "hobby-builds"], ["05", "ABOUT", "about"], ["06", "CONTACT", "contact"]];
const linkStyle = "text-accent-text underline underline-offset-2 hover:text-accent";

export default function Home() {
  const projects = getProjects();
  const mechanical = projects.filter(p => p.mechanical).sort((a,b) => a.mechanical!.order - b.mechanical!.order);
  return (
    <main id="main-content" className="mx-auto w-full max-w-4xl flex-1 px-2 py-8 sm:px-4">
      <header className="flex min-h-[60vh] flex-col justify-center py-8">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="font-mono text-data text-muted">PETERLAW.DEV</p>
          <div className="flex flex-wrap gap-3 font-mono text-data">{links.map(([label,href]) => <a key={href} href={href} className={linkStyle}>{label}</a>)}</div>
        </div>
        <h1 className="mt-4 text-6xl font-medium tracking-tight sm:text-7xl">Peter Law</h1>
        <p className="mt-3 max-w-reading text-lg leading-relaxed text-muted">Mechanical Engineering + Computer Science at UH Mānoa. I work on projects connecting software, electronics, and physical systems.</p>
        <p className="mt-4 font-mono text-data text-accent-text">SIMULATION / EMBEDDED SYSTEMS / INTEGRATION</p>
        <hr className="mt-4 border-accent" />
        <nav aria-label="Sections" className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-data">
          {sections.map(([index,label,id]) => <a key={id} href={`#${id}`} className="text-muted hover:text-fg"><span className="text-fg">{index}</span> {label}</a>)}
        </nav>
      </header>
      <section id="selected-projects" aria-label="Selected Projects" className="scroll-mt-4 py-6">
        <SectionHeader index="01" label="/ SELECTED PROJECTS" />
        <div className="space-y-6">{projects.filter(p => p.collection === "selected").map(p => <ProjectOverview key={p.slug} project={p} />)}</div>
      </section>
      <section id="earlier-work" aria-label="Additional / Earlier Work" className="scroll-mt-4 py-6">
        <SectionHeader index="02" label="/ ADDITIONAL / EARLIER WORK" />
        {projects.filter(p => p.collection === "earlier").map(p => <ProjectOverview key={p.slug} project={p} compact />)}
      </section>
      <section id="mechanical-design" aria-label="Mechanical Design + Fabrication" className="scroll-mt-4 py-6">
        <SectionHeader index="03" label="/ MECHANICAL DESIGN + FABRICATION" />
        <div className="space-y-4">{mechanical.map(p => {
          const facet = p.mechanical!;
          const img = facet.imageIndex === undefined ? undefined : p.images[facet.imageIndex];
          return <article key={p.slug} className="border border-line p-2 sm:p-3">
            <div className="flex flex-wrap items-baseline justify-between gap-1"><h3 className="text-xl font-medium">{facet.title}</h3><StatusBadge status={p.status} /></div>
            <p className="mt-2 max-w-reading leading-relaxed text-muted">{facet.summary}</p>
            {img && <div className="mt-2">{facet.modelPath ? <figure><div className="aspect-12/7 border border-line"><ModelViewer modelPath={facet.modelPath} fallbackSrc={img.src} fallbackAlt={img.caption} label="ELECTRONICS MOUNT / DRAG TO ORBIT" /></div><figcaption className="mt-1 text-sm text-muted">{img.caption}</figcaption></figure> : <PhotoFrame src={img.src} alt={img.caption} caption={img.caption} aspect={img.aspect} fig="01" />}</div>}
            <Link href={projectPath(p)} className={`mt-2 inline-block font-mono text-data ${linkStyle}`}>{p.title} →</Link>
          </article>;
        })}</div>
      </section>
      <section id="hobby-builds" aria-label="Hobby Builds" className="scroll-mt-4 py-6">
        <SectionHeader index="04" label="/ HOBBY BUILDS" />
        {projects.filter(p => p.collection === "hobby").map(p => <div key={p.slug} className="max-w-reading space-y-3">{p.images[0] && <PhotoFrame src={p.images[0].src} alt={p.images[0].caption} caption={p.images[0].caption} fig="01" />}<ProjectOverview project={p} compact /></div>)}
      </section>
      <section id="about" aria-label="About" className="scroll-mt-4 py-6">
        <SectionHeader index="05" label="/ ABOUT" />
        <div className="max-w-reading space-y-2 leading-relaxed">
          <p>I&apos;m a Mechanical Engineering and Computer Science student at the University of Hawaiʻi at Mānoa. I enjoy hands-on building and working through problems with other people. On teams, I often work across software, electronics, and integration.</p>
          <p>Outside engineering, I follow motorsport and enjoy vehicles, snowboarding, hiking, video games, and time with friends. My first car was a 2010 BMW E60; its graphite-and-orange dashboard inspired this site.</p>
        </div>
        <Link href="/devlog" className={`mt-3 inline-block font-mono text-data ${linkStyle}`}>DEVELOPMENT NOTES →</Link>
      </section>
      <footer id="contact" className="py-6">
        <SectionHeader index="06" label="/ CONTACT" />
        <div className="flex flex-wrap gap-3 font-mono text-data">{links.map(([label,href]) => <a key={href} href={href} className={linkStyle}>{label === "EMAIL" ? "EMAIL: lawpeterp@gmail.com" : label}</a>)}</div>
      </footer>
    </main>
  );
}

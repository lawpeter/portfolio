import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

/* Frontmatter is validated so malformed content fails the build with the
 * offending filename. Published gates are applied before public listings or
 * prerender params are produced; dynamic routes also check the raw entry. */

const CONTENT_ROOT = path.join(process.cwd(), "content");

export const projectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  summary: z.string().min(1),
  status: z.enum(["complete", "ongoing"]).optional(),
  prominence: z.enum(["featured", "standard"]).default("standard"),
  repoUrl: z.string().url().optional(),
  modelPath: z.string().optional(),
  images: z
    .array(
      z.object({
        src: z.string(),
        caption: z.string(),
        // CSS aspect-ratio override for wide renders/diagrams; photos
        // default to the standard 3:2 frame
        aspect: z.string().optional(),
      }),
    )
    .default([]),
  order: z.number().int(),
});

export const devlogSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  date: z.coerce.date(),
  project: z.string().min(1).optional(),
  published: z.boolean().default(false),
});

export const mechanicalSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  image: z.object({
    src: z.string().min(1),
    caption: z.string().min(1),
    aspect: z.string().optional(),
  }),
  description: z.string().min(1),
  software: z.string().min(1).optional(),
  year: z.union([z.string().min(1), z.number().int()]).optional(),
  projectSlug: z.string().min(1).optional(),
  order: z.number().int(),
});

export const journalSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  date: z.coerce.date(),
  published: z.boolean().default(false),
});

export type ProjectMeta = z.infer<typeof projectSchema>;
export type DevlogMeta = z.infer<typeof devlogSchema>;
export type MechanicalMeta = z.infer<typeof mechanicalSchema>;
export type JournalMeta = z.infer<typeof journalSchema>;
export type Project = ProjectMeta & { body: string };
export type DevlogEntry = DevlogMeta & { body: string };
export type MechanicalEntry = MechanicalMeta & { body: string };
export type JournalEntry = JournalMeta & { body: string };

function loadCollection<S extends z.ZodTypeAny>(
  dir: string,
  schema: S,
): Array<z.infer<S> & { body: string }> {
  const abs = path.join(CONTENT_ROOT, dir);
  // An empty collection is a legitimate state: the devlog ships with no
  // published posts and the journal starts empty. Git does not track empty
  // directories, so a clean clone may not have the folder at all. Missing is
  // not an error; malformed content below still fails the build loudly.
  if (!fs.existsSync(abs)) return [];
  const files = fs
    .readdirSync(abs)
    .filter((f) => f.endsWith(".md"))
    .sort();

  return files.map((file) => {
    const raw = fs.readFileSync(path.join(abs, file), "utf8");
    const { data, content } = matter(raw);
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      throw new Error(
        `Malformed frontmatter in content/${dir}/${file}:\n${z.prettifyError(parsed.error)}`,
      );
    }
    const meta = parsed.data as z.infer<S> & { slug: string };
    const expectedSlug = file.replace(/\.md$/, "");
    if (meta.slug !== expectedSlug) {
      throw new Error(
        `Slug mismatch in content/${dir}/${file}: frontmatter slug "${meta.slug}" must match filename "${expectedSlug}"`,
      );
    }
    return { ...meta, body: content.trim() };
  });
}

export function getProjects(): Project[] {
  return loadCollection("projects", projectSchema).sort(
    (a, b) => a.order - b.order,
  );
}

export function getProject(slug: string): Project | undefined {
  return getProjects().find((p) => p.slug === slug);
}

export function getDevlogEntries(): DevlogEntry[] {
  const entries = loadCollection("devlog", devlogSchema).filter(
    (entry) => entry.published,
  );
  const projectSlugs = new Set(getProjects().map((p) => p.slug));
  for (const entry of entries) {
    if (entry.project && !projectSlugs.has(entry.project)) {
      throw new Error(
        `Devlog entry content/devlog/${entry.slug}.md is tagged to unknown project "${entry.project}"`,
      );
    }
  }
  // reverse-chronological (§3.4)
  return entries.sort((a, b) => b.date.getTime() - a.date.getTime());
}

export function getDevlogEntry(slug: string): DevlogEntry | undefined {
  return loadCollection("devlog", devlogSchema).find((e) => e.slug === slug);
}

export function getMechanicalEntries(): MechanicalEntry[] {
  return loadCollection("mechanical", mechanicalSchema).sort(
    (a, b) => a.order - b.order,
  );
}

export function getJournalEntries(): JournalEntry[] {
  return loadCollection("journal", journalSchema)
    .filter((entry) => entry.published)
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}

export function getJournalEntry(slug: string): JournalEntry | undefined {
  return loadCollection("journal", journalSchema).find((e) => e.slug === slug);
}

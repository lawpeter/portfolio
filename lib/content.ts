import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

/*
 * Content loader — tier-1 markdown collections (PRD §8).
 * Frontmatter is Zod-validated so a malformed entry fails the build loudly
 * (§7), with the offending file named in the error.
 *
 * The project schema deliberately carries the FULL feature set from Phase 0
 * (§7 critical requirement): hasInteractiveDemo, hasCADReveal, asset paths,
 * images — mostly false/absent today. Turning a feature on later is a content
 * edit plus component work, never a page-structure rework.
 */

const CONTENT_ROOT = path.join(process.cwd(), "content");

export const projectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  collection: z.enum(["selected", "earlier", "hobby"]),
  summary: z.string().min(1),
  status: z.enum(["COMPLETE", "ONGOING", "SHELVED"]),
  sourceLabel: z.string().default("Source"),
  mechanical: z.object({
    title: z.string(),
    summary: z.string(),
    order: z.number().int(),
    modelPath: z.string().optional(),
    imageIndex: z.number().int().nonnegative().optional(),
  }).optional(),
  repoUrl: z.string().url().optional(),
  // §6 features — schema anticipates them from Phase 0
  hasInteractiveDemo: z.boolean().default(false),
  hasCADReveal: z.boolean().default(false),
  modelPath: z.string().optional(), // GLB under /public/models/<project>/
  wasmPath: z.string().optional(), // WASM under /public/wasm/<project>/
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
  // main-page ordering within a wing/tier group (ascending)
  order: z.number().int(),
  // true → section renders the mono [CONTENT PENDING] marker (§9); the body
  // below it is outline/notes, never plausible-sounding description
  contentPending: z.boolean().default(false),
});

export const devlogSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  date: z.coerce.date(),
  // must reference an existing project slug — validated in getDevlogEntries
  project: z.string().min(1),
});

export type ProjectMeta = z.infer<typeof projectSchema>;
export type DevlogMeta = z.infer<typeof devlogSchema>;
export type Project = ProjectMeta & { body: string };
export type DevlogEntry = DevlogMeta & { body: string };

function loadCollection<S extends z.ZodTypeAny>(
  dir: string,
  schema: S,
): Array<z.infer<S> & { body: string }> {
  const abs = path.join(CONTENT_ROOT, dir);
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
  const entries = loadCollection("devlog", devlogSchema);
  const projectSlugs = new Set(getProjects().map((p) => p.slug));
  for (const entry of entries) {
    if (!projectSlugs.has(entry.project)) {
      throw new Error(
        `Devlog entry content/devlog/${entry.slug}.md is tagged to unknown project "${entry.project}"`,
      );
    }
  }
  // reverse-chronological (§3.4)
  return entries.sort((a, b) => b.date.getTime() - a.date.getTime());
}

export function getDevlogEntry(slug: string): DevlogEntry | undefined {
  return getDevlogEntries().find((e) => e.slug === slug);
}

export function projectPath(project: Pick<ProjectMeta, "slug">): string {
  return `/projects/${project.slug}`;
}

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
  tier: z.enum(["flagship", "side"]),
  // §3.1 — which wing of the main page the project lives in. The quadrotor is
  // "sim" until a physical build exists; side projects use "none".
  wing: z.enum(["sim", "cad", "none"]),
  summary: z.string().min(1),
  // short mono status readout, e.g. "SIM-ONLY / 2D", "NOT IN ACTIVE DEV"
  status: z.string().min(1),
  repoUrl: z.string().url().optional(),
  // §6 features — schema anticipates them from Phase 0
  hasInteractiveDemo: z.boolean().default(false),
  hasCADReveal: z.boolean().default(false),
  modelPath: z.string().optional(), // GLB under /public/models/<project>/
  wasmPath: z.string().optional(), // WASM under /public/wasm/<project>/
  images: z
    .array(z.object({ src: z.string(), caption: z.string() }))
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

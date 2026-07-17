# Decision log — peterlaw.dev

Every choice not explicitly specified in `/docs/PRD.md` gets an entry here, with
justification, at the time it's made (PRD §10). Newest entries at the bottom.
Visual decisions also get a vibecoded-or-not assessment per PRD §5.6.

---

## 2026-07-17 — Phase 0 setup

### Styling: Tailwind CSS v4

The PRD leaves the styling approach open (CLAUDE.md flags it explicitly). Chosen: Tailwind CSS v4, CSS-first config.

- **Token enforcement**: the §5 palette/fonts/spacing are defined once in a `@theme` block, and the default Tailwind palette is *replaced*, not extended — utilities like `bg-purple-500` simply don't exist in this project. The §5.6 anti-vibecoding guardrails become structurally hard to violate in future sessions rather than convention-only.
- **Consistent with the PRD's framework reasoning** (§7 chose Next.js partly for AI-tooling support): utilities keep styling visible in-file, so future AI-assisted sessions see full styling context without hunting separate stylesheets, and there's no per-session drift in CSS methodology.
- Rejected: CSS Modules (zero-dep, but token discipline would be convention-only); CSS-in-JS (runtime cost, poor App Router/RSC fit).

### TypeScript

Schema validation is Phase 0's critical requirement (§7); static types plus Zod make malformed content fail loudly at build time. Also the create-next-app default — no friction.

### Markdown pipeline: hand-rolled loader (gray-matter + zod + react-markdown)

- `gray-matter` parses frontmatter, `zod` validates it (throws at build on malformed entries — tier-1 content edits fail loudly per §8), `react-markdown` renders bodies with custom renderers so images get the graphite-frame/FIG-caption treatment and tables get graphite borders + mono headers (§3.5) instead of browser defaults.
- Rejected: Contentlayer (unmaintained), MDX (tier-1 content must stay plain markdown Peter can edit without a build session — JSX in content would silently create tier-3 files).

### Analytics store: Neon Postgres

§7 requires a Vercel-marketplace store and defers the specific pick to this log. Page views are append-only timestamped rows and the future telemetry display (§6.3) wants time-series queries — native SQL territory. Upstash Redis would need bespoke data-structure design for the same queries. Mechanism: client beacon → `/api/telemetry` route handler → single-row insert. No-ops silently when `DATABASE_URL` is unset so the project builds/runs before Peter provisions the database.

### Package manager: npm

Default, zero-config on Vercel, no team workflow to optimize for.

### Deferred installs: icons, R3F

Lucide (icon library, §5.5) not installed until the first component actually needs an icon; React Three Fiber not installed — nothing in Phase 0 uses it (CLAUDE.md says install during Phase 0 only if genuinely required; it isn't).

### Boilerplate removal

create-next-app's demo SVGs and default favicon removed. Favicon deliberately absent: the themed favicon is an explicitly deferred micro-detail (§5.7), and shipping the Vercel default would misrepresent that decision as made.

### Known non-issue: npm audit moderate advisory

`npm audit` reports a moderate XSS advisory in the `postcss` copy bundled inside `next` itself. The suggested fix downgrades Next to 9.x — not a real option. Waiting on an upstream Next patch; revisit if it's still present at a later phase.

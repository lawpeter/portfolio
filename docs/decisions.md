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

## 2026-07-17 — Design system implementation

All §5 values (colors, fonts, spacing unit, reading column) are used verbatim from the PRD — not re-decided here. Entries below cover only what §5 leaves unspecified. Vibecoded-or-not assessments per §5.6 included.

### Derived neutral tones: `--color-line` (#2e2b27), `--color-panel` (#1c1a18)

§5 specifies background, two text tones, and the accent, but "thin graphite border" (§5.5) needs an actual border value visible on #141312, and code blocks/readout panels need a surface tone. Both derived from the background hue (warm, not blue-shifted), a few steps lighter — the same way MoTeC/dashboard UIs separate panels tonally. **Not vibecoded**: flat tonal steps of one neutral, no gradients/glass, exactly how real telemetry software builds surface hierarchy.

### Tailwind spacing base set to 8px (`--spacing: 8px`)

§5.4 mandates an 8px base unit; encoding it as the Tailwind spacing token means `p-1` = 8px and every spacing utility is grid-locked by construction. Note for future sessions: this intentionally differs from Tailwind's default 4px base — `p-0.5` (4px) exists for instrument-panel-density interiors.

### `--text-data` token (13px)

§5.3 sets a 13px minimum for mono data/label text; a named token (`text-data`) makes the floor the path of least resistance instead of a rule to remember. Default Tailwind text sizes remain for prose headings.

### Selection color: accent on graphite

Browser-default blue selection would introduce a second hue, which §5.2 forbids. Functional (marks user selection state), not decorative. **Not vibecoded**: single-hue, serves a real UI state.

### Prose link treatment: `#f15a2f` underlined

Links render as small text, so the small-text accent variant applies (§5.2). Underline kept — links must be identifiable without relying on color alone (WCAG). **Not vibecoded**: no hover animations, no arrow glyphs, just an underlined accent link.

### FIG captions: bar below the image, inside the border

§5.5 says "mono-font corner caption." Interpreted as a caption bar anchored to the frame's bottom edge (inside the graphite border) rather than text overlaid on the photo — overlays would fight §5.5's "no filter over real craftsmanship photos" spirit and hurt contrast on unknown imagery. Numbering auto-increments per prose block via CSS counter; `PhotoFrame` (non-markdown usage) takes an explicit FIG number. **Not vibecoded**: mirrors engineering-figure conventions in real documentation.

### Markdown images render as plain `<img>`, not `next/image`

`next/image` needs per-image dimension metadata, which would push image-bearing markdown out of content tier 1. Plain lazy-loaded `<img>` keeps tier 1 intact; photos are Peter's own static assets. `PhotoFrame` (used in code, tier 3) does use `next/image`. Lint rule disabled locally at that one line, with this rationale.

### Dependencies: react-markdown, remark-gfm, rehype-unwrap-images

react-markdown — render tier-1 markdown with per-element custom renderers (the §3.5 styling requirement). remark-gfm — GitHub-style tables, required by §3.5. rehype-unwrap-images — lifts images out of `<p>` so the `<figure>` treatment is valid HTML (React 19 hydration errors otherwise).

### Known non-issue: npm audit moderate advisory

`npm audit` reports a moderate XSS advisory in the `postcss` copy bundled inside `next` itself. The suggested fix downgrades Next to 9.x — not a real option. Waiting on an upstream Next patch; revisit if it's still present at a later phase.

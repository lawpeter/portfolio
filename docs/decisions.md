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

## 2026-07-17 — Content schema

### Schema conventions beyond §7's named fields

- **Frontmatter `slug` must equal the filename** — enforced by the loader. One canonical identity per entry; a renamed file with a stale slug fails the build instead of silently forking routes.
- **`wing: sim | cad | none`** encodes §3.1's placement rule as data (the quadrotor carries `sim` until a physical build exists); the main page groups by it rather than hardcoding which project sits where.
- **`status` is free text**, not an enum — it renders as a mono readout badge and Peter should be able to write "SIM-ONLY / 2D / IN DEV" without a schema change (tier-1 edit).
- **`contentPending` is schema, not prose** — the §9 requirement that placeholders be *clearly labeled* is enforced by structure: the flag drives the mono `[CONTENT PENDING]` marker in every rendering context.
- **Devlog→project references validated at load time** — an entry tagged to a nonexistent project slug fails the build (§3.4 cross-links must never dangle).

## 2026-07-17 — Phase 0 content

### Voice and sourcing

Project prose is first-person, technical, drafted strictly from the reference repos (FluidSim README; quadrotor DEVLOG + session notes) — no capabilities or details asserted that the repos don't show, including FluidSim's ~300k-particle instability and the quadrotor being sim-only. The seeded devlog entry adapts Peter's own 4/14 DEVLOG text (his existing habit, §3.4) rather than inventing a new entry. **All three await Peter's review before counting as done (§9 acceptance criteria).**

### Placeholder sections carry PRD-stated facts only

Stair robot / keyboard / CD player bodies state only what the PRD itself records (e.g. "2nd of 50+ UH ME teams", "ZMK-based") plus an explicit note of what's pending — never plausible-sounding filler (§9).

## 2026-07-17 — Analytics groundwork

### Client library: @neondatabase/serverless

The Neon-recommended driver for serverless/edge environments (HTTP-based, no connection pooling to manage in Vercel functions). One dependency, used in exactly one route handler.

### Beacon semantics

One `navigator.sendBeacon` per route view from a null-rendering client component in the root layout — fire-and-forget, survives navigation, no impact on rendering. Beacons fire in dev too (the endpoint no-ops without `DATABASE_URL`), which keeps the path testable locally rather than being prod-only dead code. Every failure mode returns 204 silently: analytics must never break or slow the site. Table DDL lives in `docs/telemetry.sql`; provisioning + running it is Peter's step alongside deployment.

## 2026-07-17 — Verification-pass fixes

### font-mono utility overridden to carry weight 500

The §10 visual check caught mono text computing `font-weight: 400`: next/font loads the 500 file but doesn't set the property, and browsers fall back to 400 (the single 500 face still matches, but nothing guaranteed it). A custom `@utility font-mono` now bundles `font-weight: 500` with the family, so §5.3's "500, not regular 400" is inseparable from using the font at all.

### FluidSim controls table added to content

No Phase 0 content exercised the §3.5 table pipeline, leaving it unverified. The FluidSim README's controls table is real repo-derived content and fills the gap — verified rendering with graphite borders and mono headers.

### outputFileTracingRoot pinned

A stray `package-lock.json` in Peter's home directory made Next infer `~` as the workspace root (wrong file tracing, warning on every start). Pinned to the project directory in `next.config.ts`.

## 2026-07-17 — Peter-supplied content & assets

### Stair-robot GLB: meshopt-compressed before entering the repo

Peter's raw Onshape export (`V5 Assembly.glb`) is 110 MB — over GitHub's 100 MB hard file limit (a push would be rejected) and unserviceable as a page asset. Compressed with `gltfpack -cc -kn` (quantization + meshopt, **-kn preserves the per-part node structure** §6.2 depends on): 110 MB → 7.4 MB, part separation verified intact via gltf-transform inspect before and after. Two consequences documented for the later CAD-reveal phase: the loader must wire up the meshopt decoder (drei's `useGLTF` supports this natively), and §6.2's "verify parts survived export" check is already done for this asset. Original export stays outside the repo (Peter's Downloads).

### Resume served verbatim at /public/resume.pdf

Peter's PDF, unmodified, linked with a `download` attribute naming it `Peter-Law-Resume.pdf`. Filename in-repo kept generic (`resume.pdf`) so future resume swaps are a tier-2 file drop with no code edit.

### contentPending flipped to false for robot / keyboard / CD player

Prose now drafted from facts Peter supplied directly in-session (ME213 team-of-six robot with BLE/PS2 controls; 2-key-gadget→full-keyboard arc with JLCPCB PCB, YUZUKeycaps, ZMK config repo; working Minecraft-Jukebox CD player with lasercut-housing/driver/bookshelf plans). Same review state as the repo-derived sections: real content, Peter polishes wording himself as tier-1 edits.

### Known non-issue: npm audit moderate advisory

`npm audit` reports a moderate XSS advisory in the `postcss` copy bundled inside `next` itself. The suggested fix downgrades Next to 9.x — not a real option. Waiting on an upstream Next patch; revisit if it's still present at a later phase.

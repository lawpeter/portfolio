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

## 2026-07-17 — Photos & About section

### Photo convention: /public/photos/<project>/, sips-optimized

Project photos live under `/public/photos/<project>/` (parallel to `/models/` and `/wasm/` — each asset type gets one root). Peter's camera originals (5712×4284, several MB) are resized to 1600px / JPEG q72 via macOS `sips` before entering the repo — originals stay outside git. A photo swap is tier-2: drop the file, update the `images[]` caption if needed.

### images[] rendered as stacked PhotoFrames on the deep-dive route

The schema's `images[]` field (waiting since Phase 0 day one) now renders: a single-column stack at reading width after the prose body, explicit FIG numbers in content order. **Vibecoded check:** photos sit in the §5.5 graphite frame with mono captions, unfiltered — the frame is the system, the pixels stay real. Portrait shots crop to the frame's 3:2 (`object-cover`); consistency of frame ratio is the §5.5 rule, and Peter curates/replaces photos later — logged as an accepted trade-off rather than letting frame ratios vary per photo.

### About section: hobbies foundation text from Peter, E60 paragraph folded in

Peter supplied the hobbies text directly (drift-kart plan, carspotting, snowboarding, Fuji/Yoshida, Tokyo year — selvedge denim and JDM watches). It contains the E60 color-scheme origin, so the previous standalone E60 paragraph was removed rather than telling the story twice. Used near-verbatim (§3.3 allows this section to read like a person talking); Peter polishes wording as tier-1 edits. This was the site's last `[CONTENT PENDING]` marker.

## 2026-07-17 — Photo sweep, keyboard folder, PCB model

### raw-assets/ (gitignored) for Peter's unprocessed originals

Peter drops camera originals into `public/photos/` root; anything there would deploy verbatim (6MB JPEGs, a 25MB video). Processed 1600px copies go into `public/photos/<project>/`; the originals move to gitignored `/raw-assets/` instead of being deleted — they're Peter's files, and the video (robot run footage, 113s) has no rendering surface yet (`images[]` is images-only; a video slot is a future decision, possibly alongside the §9-backlog photogrammetry question, which wants dynamic-vs-static footage assessed anyway).

### Near-duplicate photo skipped

Two CD-player mechanism shots differ only in lighting/angle; the earlier one is already placed. The alternate sits in `raw-assets/` if Peter prefers it during his polish pass.

### Keyboard PCB model exported from KiCad source, not the 124MB STL

Peter's folder offers `model.stl` (124 MB, single fused mesh, no materials) and the KiCad PCB source. Chose `kicad-cli pcb export glb --subst-models --include-tracks --include-zones` (KiCad is installed): a real board model with per-component nodes and materials, 18 MB raw → 1.1 MB after `gltfpack -cc -kn`. Stored at `/public/models/keyboard/keyboard-pcb.glb` for a later interactive phase; nothing renders it yet (schema `modelPath` populated, `hasCADReveal` stays false).

### Keyboard content facts sourced from the project folder

BOM.csv (68× SOD-123 diodes, MCP23017), keyboard-layout.json (68-key 5×14, split space), and ZMK_Firmware_PRD.md (nice!nano v2/nRF52840, nice!view display, EC11 encoder, BLE profiles, ZMK Studio, WPM widget) — all stated in the section are verifiable from those files. Diode *placement* deliberately not attributed to hand-soldering (Peter confirmed soldering switches, not diodes).

## 2026-07-17 — CAD scroll-reveal (§6.2)

### Dependencies: three, @react-three/fiber, @react-three/drei

The §7-specified interactive layer, installed at first need per CLAUDE.md. drei's `useGLTF` wires the meshopt decoder locally (no CDN — works offline) for our gltfpack-compressed GLBs.

### (Backfill) PhotoFrame optional `aspect` override

Landed with the keycap-render commit without its log entry: `images[]` and PhotoFrame accept a CSS aspect-ratio override so wide renders/diagrams (keycap set, 2.65:1) aren't destroyed by the 3:2 photo crop. Photos keep the standard frame; the §5.5 consistency rule bends only for non-photo artwork.

### Scroll mechanism: native scroll + sticky pin

300vh wrapper, `sticky top-0` stage, progress derived from the wrapper rect into a ref (no per-frame React state; subscribers get callbacks). drei `ScrollControls` rejected — it owns its own scroll container and breaks the single-page native scroll model (§4). No scroll hijacking anywhere.

### Explosion: computed radial per part, scalar checkpoints

~2300 mesh parts make hand-authored per-part transforms unworkable. Directions computed at load (part center − assembly centroid, expressed in parent space so gltfpack quantization-scale nodes don't distort it); outer parts travel further. The authored config (`components/cad-reveal/checkpoints.ts`) is scalars only — t / rotationY / explode / label — the PRD's middle tier. Motion damped (`MathUtils.damp`) so scroll jitter reads as physical settling.

### Labels anchored to named nodes, not authored coordinates

Onshape part names survive gltfpack `-kn`; labels resolve their anchor by name pattern at load and ride the part through explosion (portal into the node). Two gotchas discovered and handled: three's GLTFLoader sanitizes names (spaces → underscores) — matching normalizes whitespace/underscores away; and the first name match can be an empty transform leaf — resolution takes the first match with real geometry. Label = accent mono chip + hairline leader (§5.2: accent marks data; the model keeps its real CAD colors).

### Fallback policy: poster below 1024px and for prefers-reduced-motion

Server render and non-desktop/reduced-motion clients get the FIG 00 photo in a standard frame — mobile islands are an explicitly later phase (§4); nothing may look broken meanwhile. Media queries via `useSyncExternalStore` (hydration-safe, live-reactive — verified by resizing across the breakpoint).

### Perf posture

`frameloop="demand"` + invalidate on scroll/while unsettled → zero idle GPU. Stage chunk + GLB behind `next/dynamic` and an IntersectionObserver gate (plus a scroll-progress fallback trigger — the observer alone proved flaky in testing). `preserveDrawingBuffer: true` kept on: it enables the §10 screenshot-verification pass, negligible cost at this scene size.

## 2026-07-17 — Hero polish

### Instrument-cluster hero: bigger identity, channel-list nav, full link row

- Name scaled to 6xl/7xl with a ~70vh hero — presence for the 30-second skim (§2) while the sim wing still peeks above the fold. **Not vibecoded**: type scale and whitespace only; no animation, no imagery, no gradient.
- **Channel-list section nav** (`01 SIM WING … 06 CONTACT`): mono anchor links styled like a telemetry channel selector. Functional navigation, not decoration — every entry jumps to a real section. Smooth scroll behind `prefers-reduced-motion: no-preference`.
- **Full link row in the hero** (GITHUB / LINKEDIN / RESUME ↓ / EMAIL): recruiters get every exit above the fold; the footer keeps the same set for end-of-scroll capture. Duplication is deliberate.
- **Accent hairline rule** under the readout strip: the §5.2 accent-as-border role, one per page. FOCUS readout keeps the accent-text value (it's the one piece of data the site exists to communicate). **Not vibecoded**: single hue, flat hairline, mirrors how MoTeC pages separate the header band from channels.

## 2026-07-17 — Side-projects gallery + PCB viewer

### ModelViewer: data-driven 3D thumb for any side project with a modelPath

Shared gate + canvas pair (same lazy pattern as the reveal). A side-project card whose content declares `modelPath` gets the orbit viewer; otherwise its first photo. No per-project component code — turning this on for a future model is a frontmatter edit.

### Viewer interaction: slow auto-rotate + drag orbit, zoom/pan disabled

Auto-rotate is motion with a job: a static render is indistinguishable from an image, and nobody drags an image — the rotation communicates "3D, touch me." Suppressed under `prefers-reduced-motion` (drag still works — user-initiated motion is fine). Zoom and pan disabled so the wheel never captures page scroll. Canvas unmounts when the card leaves the viewport (GLB stays cached); mobile/SSR render the photo fallback. **Vibecoded check:** motion is functional signaling, single slow axis, no easing theatrics; passes.

### Card media block: 8:5, top of card, hairline separator

Wider than the 3:2 photo frame — these are landscape thumbs above a text block, and 8:5 keeps two cards' media rows aligned at the grid gap without letterboxing the wide PCB. Square corners, border-line separator; the §5.5 FIG-caption treatment stays reserved for deep-dive figures (thumbs get the mono overlay label instead).

## 2026-07-17 — Mobile-lightweight pass (§9)

### Findings: structure already carries the reduced-island model

Surveyed 375px and 768px on every page. The §4/§9 "reduced interactive islands, same content" requirement is structural, not bolted on: below 1024px no three.js chunk and no GLB is ever fetched (verified via resource timing — zero .glb requests on mobile), islands render their photo fallbacks, all content identical. Layout survives both widths with no horizontal overflow; deep-dive tables scroll in their own container.

### Fix applied: `sizes` hints on all fill images

`next/image` fill defaults assume 100vw, so phones were offered desktop-sized variants (and desktop full-viewport ones). PhotoFrame now declares the reading-column cap (680px), card media and viewer fallbacks declare the grid split. Markdown `<img>` stays plain per the earlier tier-1 decision — 1600px q72 files are the accepted cost.

## 2026-07-17 — WASM interface spec (§6.1 prep)

### docs/wasm-interface.md: fixed methods + dynamic channel discovery

The Embind contract is specified ahead of any binary so Peter's compile has a target and the tier-2/tier-3 boundary is written down: `reset/step/time/channelNames/sample/interfaceVersion` never change shape; tracked quantities are discovered by name, so adding a channel in C++ needs no JS change (stays tier-2). Two honest calls surfaced for Peter: FluidSim's GLSL-compute physics can't compile to WASM (WebGL2 has no compute) — either a reduced-scale CPU port or quadrotor-first; and the demo UI is deliberately NOT built against mock data — nothing that looks like a live sim ships until a real binary exists (§9's no-plausible-filler rule applied to interactivity).

### Known non-issue: npm audit moderate advisory

`npm audit` reports a moderate XSS advisory in the `postcss` copy bundled inside `next` itself. The suggested fix downgrades Next to 9.x — not a real option. Waiting on an upstream Next patch; revisit if it's still present at a later phase.

## 2026-08-29 — Revision 4 refactor, Phases 1 through 2

### Analytics removed

The Neon route, beacon, SQL file, environment placeholder, and dependency were
removed together. `DATABASE_URL` was never provisioned, so no history existed
to preserve. Keeping dormant collection code would imply an active product
decision that no longer exists. This is not a visual decision.

### Project status is a lowercase enum

Project status is now optional and limited to `complete` or `ongoing`.
`StatusBadge` supplies uppercase presentation. This prevents roadmap phrases
from drifting into public status labels while keeping data independent of
display casing. This is structural rather than visual.

### Draft publication defaults closed

Devlog and journal `published` fields default to `false`. Listings and static
params include published entries only; route handlers inspect the raw entry and
return 404 for a direct unpublished slug. A content file cannot become public
just by appearing on disk. This is structural rather than visual.

### Speculative project fields removed

`wing`, `tier`, `hasInteractiveDemo`, `hasCADReveal`, `wasmPath`, and
`contentPending` were deleted. They described the superseded information
architecture or unused roadmap work. `prominence` replaces per-project homepage
special casing without implying leadership. This is structural rather than
visual.

### One renderable-section array owns homepage structure

Conditional Mechanical Design and Devlog sections, their nav links, and every
section number derive from one array. Empty sections consume neither markup nor
indices. This avoids separate UI representations drifting apart. **Not
vibecoded:** the numbered-channel treatment is functional navigation and its
state reflects real content availability.

### Header is a full-width instrument band

The primary links and numbered navigation moved out of the hero into a square,
hairline-separated top band. **Not vibecoded:** it uses existing palette tokens,
flat surfaces, and real navigation affordances. A floating rounded pill was
rejected because it conflicts with both the E60 instrument language and the
explicit square-border system.

### Featured treatment is data-driven

The stair robot receives a larger image-and-copy preview through
`prominence: featured`; standard projects remain simple bordered rows. **Not
vibecoded:** this creates an honest content hierarchy without a bento grid or
four decorative cards, and the data field is named for visual prominence rather
than project leadership.

### Homepage CAD walkthrough removed

The 300vh reveal no longer mounts on the homepage. Its code remains only until
the ME213 page is rebuilt with normal-flow prose and a sticky sidecar. **Not
vibecoded:** removing the oversized interactive block improves reading progress
and avoids loading the site's largest asset on the landing page.

### Structural FIG separator retained

The public prose em-dash sweep leaves `FIG 01 — caption` intact. It is figure
notation, not sentence punctuation. **Not vibecoded:** it matches technical
documentation conventions and already carries semantic numbering.

## 2026-08-29 — Approved typography and label hierarchy

### IBM Plex Sans plus IBM Plex Mono approved

Peter approved the required desktop and mobile specimen. IBM Plex Sans 400/500
replaces Space Grotesk for headings and body copy; IBM Plex Mono 500 remains for
instrument labels and data. The 680px reading measure and hero scale remain
comfortable in the approved specimen. **Not vibecoded:** the two faces belong to
one family, the sans is less common than template-default Inter/Geist choices,
and the mono use stays tied to real interface roles.

### Ordinary links and navigation use prose casing

Uppercase mono remains for section headers, status readouts, dates, and figure
captions. Navigation and ordinary links now use IBM Plex Sans in normal casing,
and decorative directional glyphs were removed except the Résumé download
arrow. **Not vibecoded:** hierarchy follows meaning instead of applying one
high-tracking label treatment to every clickable surface.

### GaugeLoader is indeterminate

The loading gauge uses a sweeping accent needle and never presents a percentage.
Reduced-motion users receive a static needle. **Not vibecoded:** it communicates
real loading state in the instrument language; it is not decorative progress or
fabricated telemetry.

## 2026-08-29 — ME213 walkthrough

### Normal-flow sections with a sticky sidecar

The former 300vh reveal was replaced by three ordinary prose-and-photo sections
with a sticky model alongside them. There is no artificial scroll spacer and no
owned scroll container. **Not vibecoded:** the 3D view explains the system while
the document retains native reading length and behavior.

### Viewport-center occupancy drives the active subsystem

The implementation uses the section whose bounds occupy the viewport center,
not the proposed midpoint-crossing calculation. The value latches through gaps
and before the first section defaults to Chassis. This deviation keeps an anchor
arrival on a long section synchronized immediately; midpoint crossing could
leave the previous subsystem active after clicking Electronics. State changes
only at section boundaries, so both scroll directions remain stable. This is a
behavior mechanism, not a visual choice.

### Controls scroll to content

Subsystem controls are ordinary anchors. They update the model only by moving
the relevant prose through the center-line detector. This preserves keyboard
operation, JavaScript-free navigation, and one source of truth. **Not
vibecoded:** the selected border represents real document state rather than an
independent decorative mode.

### Viewer gate begins at 768px

The walkthrough mounts only at `min-width: 768px`; smaller clients render all
prose and photos without requesting the GLB. This is the PRD's candidate value,
not a permanent entitlement. Raise it if representative tablet testing shows
poor interaction quality. **Not vibecoded:** the gate is performance-driven and
the model is progressive enhancement.

### Intersecting chain meshes are hidden

The exported chain meshes visibly intersect the sprockets in the default pose,
so the model hides the first geometry-bearing node matching the verified chain
name. Real photographs carry the movement detail. No callout claims which GLB
node is Peter's mounting plate. **Not vibecoded:** accuracy takes priority over
showing every available mesh.

## 2026-08-29 — FluidSim explanation

### A semantic pipeline leads the page

The page opens with a static four-stage frame pipeline: particle state, spatial
hash, SPH compute passes, and instanced rendering. It is an ordered list in the
document and reflows from four columns to two and then one. **Not vibecoded:**
the diagram explains the project's core GPU data flow without decorative motion
or an unsupported live demo.

### The technical narrative is sectioned by evidence

The Markdown now separates GPU implementation, the collaborative SPH research
process, interaction and frame-stepping controls, and known limits. The
unresolved instability near 300,000 particles remains explicit rather than
being presented as solved. **Not vibecoded:** hierarchy improves scanning while
preserving the supported claims and limitations.

## 2026-08-29 — Keyboard and CD project pages

### The keyboard model is a lazy project artifact

The 1.1 MB keyboard PCB GLB mounts only when its frame nears the viewport, but
interaction is available at phone, tablet, and desktop widths. A real project
photo remains the server and loading fallback, with the indeterminate gauge
over it until the model resolves. Zoom and pan remain disabled. **Not
vibecoded:** the viewer exposes actual PCB geometry and touch orbiting without
capturing the page's scroll gesture.

### The CD player stays photo-led and short

The two existing build photographs now precede the deliberately brief project
description. No invented process copy, diagram, or feature list was added.
**Not vibecoded:** the source material is visual and the page hierarchy follows
that evidence instead of manufacturing depth.

## 2026-08-29 — Mechanical Design

### Ship one verified feature, not an artificial grid

Mechanical Design launches with the complete ME213 robot as its only entry.
The image caption states that Peter's teammates produced most mechanical design
and CAD; the copy distinguishes Peter's manufacturing, integration,
electronics-layout, mounting-plate, and controls contributions. **Not
vibecoded:** one wide image-and-copy feature is the honest presentation for one
verified asset, with no blank cells or speculative ownership.

### Keep blocked assets out of the gallery

The keyboard enclosure and standalone ME213 mounting plate remain excluded
until a render or photograph is available. The full robot photograph provides
system context but is not reclassified as Peter's mechanical CAD. This is a
content-integrity decision rather than a visual choice.

## 2026-08-29 — Journal publication boundary

### Page metadata, not robots.txt, carries noindex

Published journal entries emit `noindex, follow`; there is no journal index and
no crawlable link to an entry from the public site. `/journal` is intentionally
absent from `robots.txt`, because a disallow would prevent compliant crawlers
from fetching the page and seeing the metadata. This is a structural search
boundary, not a visual choice.

### Drafts are closed at three layers

`published` defaults to false, the public collection and static params filter
drafts, and the route reads the raw entry before returning `notFound()` for an
unpublished slug. Unlinked and noindex is documented as discoverability control,
not privacy; nothing sensitive belongs in the collection.

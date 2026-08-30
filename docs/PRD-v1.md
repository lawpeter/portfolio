# peterlaw.dev — Product Requirements Document (superseded)

> Archived on 2026-08-29. This document describes the original GNC-focused
> direction and is retained only as project history. The current requirements
> are in `docs/PRD.md`.

## 0. How to use this document

This PRD is the stable target: what to build and why. It should be committed into the project repository (e.g. `/docs/PRD.md`) before any build session begins — this document has no effect if it only exists in a chat transcript.

Two companion documents work alongside it and are referenced throughout:
- **`CLAUDE.md`** — lean, living conventions and architecture reference, read at the start of every session, updated when things change significantly.
- **Decision log** (`/docs/decisions.md`) — every choice made that this PRD doesn't explicitly specify gets logged here with a short justification, at the time it's made. If a decision can't be justified in writing, reconsider it before shipping it. Not public-facing, but not buried — plain sight in the repo.

This PRD describes the **full intended system**. Section 9 (Phased Rollout) defines what actually gets built first. Everything not in Phase 0 is real scope, deliberately sequenced — not scope creep and not optional.

---

## 1. Overview & Goals

A personal portfolio website for Peter Law — CS + Mechanical Engineering double major, UH Mānoa, targeting GNC/flight software roles (SpaceX, RocketLab, NASA Ames) with FAANG kept as a secondary track. This is Peter's **primary portfolio** — more central than LinkedIn or his resume — and should be comprehensive in the long run, not just at launch.

**Core goals, in priority order:**
1. Comprehensive, honest overview of Peter's real work — every project represented, not just the flashy ones.
2. Genuine unique/interactive functions tied to real technical skill — not decoration for its own sake.
3. Deliberately avoid the generic "vibecoded" AI-template look (see §5.6 for specifics).

No hard deadline. Domain `peterlaw.dev` already owned (Name.com, GitHub Student Developer Pack).

---

## 2. Audience

Primary: GNC/flight-software recruiters and engineers doing a fast technical skim. Secondary: general tech recruiters (FAANG-track). Tertiary: anyone Peter sends the link to directly (interviewers going deep on one project, peers, etc.).

Design consequence: the site must work for someone spending 30 seconds *and* someone spending 20 minutes. See §4.

---

## 3. Content Architecture

### 3.1 Flagship projects
- **FluidSim** — C++ GNC/flight-dynamics simulator. Not currently in active development; Peter may add a small number of metrics-related details, but no major additional work is planned. The technical flagship regardless of current activity level.
- **Quadrotor drone** — currently **sim-only** (2D simulation phase, no physical build yet). Lives alongside FluidSim in the software/sim wing, not the physical/CAD wing, until a real build exists.
- **UHM Engineering competition robot** (stair-climbing robot, 2nd of 50+ UH ME teams) — physical/CAD flagship.

### 3.2 Side projects (lower-stakes, lighter treatment)
- Custom keyboard — a ZMK-based build (case, firmware, keycap artwork).
- Custom CD player.

### 3.3 About section
Short bio (double major, GNC focus, career direction) plus personality: hobbies, and the site's own color-scheme origin story — Peter's first car was a 2010 BMW E60, which inspired the graphite-and-orange palette. This section is allowed to read like a person talking; it doesn't need to fit the telemetry motif.

### 3.4 Devlog
Reverse-chronological entries, each tagged to a project (cross-links back to that project's section). Written in markdown. Mirrors Peter's existing `DEVLOG.md` habit on the quadrotor project — this is a public presentation layer on a habit that already exists, not new work.

### 3.5 Deep-dive writeups
Every project starts with a top-level overview. More than one project eventually gets a full technical writeup (architecture, real decisions and trade-offs, math where it matters, what he'd do differently) — this **evolves over time**, written by Peter in markdown, same reading-column width as the rest of the prose. Must support embedded images (thin graphite-border frame + mono-font "FIG 01" style caption, matching the site's imagery convention) and tables (graphite borders, mono headers) — both are native to markdown; the requirement is that the rendering pipeline styles them to match the system rather than shipping default browser styling.

### 3.6 Contact
Two distinct forms:
- **Email form** — name / email / message, standard submission. Hidden backend behavior (not shown in the UI): submission also sends Peter a text notification so it isn't missed sitting in email. This is never advertised to the visitor.
- **SMS quick-text panel** — a single input, sends directly to Peter's phone; his reply pushes live back to the visitor's browser in the same session. Status states: standby → sent/awaiting reply → reply received.

Both forms sit together in the contact section; standard links (email, GitHub, LinkedIn, resume PDF download) sit above them, unremarkable by design.

---

## 4. Site Structure & Navigation

**Single scrollable page**, not a navigable 3D world. (A full free-roam 3D environment was seriously considered and deliberately dropped — it's a specialized engineering project in its own right, adds real risk, and a scrollable page with embedded, content-specific interactive pieces achieves the same "memorable" goal with far less risk, modeled loosely on maximeheckel.com.)

The single-page structure applies to the **main page**: every project and section appears there at overview depth. Deep-dive writeups (§3.5) and individual devlog entries (§3.4) live on **separate routes**, linked from the main page. The main page's devlog section shows recent entries; the full archive and each entry are their own pages. This keeps the main page skimmable at any future content volume while depth accumulates on subpages.

There is **no separate "basic mode" toggle**. The whole site is already fast and scannable by structural default — richness comes from which interactive pieces are present, not from a different navigation mode.

**Desktop vs. mobile:** desktop gets the full set of interactive islands. Mobile gets a reduced set — but this is a **later-phase concern** (see §9). Phase 0 has no dedicated mobile optimization, only baseline responsiveness (nothing actually broken on a phone).

Section order: Hero → Sim wing (FluidSim + quadrotor) → CAD-reveal wing (stair-climbing robot) → About → Side projects → Devlog → Contact/footer.

---

## 5. Visual Design System

### 5.1 Theme
Vehicle dynamics & control systems — automotive/motorsport telemetry, not literal car imagery. The throughline: the math behind an F1 car's traction control, a drone's EKF, and a spacecraft's attitude control is the same discipline at different scales. This also reflects Peter's own trajectory (GNC target, F1 systems engineering as a genuine parallel career interest) and personal history (first car, a 2010 BMW E60).

Grounded in **real** telemetry/dashboard references (MoTeC i2, F1 pit-wall displays), not generic "racing site" cliché — no checkered flags, no italic speed-streak lettering, no chrome or gloss.

### 5.2 Color
- Background: `#141312` — near-black graphite, warm/neutral (explicitly not blue-tinted).
- Text primary: `#e9e6de`
- Text secondary: `#8f8b83`
- Accent: `#e0481f` — a single saturated orange-red matching real BMW instrument-cluster illumination. Used where the accent renders large: borders, trace lines, large data elements. This color marks data; it never decorates surfaces (see §5.6).
- Accent, small-text variant: `#f15a2f` — lighter, used specifically where the accent color renders as small text, to maintain WCAG AA contrast (the darker `#e0481f` tests borderline at small sizes). The two accent values split by rendered size only — same role, same rules.
- **One accent color only.** No second hue (no cyan/blue). Where a second "channel" needs visual distinction (e.g. multiple telemetry traces), differentiate by weight/opacity/dash pattern, not color.
- **Dark-only.** No light mode.

### 5.3 Typography
- Data/labels/nav/mono contexts: **IBM Plex Mono**, weight 500 (medium, not regular 400 — regular's letterforms read as too thin, particularly the O), minimum 13px for any data/label text (never smaller — small sizes plus thin strokes compound into poor legibility).
- Headings/body/prose: **Space Grotesk**.
- Font declarations must be centralized (e.g. Next.js's `next/font` pattern, imported once in the root layout, referenced via CSS variable everywhere else) so a future font swap is a one-file change, not a repo-wide find-and-replace.

### 5.4 Layout & spacing
- 8px base spacing unit.
- Tight, grid-locked spacing *within* data-readout components (instrument-panel density). Generous spacing *between* major page sections (hero, sim wing, CAD wing, etc.) so scrolling doesn't feel like staring at a cockpit continuously.
- Reading-heavy sections (deep-dives, devlog, about) constrained to a ~680px column — full-width text is a legibility mistake, not a style choice.

### 5.5 Imagery & icons
- Photos of physical builds stay realistic/unfiltered — no color-grade or filter over real craftsmanship photos. The system lives in the *frame*, not the pixels: thin graphite border, consistent aspect ratio, mono-font corner caption in a "FIG 01 — [description]" style.
- Icons: a restrained thin-outline icon library (Tabler Icons or Lucide) for standard UI needs. Custom-drawn icons reserved for a small number of genuinely signature telemetry markers, used sparingly.

### 5.6 Anti-vibecoding guardrails (explicit, checkable)
No gradients, no glassmorphism, no mesh backgrounds or noise textures, no default Inter/Roboto, no purple, no decorative animation without functional purpose, no rounded corners on single-sided borders (data-readout badges use square/flat borders). The accent color marks data — it does not decorate large surfaces. If a UI decision can't be explained by "this is how real telemetry/dashboard software actually looks," it doesn't belong.

Every design choice gets a logged vibecoding assessment in the decision log, in both directions: if an option was considered and excluded, log why it read as vibecoded; if an option was included, log why it doesn't. Silence on this isn't acceptable for any non-trivial visual decision.

### 5.7 Themed micro-details (explicitly deferred)
Favicon, custom cursor, styled loading states, a possible "off circuit" 404 page — intentionally **not** part of any scheduled phase. Peter wants to live with the real site first and decide which of these are genuinely worth doing versus personality-for-its-own-sake. Revisit after Phase 0+ is live.

---

## 6. Interactive Features (post–Phase 0)

### 6.1 FluidSim / quadrotor sim embedded demo
- FluidSim (C++) compiles to WebAssembly via Emscripten → `.wasm` + JS loader, stored under `/public/wasm/fluidsim/`.
- Lazy-loaded: instantiates only when that section scrolls into view.
- Telemetry data exposed from C++ to JS via **Embind** (a function or buffer JS reads each step) — not stdout/console text, which isn't structured enough for a live chart.
- **Aggregate quantities (average density, highest pressure, etc.) are computed in C++**, not JS — the sim already holds the full field each step; send only the small set of summary scalars across the WASM boundary, not the whole field.
- Visual: telemetry-plot-style trace lines — true state (thin, muted), noisy reading (faint, dotted), Kalman estimate (solid, full accent) — differentiated by weight/opacity since there's only one accent hue. Mono-styled scrub control to drag through a run.
- Recompiling the C++ (adding a new tracked quantity, changing sim behavior) requires an actual build session — this is not a swappable-content-tier feature.

### 6.2 CAD-to-scroll-reveal (stair-climbing robot; quadrotor once it's a physical build)
- CAD assembly exported as compressed glTF/GLB, **each part preserved as a separate node** (not fused into one mesh — verify this at export time; some export settings merge geometry, which would break per-part animation).
- A React Three Fiber component loads the model; a scroll-progress hook (0→1 across the section) drives rotation and, for an exploded view, per-part position at scroll checkpoints.
- Checkpoint transforms live in a small config (not raw markdown-editable, but not deep code either — a real middle tier). The *pattern* (first implementation, and later adapting it for the quadrotor) needs a build session; once it exists, adjusting existing checkpoint values is lighter-weight.
- Explosion motion is authored directly (not pulled from the CAD tool's native "exploded view" feature — that data generally doesn't survive a glTF export in a scroll-drivable form anyway).
- Visual: section pins in place while scrolling; camera holds steady, model rotates/explodes; thin mono-font leader-line labels call out parts at certain scroll points; small mono readout tracks scroll progress like an assembly-percentage counter.

### 6.3 Analytics
Lightweight, telemetry-themed display (visitor count, uptime-style readout, etc.) — the **display** ships in a later phase, but the underlying infrastructure and a silent page-view logger should exist from **Phase 0** so real historical data has already accumulated by the time the display is built.

---

## 7. Technical Architecture

- **Framework:** Next.js (App Router). Chosen over Astro after direct comparison — Astro's default performance/island-hydration model is a genuine but modest edge (mainly relevant to lazy-loading the WASM bundle), outweighed by Next.js's much larger ecosystem and AI-tooling support, which matters more given Peter's non-frontend background and dependence on AI-assisted future sessions. No meaningful WASM/C++ embedding performance difference between the two frameworks — WASM execution speed is framework-agnostic.
- **3D/interactive layer:** React Three Fiber, used only in specific islands (sim demo, CAD reveal) — not on every page.
- **Hosting:** Vercel — not self-hosted (a home machine or Raspberry Pi was considered and rejected on uptime/reliability grounds; no cost savings either, since the free tier covers this use case). Two consequences of this choice: (1) analytics storage (§6.3) uses a Vercel-marketplace-integrated store (e.g. Neon Postgres or Upstash Redis) — the specific selection gets logged in the decision log; (2) the SMS quick-text feature's realtime backend (§3.6) is not required to run on Vercel, since Vercel's serverless functions don't hold persistent WebSocket connections — a small self-contained external service (e.g. a Cloudflare Worker with a Durable Object handling the WebSocket push) is an acceptable architecture. That backend gets designed and logged when its phase is built, not now.
- **Deployment (DNS pointing, going live) is explicitly out of scope for this build** — Peter's own step after handoff, referencing the decision log for any follow-up questions.
- **Content:** Markdown content collections for devlog entries and project descriptions.
- **Critical requirement — schema designed for the full feature set from Phase 0**, even though most fields stay unused at first (e.g. every project entry gets fields like `hasInteractiveDemo`, `hasCADReveal`, related-assets path, related-devlog-entries — populated or not). This is the actual mechanism behind "no rework later" — the page structure and routing don't need to change when a feature is turned on if the schema already anticipated it; a narrow schema (just `title` + `description`) would force a real restructure later.
- **Assets:** CAD exports (GLB) under `/public/models/<project>/` are fully swappable — replace the file in place, no build session, once the loading component exists. Compiled WASM binaries under `/public/wasm/<project>/` are swappable **only when the exposed interface is unchanged** (same Embind functions/data shape) — dropping in a recompiled binary with the same interface is a file swap, but tracking something new or changing what's exposed requires updating the JS-side component too, which needs a build session (see §6.1). Compilation itself (C++ → WASM) happens on Peter's own toolchain, outside Fable 5's process — Fable 5 owns the loading/rendering code around whatever binary exists, not the C++ build.
- **Secrets:** environment variables only, never committed; `.env.example` placeholder checked into the repo.
- **SEO/semantic HTML:** proper semantic HTML and meta structure as baseline hygiene — not a priority feature (most traffic arrives via a direct resume link, not search), but cheap to get right and matters for accessibility too.

---

## 8. Content Update Workflow (three tiers)

1. **Content edits** (markdown: devlog entries, project descriptions) — Peter edits directly, no build session needed. Schema-validated, so a malformed entry fails loudly at build time rather than silently breaking a page.
2. **Asset swaps** — GLB models are always a drop-in replacement, no build session. WASM binaries are a drop-in replacement only if the exposed interface hasn't changed; otherwise it's a tier-3 change.
3. **Code changes** (new interactive components, new scroll animations, anything touching the C++/WASM source) — requires an actual Claude Code build session.

---

## 9. Phased Rollout

### Phase 0 — true MVP
Desktop-only. Dark theme fully in place (typography, color, spacing system — see §5). **Full, final site architecture and routing** — not a throwaway scaffold to be rebuilt later, the real structural skeleton with minimal content inside it. Every flagship and side project is a clickable section.

**Content sourcing for Phase 0:** FluidSim and quadrotor section text is drafted from their GitHub repos (read-only reference, §10) and reviewed by Peter before it counts as done. The competition robot, keyboard, and CD player sections ship with **clearly labeled placeholder text** (e.g. a mono `[CONTENT PENDING]` marker) — never plausible-sounding filler that could be mistaken for a real description — pending source facts from Peter, and must be replaced before the domain is pointed. Peter also supplies the resume PDF (§3.6 download link) and project photos (§5.5); sections render gracefully while these assets are absent.

Content schema built for the complete feature set per §7. Decision log active from the first commit. Contact section is a plain email link (placeholder — the full two-form system is a later stage). Analytics groundwork (infra + silent logging) in place, no visible display yet.

**Phase 0 acceptance criteria:**
- Production build compiles and runs cleanly, with deployment configuration for the chosen host present and documented. Actual deployment and DNS pointing are Peter's step (§7).
- FluidSim and quadrotor sections have real, repo-derived written content, reviewed by Peter. Remaining project sections have clearly labeled placeholders — no unlabeled filler that reads as real description.
- Contact info present and functional (plain email link).
- Nothing visibly broken when viewed on a phone, even without dedicated mobile design.
- Decision log contains an entry for every non-PRD-specified choice made along the way.

### Later stages (order not fixed — sequence by whatever's most valuable next)
- Hero section polish
- Mobile-lightweight version (reduced interactive islands, same content)
- Sim wing: FluidSim + quadrotor embedded demo with telemetry graph (§6.1)
- CAD-scroll-reveal for the stair-climbing robot (§6.2)
- Side-projects gallery polish
- Deep-dive writeup richness (beyond the Phase-0 overview level)
- Two-form contact system + hidden email→SMS notification behavior
- Visible analytics display

### Backlog — not scheduled, revisit later
- Full 3D reconstruction (photogrammetry/Gaussian-splat) of the stair-climbing robot, explorable like a Blender scene — contingent on confirming the available footage is a static walk-around, not dynamic action footage (unresolved as of this PRD).
- Quadrotor's own CAD-scroll-reveal, once it's an actual physical build.
- Themed micro-details (§5.7).
- Cryptic-crossword footer easter egg.
- Standalone shareable utility tool (e.g. an orbital-mechanics or vehicle-dynamics calculator) — a separate future conversation, not yet scoped.

---

## 10. Fable 5 Working Agreement

**Decision logging.** Anything this PRD doesn't explicitly specify gets logged in `/docs/decisions.md` with a short justification, at the time the decision is made. If a decision can't be justified in writing, reconsider it before shipping. This is a self-check mechanism, not paperwork for its own sake.

**Dependencies.** May be added freely when useful, given the logging discipline above — every addition gets a one-line justification.

**Research before building.** For non-trivial pieces (WASM embedding, scroll-driven R3F, CAD/glTF loaders), reference established real-world patterns rather than improvising from scratch. May reference Peter's FluidSim and quadrotor GitHub repos **read-only** for accurate deep-dive content and implementation reference.

**File scope.** Writes confined to the portfolio project directory. No touching files outside it.

**Secrets.** Environment variables only, never committed, `.env.example` as the template.

**Git discipline.** Never merge a non-working branch. One new branch per feature/aspect. Commit frequently — as soon as a task completes, not batched at the end of a session.

**Plan before code.** Lay out an explicit plan before implementation for any non-trivial task (Claude Code's plan mode or equivalent) — this avoids solving the wrong problem, which is the single most common failure mode in agentic coding.

**Verification, not assertion.** "Done" requires evidence — actual test output, the command run and what it returned — not just a claim that something should work.

**Escalation.** Ask Peter more often than not when genuinely uncertain — but self-review in a code-review style first (a fresh look trying to refute the result) before surfacing the question, so easy ambiguities get resolved without a round-trip.

**Overriding this PRD.** If Fable 5 believes a specific requirement in this document should be overridden, it may only do so after two checks, in order: first, a genuine self-review confirming the override is actually justified and not just convenient; second, checking with Peter directly, stating the justification plainly, before proceeding. This exists so Fable 5 can exercise real judgment rather than being rigidly locked to the letter of this document, while keeping Peter as the actual decision-maker on any real deviation from what's written here.

**Performance & accessibility.** Aim for WCAG AA and solid performance (e.g. good Lighthouse scores) as stated goals — not hard gates. Specific trade-offs are Fable 5's judgment call.

**Ghost-directory mitigation.** Do not trust this PRD's description of file structure as necessarily current — verify actual repository state before making structural assumptions, especially at the start of a session or after any gap. Claude Code's own auto-maintained memory (recording real codebase discoveries between sessions) should stay enabled and is the primary mechanism for this; `CLAUDE.md` should be treated as a living document, updated when the architecture changes meaningfully, not written once and left stale.

**Visual verification.** For any UI/visual work, compare rendered output against the exact specification in §5 (color hex values, font families/weights, spacing units) before considering a section done — a screenshot-and-compare pass against those specifications, not just "the code should produce this."

---

## 11. Explicit Non-Goals (Phase 0)

- No mobile-specific design (baseline responsiveness only)
- No SMS or two-form contact system (plain email link only)
- No embedded interactive demos (FluidSim, CAD reveal)
- No visible analytics display
- No deployment/DNS configuration
- No themed micro-details (favicon, cursor, loading states)

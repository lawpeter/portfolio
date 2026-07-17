# peterlaw.dev

Personal portfolio website for Peter Law — GNC/flight-software focused resume site, vehicle-dynamics/telemetry visual theme. Full requirements: `/docs/PRD.md`. Rationale for anything not explicitly in the PRD: `/docs/decisions.md`.

This file is a living reference, read at the start of every session. Update it when the architecture changes meaningfully — it should describe current reality, not history. If this file and the actual repository disagree, the repository is correct; fix this file to match, don't assume this file is right.

## Tech stack

- Next.js (App Router)
- React Three Fiber for interactive islands (embedded sim demo, CAD scroll-reveal) — not used site-wide, only in specific components. Later-phase feature: install during Phase 0 only if genuinely required to finalize the structural skeleton; otherwise defer until the first component that needs it
- Markdown content collections for devlog entries and project descriptions
- Routing: single scrollable main page at overview depth; deep-dive writeups and individual devlog entries are separate routes linked from it (PRD §4)
- Hosted on Vercel (deployment itself is out of scope for this project — see PRD §7)
- Styling: Tailwind CSS v4, CSS-first config — all §5 design tokens live in a `@theme` block in `app/globals.css`, default palette replaced (rationale in `/docs/decisions.md`)
- TypeScript; content frontmatter validated with Zod (`gray-matter` + `zod` + `react-markdown` pipeline)

## Structure

```
/app                 App Router: layout, main page, projects/[slug], devlog, devlog/[slug], api/telemetry
/components          React components, including (later) the R3F interactive pieces
/content/projects/   markdown project descriptions, one file per project
/content/devlog/     markdown devlog entries
/lib                 content loader (gray-matter + zod), analytics helper
/public/models/<project>/   GLB CAD exports — always swappable, no build session needed
/public/wasm/<project>/     compiled WASM sim binaries — swappable only if the exposed interface is unchanged
/docs/PRD.md         requirements — what to build and why
/docs/decisions.md   decision log — why anything not in the PRD was done the way it was
```

## Commands

- `npm run dev` — dev server
- `npm run build` — production build (also where malformed content fails loudly)
- `npm run lint` — ESLint

## Working principles

1. **Think before coding.** Plan first — state what you're building and how you'll verify it before writing implementation code. Solving the wrong problem is the most common failure mode here, not writing bad code.
2. **Simplicity first.** Minimum code for the actual current requirement. No speculative abstractions, no unrequested features, no "while I'm here" additions.
3. **Surgical changes.** Touch only what the task requires. Don't refactor adjacent code. Match existing style and patterns already in the codebase rather than introducing a new one.
4. **Verify, don't assert.** "Done" requires evidence — actual command output, an actual passing check — not a claim that something should work.

## Content tiers

1. **Markdown edits** (devlog, project descriptions) — no build session. Schema-validated; a malformed entry should fail loudly at build time.
2. **Asset swaps** — GLB models: always a drop-in replacement. WASM binaries: a drop-in replacement only if the exposed interface hasn't changed; otherwise this is tier 3.
3. **Code changes** (new components, new interactive pieces, anything touching C++/WASM source) — needs an actual session.

## Governance

- Log anything not explicitly specified in the PRD to `/docs/decisions.md`, with justification, at the time the decision is made. If it can't be justified in writing, reconsider it.
- Dependencies may be added freely given the above — one line of justification per addition.
- For non-trivial pieces (WASM embedding, scroll-driven R3F, CAD/glTF loading), reference established real-world patterns rather than improvising. May reference Peter's FluidSim and quadrotor GitHub repos, read-only.
- File writes confined to this project directory.
- Secrets via environment variables only, never committed. `.env.example` as the template.
- Git: never merge a non-working branch. One branch per feature/aspect. Commit frequently — as soon as a task completes, not batched.
- Ask Peter more often than not when genuinely uncertain — but self-review in a code-review style first, before escalating.
- Overriding a PRD requirement: self-check first, then check with Peter directly with the justification stated, before proceeding.
- Every non-trivial visual decision gets a logged vibecoded-or-not justification in the decision log, whether it was included or excluded.
- Aim for WCAG AA and good performance (see PRD §7) — goals, not hard gates; trade-offs are your judgment call.
- Full visual design system (colors, type, spacing) is specified in PRD §5 — reference it there rather than duplicating values here, to avoid the two documents drifting apart.

## Anti-vibecoding checklist

No gradients, no glassmorphism, no mesh/noise backgrounds, no default Inter/Roboto, no purple, no decorative animation without functional purpose, no rounded corners on single-sided borders. The accent color marks data — it doesn't decorate large surfaces. If a UI choice can't be explained by "this is how real telemetry/dashboard software actually looks," it doesn't belong. Full rationale: PRD §5.6.

## Known gotchas

None yet — add here the moment something costs real recovery time (e.g. "never run X, it breaks Y"), don't wait to write it down.

## Current work context

Phase 0 (PRD §9) is built and verified: full site architecture and routing, §5 design system, Zod-validated content schema with the complete §7 field set, FluidSim/quadrotor content drafted from their repos, placeholder sections marked `[CONTENT PENDING]`, plain email contact link, silent analytics groundwork (`docs/telemetry.sql` + `/api/telemetry`, no-op until `DATABASE_URL` is set).

Open items on Peter, before the domain is pointed:
- Review FluidSim + quadrotor section prose and the seeded devlog entry (repo-derived, unreviewed)
- Supply real content for stair robot / keyboard / CD player, resume PDF, project photos, LinkedIn URL
- Provision Neon Postgres (run `docs/telemetry.sql`), set `DATABASE_URL`
- Confirm contact email (currently lawpeterp@gmail.com)

Next phases (order not fixed, §9): hero polish, mobile-lightweight pass, embedded sim demo, CAD scroll-reveal, contact forms, visible analytics.

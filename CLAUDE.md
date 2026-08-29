# peterlaw.dev

Personal portfolio for Peter Law, a mechanical engineering and computer science
student at UH Mānoa. The current requirements live in `docs/PRD.md`; the old
GNC-focused direction is archived in `docs/PRD-v1.md`. Record implementation
judgment in `docs/decisions.md`.

This is a living reference. If it disagrees with the repository, verify the
repository and update this file.

## Stack

- Next.js App Router, React, TypeScript
- Tailwind CSS v4 with CSS-first tokens in `app/globals.css`
- Markdown collections loaded with `gray-matter` and validated with Zod
- `react-markdown`, GFM, and custom figure/table rendering
- React Three Fiber, drei, and three for lazy interactive model viewers
- Hosted on Vercel; deployment and DNS remain out of scope

## Current information architecture

The homepage is one scrollable overview:

1. Header
2. Hero
3. Projects
4. Mechanical Design, only when entries exist
5. About
6. Devlog, only when published entries exist
7. Contact
8. Footer

`app/page.tsx` owns one renderable-section array. Section markup, header
navigation, and index numbers all derive from it. Never hardcode section numbers
in a second place.

Project pages remain at `/projects/[slug]`. Devlog remains at `/devlog` and
`/devlog/[slug]`, even when hidden from the empty homepage. Journal entries use
`/journal/[slug]` and must never be linked from the public site.

The former quadrotor project and devlog URLs permanently redirect to its GitHub
repository. Analytics is removed. Contact is email and external links until the
separately scoped backend phase.

## Content

```
content/projects/     four project writeups
content/devlog/       published or draft devlog posts
content/mechanical/   verified mechanical-design entries (currently one)
content/journal/      unlinked, noindex journal posts
```

Project status is optional and limited to lowercase `complete` or `ongoing`;
`StatusBadge` handles uppercase presentation. `prominence` is `featured` or
`standard` and defaults to `standard`.

Devlog and journal `published` defaults to `false`. Publication gates apply to
listings, static params, and the route handler. A direct draft URL must return
404.

Mechanical ownership is never inferred from CAD nodes. The complete ME213 robot
may be shown as system context only if the copy states that teammates produced
most mechanical CAD.

Journal uses page-level `noindex, follow`. Do not add `/journal` to robots.txt;
blocking crawl prevents compliant bots from seeing `noindex`. Unlinked and
noindex is not privacy, so nothing sensitive belongs there.

## Interactive assets

Models live under `public/models/<project>/`. Raw Onshape exports must be
compressed with `gltfpack -cc -kn`; `-kn` preserves per-part nodes.

The ME213 route uses `components/robot-walkthrough/`: ordinary prose/photo
sections drive a sticky sidecar model at 768px and above. The active subsystem
is the section occupying the viewport center; gaps latch the previous value.
Controls are anchor links, and scroll position remains the source of truth.

Phones must not automatically request the stair-robot GLB. `frameloop="demand"`
must remain for the walkthrough. Static prose and photos are the complete
fallback when JavaScript or WebGL is unavailable.

The keyboard model viewer is lazy but touch-capable at every width. It keeps
zoom and pan disabled so page scroll is never captured, and preserves a real
project photo as its server/loading fallback. Loading indicators are
indeterminate unless byte-accurate deployed progress has been proven.

## Visual system

The E60 graphite-and-orange identity remains: square borders, hairline rules,
flat tonal surfaces, and a single accent color. No gradients, glassmorphism,
noise backgrounds, purple, or decorative animation.

IBM Plex Sans plus IBM Plex Mono is the approved site pairing. Peter approved
the desktop/mobile specimen on 2026-08-29. Font declarations remain centralized
in `app/layout.tsx` and `app/globals.css`.

Uppercase mono is for genuine instrument labels, status readouts, and figure
captions. Navigation and ordinary links are prose-adjacent. `FIG 01 — caption`
uses an intentional structural separator and is exempt from the public prose
em-dash sweep.

## Commands

- `npm run dev`
- `npm run build`
- `npm run lint`

Build is the primary content-schema check. A malformed entry must fail loudly.

## Working principles

1. Plan non-trivial work and verify repository reality before editing.
2. Prefer the simplest mechanism that satisfies product behavior. Record any
   mechanism deviation from the PRD in `docs/decisions.md`.
3. Keep edits scoped and preserve user work.
4. Verify with real command output, not assertions.
5. Use one branch per phase or cohesive aspect; never merge a non-working branch.
6. Make no ownership claim that is not confirmed by Peter or explicit in the
   current PRD.
7. Log each non-trivial visual choice with a vibecoded-or-not assessment.

## Current work state

- Phases 1, 1b, and 2: implemented and verified locally on 2026-08-29.
- Phases 3 through 8: implemented; final cross-phase browser sweep remains.
- FluidSim leads with a semantic GPU frame-pipeline visual and a sectioned
  technical narrative; no live demo is implied.
- The keyboard page preserves its lazy orbit viewer on mobile and desktop; the
  CD player page is intentionally short and photo-led.
- Mechanical Design intentionally uses a single-feature ME213 robot entry.
  Gallery assets still needed: keyboard enclosure image and either a
  mounting-plate render or confirmation of the correct GLB node.
- Journal entries are unlinked, `noindex, follow`, and closed to drafts at the
  collection, prerender-param, and direct-route layers. This is not privacy.
- A corrected résumé is optional; `public/resume.pdf` currently resolves and is
  intentionally unchanged.

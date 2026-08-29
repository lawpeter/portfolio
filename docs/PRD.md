# peterlaw.dev — Current Product Requirements

Revision 4, adopted 2026-08-29. The original GNC-focused PRD is archived as
`docs/PRD-v1.md`. Implementation rationale belongs in `docs/decisions.md`.

## 1. Product goal

Present Peter Law as a mechanical engineering and computer science student who
works across software, electronics, controls, simulation, manufacturing, and
mechanical systems. The site must be accurate about project outcomes and
individual ownership, retain the E60 instrument-panel identity, and read like a
person wrote it.

The homepage is a fast overview. Project routes hold the detail. No project may
be inflated to make the set look more symmetrical or impressive.

## 2. Non-negotiable factual rules

- The ME213 robot won 1st in its Fall 2025 section. Do not use the old 2nd of
  50+ claim.
- The robot was built by a six-person team. Peter wrote the control software,
  integrated the PS2 controller receiver, designed the electronics layout and
  mounting plate, participated in manufacturing, and took on more coordination
  near the end. Teammates did most mechanical design and CAD.
- Do not call Peter the systems engineering lead or imply he owned the entire
  robot.
- Name the PS2 controller receiver without a radio type unless Peter confirms
  the kit model.
- FluidSim is complete. Keep the GPU and spatial-hashing facts, but make no
  unconditional complexity claim. Say the team worked through the SPH
  formulation, not that it derived the mathematics.
- The keyboard began as a 2-key copy-paste gadget. Its PCB was designed in
  KiCad, fabricated by JLCPCB, and soldered by Peter. One diode per key prevents
  matrix ghosting; NKRO was not validated. The enclosure is finished.
- The CD player is complete. Do not publish planned V2 work.
- The abandoned quadrotor simulation is not a portfolio project. Its former
  project and devlog URLs permanently redirect to the public GitHub repository.
- Résumé content and design are out of scope. `/resume.pdf` must keep working.

## 3. Information architecture

Homepage order:

1. Site header
2. Hero
3. Projects
4. Mechanical Design, only when a verified entry exists
5. About
6. Devlog, only when a published entry exists
7. Contact
8. Footer

The header is a square, hairline-separated top band in the instrument idiom,
not a floating pill. It includes peterlaw.dev, GitHub, LinkedIn, Résumé, and
Contact.

Homepage section definitions are one renderable array. Both rendered sections
and header navigation derive from it, including indices. Empty conditional
sections render no shell and consume no number.

Projects appear in this order: Stair-Climbing Robot, FluidSim, Custom Keyboard,
Custom CD Player. The stair robot receives the featured treatment; the others
are standard previews. Do not recreate the old sim/CAD/side wings.

The homepage does not host the ME213 3D walkthrough. `/devlog` remains directly
reachable even when the empty Devlog homepage section is hidden.

## 4. Content collections

Project metadata:

- `slug`, `title`, `summary`, `repoUrl?`, `modelPath?`, `images`, `order`
- `status?: "complete" | "ongoing"`; display casing is a rendering concern
- `prominence: "featured" | "standard"`, defaulting to `standard`

Devlog metadata:

- `slug`, `title`, `date`, `project?`
- `published`, defaulting to `false`

Mechanical metadata:

- `slug`, `title`, `image { src, caption, aspect? }`, `description`
- `software?`, `year?`, `projectSlug?`, `order`

Journal metadata:

- `slug`, `title`, `date`
- `published`, defaulting to `false`

Devlog and journal publication is enforced at three layers: public listings,
`generateStaticParams`, and the dynamic route itself. Direct access to an
unpublished slug returns 404.

## 5. Visual system

Retain the E60 palette and flat instrument language:

- graphite `#141312`
- primary text `#e9e6de`
- secondary text `#8f8b83`
- accent `#e0481f`, with `#f15a2f` for small accent text
- square borders, hairline rules, flat tonal surfaces, and one accent hue

No gradients, glassmorphism, decorative noise, purple, rounded-card styling,
or decorative animation. The accent marks data and state.

IBM Plex Sans plus IBM Plex Mono is a candidate, not an approved decision.
Before changing the body font, produce desktop and mobile specimens containing
the hero, a long real About paragraph, a project title, section navigation, a
small instrument label, and a figure caption. Continue with typography-dependent
visual work only after Peter approves the specimen.

Uppercase mono remains for genuine instrument labels such as section headers,
status readouts, and figure captions. Navigation and ordinary links should read
as prose. Decorative arrow suffixes are removed except the Résumé download
arrow, which communicates behavior. Reduce excessive tracking.

The `FIG 01 — caption` separator is structural punctuation and remains.

## 6. ME213 project page

Preserve scroll storytelling without an artificial 300vh spacer. Chassis,
Movement, and Electronics are ordinary document-flow sections with real prose
and photos. A sticky 3D viewer may accompany them and follows the section whose
midpoint most recently crossed the viewport center. The active state must work
in both scroll directions without flicker or null states.

Subsystem controls are anchor links that scroll to the prose section; scroll
position remains the source of truth. Reduced motion preserves synchronization
but makes movement instantaneous.

Phones must never automatically download the 7.1 MB GLB. A 768px viewer gate is
only a starting point and must move upward if representative tablet performance
is poor. Prose and photos carry every critical fact without JavaScript or WebGL.

Non-selected parts fade rather than disappear. Chain meshes are hidden because
they intersect the sprockets in the shipped pose. No label may claim Peter
designed a part based only on a plausible GLB node name.

## 7. Other project pages

FluidSim keeps its technical explanation, simulation visuals, optimization
decisions, limitations, collaboration note, and controls table. Do not add
filler for symmetry.

The keyboard keeps its PCB viewer and gains an honest indeterminate loading
gauge. Zoom and pan remain disabled so the viewer never captures page scroll.
The narrative covers the 2-key prototype, full board, firmware, and enclosure.

The CD player stays short and fun. Do not manufacture technical depth.

## 8. Loading behavior

`GaugeLoader` is indeterminate unless byte-accurate deployed progress is proven.
Never display a fabricated percentage. Under reduced motion it becomes a static
readout. Use it only for assets slow enough to need a loading state.

## 9. Mechanical Design

Ownership is verified per entry, never inferred from CAD names.

- Keyboard enclosure: verified as Peter's design, blocked on a render or photo.
- ME213 electronics mounting plate: verified as Peter's design, blocked on a
  render or Peter confirming its GLB node.
- Complete ME213 robot: may use the existing GLB as system context; its caption
  states that teammates created most mechanical CAD.

With zero entries, hide the section. With one entry, delay for a second asset or
use an intentionally single-feature layout. With two or more, use a restrained
responsive grid. Never pad the gallery.

## 10. Devlog and journal

Devlog uses markdown, Zod, and dynamic routes. It may contain posts not tied to
a project.

Journal reuses that architecture at `/journal/[slug]`. Published journal pages
use `robots: { index: false, follow: true }`, have no crawlable site links, and
are excluded from the sitemap. Do not disallow `/journal` in `robots.txt`,
because that would prevent compliant crawlers from seeing `noindex`.

Unlinked and noindex is not privacy. Anyone with a URL can read the page, and a
crawler may ignore the directive. Nothing sensitive belongs in the journal.

## 11. Removed systems

Analytics and its Neon dependency are removed. The embedded WASM simulation is
not an active roadmap item; the former interface document is archived. Contact
remains email and external links until the separately scoped SMS backend phase.

## 12. Verification gates

Every phase runs `npm run build` and `npm run lint`. Content-schema errors must
name the offending file and fail the build. Verify redirects, résumé delivery,
publication gates, conditional numbering, accessibility, reduced motion,
mobile GLB non-loading, console cleanliness, and representative viewport layouts
in proportion to the phase being changed.

Phase 3 typography approval is a hard gate before Phases 3 through 8 continue.

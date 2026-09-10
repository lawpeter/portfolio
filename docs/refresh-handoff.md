# Project content and CAD handoff

## Files to supply

Send originals as attachments; no need to rename them first. These are intended deployment destinations, not currently present assets.

| Priority | File | Destination / use |
| --- | --- | --- |
| Required to restore resume | Corrected resume.pdf, personally reviewed including HSFL bullets | public/resume.pdf; restore hero/footer links only after review |
| Keyboard visual priority | Complete keyboard assembly STEP, or enclosure STEP/STL; GLB is also welcome | Keep source in raw-assets/keyboard; convert/optimize to public/models/keyboard/keyboard-assembly.glb; set modelPath in keyboard.md |
| Keyboard visual priority | Isometric enclosure screenshot/render; ideally one view with PCB and plate visible | public/photos/keyboard/enclosure-isometric.webp; add once to keyboard.md images; use its imageIndex in mechanical facet |
| Keyboard visual priority | Photo of multiple printed enclosure iterations | public/photos/keyboard/enclosure-iterations.jpg; caption with version order and actual changes |
| Helpful | Top/bottom or exploded CAD view | public/photos/keyboard/enclosure-exploded.webp |
| Optional | KiCad .kicad_pcb and .kicad_sch, plus project-local libraries if necessary | raw-assets/keyboard only; use for factual checks or PCB render generation, not automatic public source publication |
| Helpful | Robot mounting-plate close-up or CAD export of Peter-owned plate | public/photos/stair-robot/electronics-mounting-plate.jpg; replace mechanical facet image reference |
| Optional | FluidSim screenshot or short capture, plus quadrotor screenshot | public/photos/fluidsim and public/photos/quadrotor |

Do not publish raw engineering sources merely because they are supplied. The existing keyboard-pcb.glb remains a PCB asset and is not mounted as a full assembly. Existing keyboard photos show an earlier two-key gadget and keycap design, clearly captioned; neither is an enclosure substitute.

## Details needed to deepen copy

- Keyboard: what currently works on the assembled board, what remains untested, and 1–2 specific enclosure changes between print iterations (with the reason). Confirm which display/encoder firmware features work on hardware.
- CD player: drive/player model, power supply, audio output/speaker arrangement, and how the drive mount was made. Current copy stops at supported enclosure and mechanism facts.
- Robot: a mounting-plate close-up and a short description of fabrication method would improve the mechanical section.

## Repository audit

- Live FluidSim README has all-GPU and unconditional O(n) claims. Live src/main.cpp was read through GitHub API: runFrame reads particleSSBO through glGetNamedBufferSubData, rebuilds/flattens the grid CPU-side, uploads indices, and dispatches compute stages. Portfolio wording matches that hybrid pipeline.
- Local FluidSim checkout has uncommitted code and differs from live main. It was not edited.
- Live quadrotor README retrieved through GitHub API is empty. A scoped replacement is staged in docs/repository-updates/quadrotor-README.md.
- The zmk-config link resolves to the firmware repository. The site labels it Firmware Source and does not claim public KiCad/CAD sources.
- Repository update files here are reviewable drafts, not applied or published changes. Deployment readiness requires applying the relevant README corrections to the linked repositories.

## Release state

This branch is not deployed. Resume is intentionally unavailable until a corrected copy is supplied. Keyboard assembly viewer and new enclosure imagery await supplied files; public missing-asset placeholders are not rendered. Final deployed-site content review remains outstanding.

## Verification performed

- ESLint and production Next.js build passed after restoring locked dependencies and permitting existing Google Fonts fetches.
- Browser review of homepage at desktop and 390px mobile width; all five project detail pages checked at 390px with no horizontal overflow, missing loaded images, or mobile canvases.
- Desktop robot model loaded in conventional orbit view; no application errors observed. Three.js emitted an upstream Clock deprecation warning.
- All frontmatter-referenced local images/models exist. Project canonical URLs match their routes.
- HTTP: obsolete resume and unknown project return 404; Open Graph image, sitemap, and robots return 200.
- Dependency installation reported 9 audit findings in the existing lockfile; dependency remediation was not part of this content refresh.
- Remaining checks: final supplied assets, full keyboard interaction/accessibility pass, comprehensive failed-request review, and deployed-site content review.

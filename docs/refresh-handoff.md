# Project content and CAD handoff

## Supplied CAD and current state

- Keyboard assembly STEP: four solids (top, switch plate, base, PCB), kept in their supplied relative positions. Web model: public/models/keyboard/keyboard-assembly.glb.
- Individual base, top, and switch plate STLs are retained locally under ignored raw-assets/keyboard. Base STL provides the separate base preview.
- Electronics Mount STL: web model public/models/stair-robot/electronics-mount.glb and a static preview, used in the robot mechanical facet. Full robot CAD remains team context.
- Raw engineering sources and the source preparation brief are ignored local files, not published sources.
- Static previews use the actual supplied geometry and illustrative colors, rendered with a depth buffer. scripts/prepare-cad-assets.py documents conversion; after generation, compress each GLB using gltfpack -cc -kn before deployment.
- Onshape document was supplied but could not be independently loaded; exports were sufficient. No unverified public CAD link was added.
- Peter confirms all current keyboard firmware works. Remaining mechanical iteration includes base incline, USB-C location, and nice!view window before casting/milling.
- CD player components confirmed: SMSL PL100 CD player, Clyxgs TPA3116D2 amplifier board, PB240A1 power bank, and two Dayton ND65-8 drivers.

## Files still needed

1. Corrected resume.pdf. Supplied PETER_LAW.pdf still contains the old robot result, Bluetooth wording, GPU-resident language, and active quadrotor entry. It was inspected, not rewritten or published; resume links remain disabled.
2. Photos of printed enclosure iterations, with short notes about changes between versions, when available.
3. Photo of the physical robot mounting plate, when available.

Optional: FluidSim capture and quadrotor screenshot. No additional CAD export is needed for the current viewer.

## Repository audit

- Live FluidSim README has all-GPU and unconditional O(n) claims. Live src/main.cpp was read through GitHub API: runFrame reads particleSSBO through glGetNamedBufferSubData, rebuilds/flattens the grid CPU-side, uploads indices, and dispatches compute stages. Portfolio wording matches that hybrid pipeline.
- Local FluidSim checkout has uncommitted code and differs from live main. It was not edited.
- Live quadrotor README retrieved through GitHub API is empty. A scoped replacement is staged in docs/repository-updates/quadrotor-README.md.
- The zmk-config link resolves to the firmware repository. The site labels it Firmware Source and does not claim public KiCad/CAD sources.
- Repository update files here are reviewable drafts, not applied or published changes. Deployment readiness requires applying the relevant README corrections to the linked repositories.

## Release state

This branch is not deployed. Resume is intentionally unavailable until a corrected copy is supplied. Keyboard assembly and mounting-plate models plus CAD previews are integrated. Physical iteration photos remain pending. Final deployed-site content review remains outstanding.

## Verification performed

- ESLint and production Next.js build passed after restoring locked dependencies and permitting existing Google Fonts fetches.
- Browser review of homepage at desktop and 390px mobile width; all five project detail pages checked at 390px with no horizontal overflow, missing loaded images, or mobile canvases.
- Desktop robot model loaded in conventional orbit view; no application errors observed. Three.js emitted an upstream Clock deprecation warning.
- All frontmatter-referenced local images/models exist. Project canonical URLs match their routes.
- HTTP: obsolete resume and unknown project return 404; Open Graph image, sitemap, and robots return 200.
- Dependency installation reported 9 audit findings in the existing lockfile; dependency remediation was not part of this content refresh.
- Remaining checks: final supplied assets, full keyboard interaction/accessibility pass, comprehensive failed-request review, and deployed-site content review.

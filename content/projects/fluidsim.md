---
slug: fluidsim
title: FluidSim
tier: flagship
wing: sim
summary: Real-time 2D fluid simulation using Smoothed Particle Hydrodynamics, with the physics running entirely on the GPU via OpenGL compute shaders.
status: "C++ / GLSL — NOT IN ACTIVE DEV"
repoUrl: https://github.com/lawpeter/FluidSim
hasInteractiveDemo: false
hasCADReveal: false
order: 1
contentPending: false
---

FluidSim is a real-time fluid simulator built in C++ around Smoothed Particle
Hydrodynamics (SPH), with the entire physics step — density, pressure,
viscosity, and gravity — executing on the GPU as GLSL compute shaders backed
by OpenGL Shader Storage Buffer Objects. Spatial hashing keeps neighbor
queries at O(n), and particles render as instanced quads, color-coded by
velocity: tight pressurized splashes read differently than slow, gas-like
expansion at a glance.

The project was built collaboratively with [Owen
Poole](https://github.com/owendpoole), as much a GPGPU learning exercise as a
fluid simulator. We took Sebastian Lague's fluid-simulation video as the
starting point, read the same papers he referenced — Müller et al. (2003) and
Monaghan (1992) — and derived the SPH math ourselves. His implementation is
HLSL; we deliberately chose GLSL to learn a different shader pipeline rather
than transliterate.

The sim is interactive: mouse forces push or pull particles with configurable
strength and radius, and gravity, target density, and mouse force are all
adjustable at runtime through an ImGui panel. Frame-stepping controls allow
pausing and advancing one frame at a time for inspecting behavior.

The full control set, from the README:

| Input | Action |
| --- | --- |
| `Space` | Pause / resume |
| `.` | Step one frame (while paused) |
| `,` | Step up to 10 frames (while paused) |
| `R` | Reset particles to initial grid |
| Left mouse | Push particles away |
| Right mouse | Pull particles toward cursor |

Known limits, honestly stated: the simulation becomes unstable and can crash
above roughly 300,000 particles (root cause never identified), it's 2D only,
and further GPU-side optimizations like prefix-sum compaction were scoped out.
The project isn't in active development — it stands as finished work, not
abandoned work.

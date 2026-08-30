---
slug: fluidsim
title: FluidSim
summary: Real-time 2D fluid simulation using Smoothed Particle Hydrodynamics, with the physics running entirely on the GPU via OpenGL compute shaders.
status: complete
repoUrl: https://github.com/lawpeter/FluidSim
order: 2
---

## GPU physics pipeline

FluidSim is a real-time fluid simulator built in C++ around Smoothed Particle
Hydrodynamics (SPH), with the entire physics step executing on the GPU as GLSL
compute shaders backed by OpenGL Shader Storage Buffer Objects. That includes
density, pressure, viscosity, and gravity. Spatial hashing divides the
simulation space into cells so each particle checks nearby candidates instead
of comparing itself with every particle. Particles render as instanced quads
and are colored by velocity, so tight pressurized splashes read differently
from slow, gas-like expansion at a glance.

## Working through SPH

The project was built collaboratively with [Owen
Poole](https://github.com/owendpoole), as much a GPGPU learning exercise as a
fluid simulator. We took Sebastian Lague's fluid-simulation video as the
starting point and worked through the SPH formulation using the papers he
referenced, including Müller et al. (2003) and Monaghan (1992). His
implementation is HLSL; we chose GLSL so the project would also teach us a
different shader pipeline rather than simply translating his code.

## Interaction and inspection

The sim is interactive: mouse forces push or pull particles with configurable
strength and radius, and gravity, target density, and mouse force are all
adjustable at runtime through an ImGui panel. Frame-stepping controls allow
pausing and advancing one frame at a time for inspecting behavior.

### Controls

| Input | Action |
| --- | --- |
| `Space` | Pause / resume |
| `.` | Step one frame (while paused) |
| `,` | Step up to 10 frames (while paused) |
| `R` | Reset particles to initial grid |
| Left mouse | Push particles away |
| Right mouse | Pull particles toward cursor |

## Limits and next work

The simulation is limited to two dimensions and becomes unstable at roughly
300,000 particles; we did not identify the cause. Further GPU-side work such
as prefix-sum compaction was outside the scope of the completed project.

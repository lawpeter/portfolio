---
slug: fluidsim
title: FluidSim
collection: selected
status: COMPLETE
summary: Interactive GPU-accelerated 2D SPH fluid simulation, co-developed with Owen Poole using CPU spatial indexing and GLSL compute shaders.
order: 2
repoUrl: https://github.com/lawpeter/FluidSim
---

## Overview

FluidSim is an interactive GPU-accelerated 2D Smoothed Particle Hydrodynamics (SPH) simulation in C++. It was a learning project in SPH and GPGPU programming, built collaboratively with Owen Poole.

I initiated the project and got the initial foundation running. We then worked closely and simultaneously, discussing and developing many later technical decisions together.

## SPH Model

The fluid is represented by particles. Interactions with nearby particles contribute to density estimates, pressure forces, and viscosity. These neighborhood interactions produce the collective fluid behavior seen on screen.

## Architecture

The implementation is hybrid. Particle state needed for spatial indexing is read back to the CPU. The CPU constructs the spatial-grid indexing, uploads that data, and dispatches the SPH compute work on the GPU.

1. **Particle state → CPU readback**
2. **CPU → spatial-grid / neighbor indexing**
3. **Index data → GPU upload**
4. **GLSL compute shaders → particle update**
5. **Updated particles → rendering**

This division introduces CPU/GPU synchronization and transfer costs alongside the compute work.

## GPU Compute

GLSL compute shaders operate on particle data through OpenGL Shader Storage Buffer Objects (SSBOs). The compute work includes density, pressure, viscosity, and particle updates. Spatial indexing remains CPU-side.

## Neighbor Search

A uniform spatial grid restricts neighbor searches to nearby cells instead of testing every particle pair. Its effectiveness depends on how many particles occupy those cells; dense clusters increase the amount of work per query.

## Performance

In repeated runs on an NVIDIA RTX 5070 Ti and AMD Ryzen 9 9950X desktop, I observed roughly 290,000 particles at around 35 FPS. This was an informal performance measurement, not a controlled benchmark. Frame rate does not establish synchronization between simulation time and wall-clock time.

## Limitations

Behavior was evaluated qualitatively during development. We did not perform quantitative validation against analytical, experimental, or validated CFD reference cases.

The simulation is 2D. CPU-side indexing introduces synchronization overhead, and very high particle counts can cause instability or crashes; the root cause was not identified.

## What Would Change

Moving more grid construction and binning onto the GPU could reduce transfers and synchronization. That would be an architectural change to investigate, not an implemented feature. The project is complete, with no active development planned.

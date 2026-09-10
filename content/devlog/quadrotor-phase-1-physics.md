---
slug: quadrotor-phase-1-physics
title: "Quadrotor Phase 1: hand-written physics, RK4 first"
date: 2026-04-14
project: quadrotor
---

> Historical entry. This project is now shelved. Control and estimation were never implemented; see the project page for current scope.

Phase 1 of the quadrotor sim is physics plus a bare renderer, and I decided to
work through the theory before writing any of it. That started with RK4 — a
Wikipedia-level foundation first, then deep enough to write the integrator
myself and know why each stage exists.

With the foundations in place, I wrote the physics functions by hand. Plenty
of it was autocompleted along the way, but I went through every line to make
sure I understood it and that it was correct, then passed the code through a
review pass before accepting it. The scaffolding, CMake setup, and rendering
work is where I lean on AI assistance — the equations of motion and the
integration math stay mine.

Architecture decisions locked this session: the sim plane is XZ (+X right,
+Z up), theta = 0 is level hover with positive counter-clockwise, state is
[x, z, theta, xdot, zdot, thetadot] as an Eigen 6-vector, inputs are two raw
rotor thrusts in Newtons, and integration is fixed-timestep RK4.

One process lesson worth recording: commit your own work before letting the
AI touch it. I let edits land on top of uncommitted physics code this session,
which muddied the history — from here on, my code gets committed first, then
generated changes land as their own commits.

Next up: a basic renderer with the state vector on screen and a rigidbody
visibly moving through the scene. Then Phase 2 — control.

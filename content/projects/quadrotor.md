---
slug: quadrotor
title: Quadrotor Sim
tier: flagship
wing: sim
summary: A planar quadrotor flight-dynamics simulator in C++ — RK4 rigid-body physics written by hand, with control, sensor models, and a Kalman filter on the roadmap.
status: "C++ — SIM-ONLY / 2D / IN DEV"
repoUrl: https://github.com/lawpeter/quadrotor-sim
hasInteractiveDemo: false
hasCADReveal: false
order: 2
contentPending: false
---

The quadrotor project is a ground-up flight-dynamics simulator, currently in
its 2D simulation phase — there is no physical build yet, deliberately. The
simulator models a planar quadrotor in the XZ plane with a six-component state
vector — position, attitude, and their rates, as an Eigen matrix — driven by
two raw rotor thrust inputs in Newtons and integrated with a fixed-timestep
RK4 integrator.

The physics core is written by hand, on purpose. The equations of motion and
the RK4 step came from working through the math first — understanding the
theory before writing the functions — rather than pasting in a reference
implementation. AI assistance is used for scaffolding, build tooling, and
rendering code, under a discipline documented in the project's devlog: every
generated line gets read and understood before it's kept, and physics stays
handwritten.

The roadmap runs in phases: rigid-body physics and a bare renderer, then
control, then sensor models with a Kalman filter for state estimation — the
full GNC loop in miniature, at which point the noisy-measurement /
true-state / estimate distinction becomes the interesting part. Development
is active and logged as it happens in the devlog below.

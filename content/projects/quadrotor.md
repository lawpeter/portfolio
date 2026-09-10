---
slug: quadrotor
title: Planar Quadrotor Simulator
collection: earlier
status: SHELVED
summary: A C++ planar dynamics simulator with a six-state model, rotor-thrust inputs, fixed-step RK4 integration, and OpenGL / ImGui visualization. Controls and estimation were not implemented.
order: 4
repoUrl: https://github.com/lawpeter/quadrotor-sim
---

## Implemented Scope

I implemented a 2D planar quadrotor dynamics model in C++ using Eigen. The six-state representation contains horizontal and vertical position, attitude, and their rates. Two rotor-thrust inputs drive the equations of motion, and a fixed-step fourth-order Runge–Kutta (RK4) integrator advances the state.

OpenGL and ImGui provide visualization. This artifact is a dynamics simulator, with the physics and numerical integration forming the core of the work.

## Not Implemented

Linearization, state-space A/B matrices, an LQR controller, sensor models, and a Kalman filter / estimator were planned but never implemented. The historical devlog records the original direction, not completed controls or estimation capability.

## Why It Was Shelved

Development paused while I was studying abroad in Tokyo. Other priorities took precedence, and I did not resume the project afterward. Upcoming work on Team RoSE's URC simulator covers related simulation problems in a more relevant team context; that simulator work is still ahead.

## Retrospective

The project taught me the importance of keeping dynamics, visualization, controls, and estimation as clearly bounded scopes. In a future simulator I would establish those subsystem boundaries early, with each implemented stage understandable on its own.

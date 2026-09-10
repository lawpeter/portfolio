---
slug: keyboard
title: Custom Keyboard
collection: selected
status: ONGOING
summary: A custom 65% wireless keyboard spanning KiCad PCB design, ZMK firmware, and a self-designed enclosure through multiple physical print iterations.
order: 3
repoUrl: https://github.com/lawpeter/zmk-config
sourceLabel: Firmware Source
mechanical:
  title: Custom Keyboard Enclosure
  summary: I designed the complete enclosure around KiCad-derived PCB and switch-plate geometry, then iterated through multiple physical 3D prints. Development is ongoing.
  order: 1
# TODO: Add modelPath only after the complete enclosure/assembly GLB is supplied.
# Existing keyboard-pcb.glb is a PCB asset, not the keyboard assembly.
images:
  - src: /photos/keyboard/gadget-v1.jpg
    caption: Where it started — the 2-key copy-paste gadget, self-designed PCB in a 3D-printed housing
  - src: /photos/keyboard/keycaps.png
    caption: Keycap set in design via YUZUKeycaps — Greek-letter and math-symbol sublegends
    aspect: "2568 / 970"
---

## Overview

I designed this keyboard to bring the electronics, firmware, and physical layout into one personal build. It grew from an earlier two-key copy-paste gadget into a 65% wireless keyboard. The PCB and complete enclosure are my designs; enclosure development is ongoing.

## Hardware Architecture

The design uses a nice!nano v2 (nRF52840), a 68-key 5×14 matrix, an MCP23017 I2C expander, a nice!view display, and an EC11 rotary encoder. The rows connect to direct GPIO while the columns are scanned through the expander. The PCB, switch plate, and enclosure have to fit together as a physical assembly.

## PCB Design

I designed the schematic and PCB in KiCad and had the board fabricated by JLCPCB. Per-key diodes provide matrix isolation to prevent ghosting. Full N-key rollover has not been validated.

## Firmware

I work on the ZMK firmware and configuration for this hardware. The linked repository is **Firmware Source**; the KiCad and enclosure CAD files are not publicly hosted there.

## Enclosure / Mechanical Integration

I modeled the complete enclosure around the electronics. PCB and switch-plate geometry from the KiCad design provided reference geometry in the CAD workflow, so the enclosure could be designed around the actual board and plate interfaces.

The enclosure itself is my design. I have produced multiple 3D-print iterations to work through physical fit and integration, and the current CAD remains a functional work in progress.

## Iteration / Debugging

Physical prints provide a way to check how the enclosure, PCB, and plate come together outside CAD. Multiple enclosure versions have been printed as part of this ongoing integration work.

## Current State

The keyboard hardware and firmware remain an ongoing project. The enclosure has reached physical prototypes and is still being iterated.

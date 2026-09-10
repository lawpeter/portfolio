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
  imageIndex: 0
modelPath: /models/keyboard/keyboard-assembly.glb
images:
  - src: /photos/keyboard/enclosure-assembly.webp
    caption: Enclosure assembly from my CAD export, including top, base, switch plate, and PCB reference geometry. Active iteration; display colors are illustrative.
    aspect: "12 / 7"
  - src: /photos/keyboard/enclosure-base.webp
    caption: Current base geometry from the supplied STL. Incline angle, USB-C access, and display-window integration are still being refined.
    aspect: "12 / 7"
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

All of the current ZMK firmware works on the keyboard. The configuration includes multiple BLE host profiles, ZMK Studio remapping, encoder-controlled display modes, and a WPM typing test. The linked repository is **Firmware Source**; the KiCad and enclosure CAD files are not publicly hosted there.

## Enclosure / Mechanical Integration

I modeled the complete enclosure around the electronics. PCB and switch-plate geometry from the KiCad design provided reference geometry in the CAD workflow, so the enclosure could be designed around the actual board and plate interfaces.

The enclosure itself is my design. I have produced multiple 3D-print iterations to work through physical fit and integration, and the current CAD remains a functional work in progress.

## Iteration / Debugging

Multiple enclosure versions have been printed to check the PCB and plate interfaces in physical parts. Current refinements focus on the base incline, USB-C access, and the nice!view viewing window.

## Current State

The keyboard is operational and all current firmware works. I am finalizing the base layout, including the incline angle and USB-C port location, as well as the viewing window for the nice!view display. These mechanical details are being refined before casting or milling; that fabrication has not happened yet.

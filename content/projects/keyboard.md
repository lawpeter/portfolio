---
slug: keyboard
title: Custom Keyboard
tier: side
wing: none
summary: 65% wireless keyboard from scratch — self-designed PCB, nice!nano + MCP23017 matrix, ZMK firmware, display and encoder, keycaps in design.
status: "PCB + ZMK FIRMWARE — IN DEV"
repoUrl: https://github.com/lawpeter/zmk-config
hasInteractiveDemo: false
hasCADReveal: false
modelPath: /models/keyboard/keyboard-pcb.glb
images:
  - src: /photos/keyboard/gadget-v1.jpg
    caption: Where it started — the 2-key copy-paste gadget, self-designed PCB in a 3D-printed housing
order: 4
contentPending: false
---

This started over a year ago as a 2-key keyboard — a copy-paste gadget. I
designed the PCB myself in JLCPCB, soldered it together, and made the housing
in Onshape, 3D printed. Small, but the full loop: board design, assembly,
enclosure.

Recently I expanded the idea into a full 65% wireless board with dimensions
fit to my own requirements: a 68-key, 5×14 matrix running on a nice!nano v2
(nRF52840), with the rows on direct GPIO and the columns scanned through an
MCP23017 I2C expander — one diode per key for full N-key rollover. The
design also carries a nice!view memory-LCD display and an EC11 rotary
encoder.

The firmware is ZMK, written to fit how I actually work (config repo linked
above): multiple BLE host profiles, ZMK Studio support for runtime remapping
over USB or BLE, display modes cycled from the encoder — plus a built-in WPM
typing test. Switches are soldered; keycaps are being designed through
YUZUKeycaps, and a CAD housing case is next.

---
slug: keyboard
title: Custom Keyboard
summary: A 65% wireless keyboard with a custom PCB, nice!nano and MCP23017 matrix, ZMK firmware, display, encoder, keycaps, and a finished enclosure.
status: ongoing
repoUrl: https://github.com/lawpeter/zmk-config
modelPath: /models/keyboard/keyboard-pcb.glb
images:
  - src: /photos/keyboard/gadget-v1.jpg
    caption: The 2-key copy-paste gadget that started the project, with its custom PCB and 3D-printed housing
  - src: /photos/keyboard/keycaps.png
    caption: Keycap set designed through YUZUKeycaps with Greek-letter and math-symbol sublegends
    aspect: "2568 / 970"
order: 3
---

## From two keys to 68

This started over a year ago as a 2-key keyboard, a copy-paste gadget. I
designed the PCB in KiCad, had it fabricated by JLCPCB, soldered it together,
and modeled the enclosure in Onshape before 3D printing it. Small, but the full
loop: board design, assembly, and enclosure.

Recently I expanded the idea into a full 65% wireless board with dimensions
fit to my own requirements: a 68-key, 5×14 matrix running on a nice!nano v2
(nRF52840), with the rows on direct GPIO and the columns scanned through an
MCP23017 I2C expander. One diode per key prevents matrix ghosting. The design
also carries a nice!view memory-LCD display and an EC11 rotary encoder.

## Firmware and enclosure

The firmware is ZMK, written to fit how I actually work (config repo linked
above): multiple BLE host profiles, ZMK Studio support for runtime remapping
over USB or BLE, display modes cycled from the encoder, and a built-in WPM
typing test. Switches are soldered, the keycaps were designed through
YUZUKeycaps, and the enclosure is finished.

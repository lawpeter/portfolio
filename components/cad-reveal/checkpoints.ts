/*
 * Scroll-checkpoint config for the stair-robot CAD reveal — the PRD §6.2
 * "middle tier": adjusting these values needs no build session knowledge of
 * the component internals.
 *
 * t          scroll progress 0..1 across the pinned section
 * rotationY  model yaw in radians at that checkpoint
 * explode    0 = assembled, 1 = fully exploded (radial, computed per part)
 * label      mono callout shown near that checkpoint; anchored to the first
 *            scene node whose name matches nodePattern (case-insensitive)
 *
 * Values between checkpoints interpolate linearly; motion is damped in the
 * component so it feels physical rather than tied 1:1 to scroll jitter.
 */

export type CheckpointLabel = {
  text: string;
  nodePattern: string;
};

export type Checkpoint = {
  t: number;
  rotationY: number;
  explode: number;
  label: CheckpointLabel | null;
};

export const CHECKPOINTS: Checkpoint[] = [
  { t: 0.0, rotationY: -0.6, explode: 0, label: null },
  {
    t: 0.28,
    rotationY: 0.5,
    explode: 0,
    label: {
      text: "35-CHAIN SPIKED TRACKS",
      nodePattern: "am-4791 18T 35 Chain",
    },
  },
  {
    t: 0.55,
    rotationY: 1.5,
    explode: 0.35,
    label: {
      text: "12V WORM-GEAR DRIVE MOTORS",
      nodePattern: "Worm_Gear_Motor_12V",
    },
  },
  {
    t: 0.8,
    rotationY: 2.4,
    explode: 0.8,
    label: {
      text: "PS2 CONTROLLER RECEIVER",
      nodePattern: "Bluetooth Receiver",
    },
  },
  { t: 1.0, rotationY: 3.1, explode: 1, label: null },
];

// Half-width of the progress window in which a checkpoint's label is shown
export const LABEL_WINDOW = 0.12;

// Fraction of the model's bounding radius a fully exploded part travels
export const EXPLODE_SCALE = 0.55;

export function sampleCheckpoints(t: number): {
  rotationY: number;
  explode: number;
} {
  const cps = CHECKPOINTS;
  if (t <= cps[0].t) return cps[0];
  for (let i = 1; i < cps.length; i++) {
    if (t <= cps[i].t) {
      const a = cps[i - 1];
      const b = cps[i];
      const f = (t - a.t) / (b.t - a.t);
      return {
        rotationY: a.rotationY + (b.rotationY - a.rotationY) * f,
        explode: a.explode + (b.explode - a.explode) * f,
      };
    }
  }
  return cps[cps.length - 1];
}

export function activeLabelIndex(t: number): number {
  for (let i = 0; i < CHECKPOINTS.length; i++) {
    const cp = CHECKPOINTS[i];
    if (cp.label && Math.abs(t - cp.t) <= LABEL_WINDOW) return i;
  }
  return -1;
}

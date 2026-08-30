export const SUBSYSTEMS = [
  {
    id: "chassis",
    label: "CHASSIS",
    nodes: ["Chassis Plate", "Main Plate", "Inner Wall"],
  },
  {
    id: "movement",
    label: "MOVEMENT",
    nodes: [
      "Chain Aligners",
      "Driving Gear",
      "Worm_Gear_Motor_12V",
      "5103 Gearbox",
    ],
  },
  {
    id: "electronics",
    label: "ELECTRONICS",
    nodes: ["Arduino Uno", "Bluetooth Receiver", "Battery", "TERMINAL-"],
  },
] as const;

export const SUBSYSTEM_IDS = SUBSYSTEMS.map((subsystem) => subsystem.id);

// The exported chain meshes intersect the sprockets in the default GLB pose.
// Hide them rather than presenting mechanically incorrect geometry.
export const HIDDEN = ["am-4791 18T 35 Chain"] as const;

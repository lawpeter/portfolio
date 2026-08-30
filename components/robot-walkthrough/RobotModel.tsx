"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { HIDDEN, SUBSYSTEMS } from "./subsystems";

type MaterialState = {
  material: THREE.Material & { opacity: number };
  baseOpacity: number;
  subsystem: number | null;
};

// GLTFLoader sanitizes node names, turning spaces into underscores.
function normalizeName(value: string): string {
  return value.toLowerCase().replace(/[\s_]+/g, "");
}

function matchesAny(node: THREE.Object3D, targets: string[]): boolean {
  if (!node.name) return false;
  const name = normalizeName(node.name);
  return targets.some((target) => name.includes(target));
}

/* Every node matching a pattern contributes, not just the first. The assembly
 * repeats parts across instances: two drive motors, many gearbox and terminal
 * nodes. Matching once would light a single instance and leave its twin dim. */
function collectMeshes(
  scene: THREE.Object3D,
  patterns: readonly string[],
): Set<THREE.Mesh> {
  const targets = patterns.map(normalizeName);
  const meshes = new Set<THREE.Mesh>();

  scene.traverse((node) => {
    if (!matchesAny(node, targets)) return;
    node.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) meshes.add(child as THREE.Mesh);
    });
  });

  return meshes;
}

// Hiding a node hides its descendants, so matched ancestors are enough.
function hideMatching(scene: THREE.Object3D, patterns: readonly string[]): void {
  const targets = patterns.map(normalizeName);
  scene.traverse((node) => {
    if (matchesAny(node, targets)) node.visible = false;
  });
}

export function RobotModel({
  activeIndex,
  reducedMotion,
  modelPath,
  onLoaded,
}: {
  activeIndex: RefObject<number>;
  reducedMotion: boolean;
  modelPath: string;
  onLoaded: () => void;
}) {
  const { scene: source } = useGLTF(modelPath);
  const materialsRef = useRef<MaterialState[]>([]);

  const { scene, center, radius, materials } = useMemo(() => {
    const scene = source.clone(true);

    hideMatching(scene, HIDDEN);

    const subsystemMeshes = SUBSYSTEMS.map((subsystem) =>
      collectMeshes(scene, subsystem.nodes),
    );

    const materials: MaterialState[] = [];
    scene.traverse((node) => {
      if (!(node as THREE.Mesh).isMesh) return;
      const mesh = node as THREE.Mesh;
      const originals = Array.isArray(mesh.material)
        ? mesh.material
        : [mesh.material];
      const cloned = originals.map((material) => material.clone());
      mesh.material = Array.isArray(mesh.material) ? cloned : cloned[0];

      const subsystem = subsystemMeshes.findIndex((set) => set.has(mesh));
      cloned.forEach((material) => {
        material.transparent = true;
        const baseOpacity = material.opacity;
        const initialOpacity =
          subsystem === 0 ? baseOpacity : baseOpacity * 0.14;
        material.opacity = initialOpacity;
        material.depthWrite = initialOpacity > 0.4;
        materials.push({
          material: material as THREE.Material & { opacity: number },
          baseOpacity,
          subsystem: subsystem >= 0 ? subsystem : null,
        });
      });
    });

    scene.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    const radius = box.getSize(new THREE.Vector3()).length() / 2 || 1;
    return { scene, center, radius, materials };
  }, [source]);

  useEffect(() => {
    onLoaded();
  }, [onLoaded]);

  useEffect(() => {
    materialsRef.current = materials;
    return () => {
      materials.forEach(({ material }) => material.dispose());
      materialsRef.current = [];
    };
  }, [materials]);

  useFrame((state, delta) => {
    let settled = true;
    const selected = activeIndex.current ?? 0;

    for (const item of materialsRef.current) {
      const target =
        item.subsystem === selected ? item.baseOpacity : item.baseOpacity * 0.14;
      const next = reducedMotion
        ? target
        : THREE.MathUtils.damp(item.material.opacity, target, 8, delta);
      if (Math.abs(item.material.opacity - target) > 0.002) settled = false;
      // Three.js scenes are intentionally updated imperatively inside useFrame.
      // eslint-disable-next-line react-hooks/immutability
      item.material.opacity = next;
      item.material.depthWrite = next > 0.4;
    }

    if (!settled) state.invalidate();
  });

  const scale = 1 / radius;

  return (
    <group scale={[scale, scale, scale]}>
      <primitive
        object={scene}
        position={[-center.x, -center.y, -center.z]}
      />
    </group>
  );
}

useGLTF.preload("/models/stair-robot/stair-robot.glb");

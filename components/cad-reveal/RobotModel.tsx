"use client";

import { useMemo, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import { createPortal, useFrame } from "@react-three/fiber";
import { Html, useGLTF } from "@react-three/drei";
import {
  CHECKPOINTS,
  EXPLODE_SCALE,
  activeLabelIndex,
  sampleCheckpoints,
} from "./checkpoints";

type Part = {
  obj: THREE.Object3D;
  base: THREE.Vector3;
  // unit world-space radial direction, expressed in the part's parent space
  dirLocal: THREE.Vector3;
  // outer parts travel further, like a real exploded view
  weight: number;
};

type LabelAnchor = {
  node: THREE.Object3D;
  // label position in the anchor node's local space
  local: THREE.Vector3;
};

export function RobotModel({
  progress,
  modelPath,
}: {
  progress: RefObject<number>;
  modelPath: string;
}) {
  const { scene } = useGLTF(modelPath);
  const groupRef = useRef<THREE.Group>(null);
  const [labelIdx, setLabelIdx] = useState(-1);
  const current = useRef({
    rotationY: CHECKPOINTS[0].rotationY,
    explode: CHECKPOINTS[0].explode,
  });

  const { parts, center, radius, anchors } = useMemo(() => {
    scene.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    const radius = box.getSize(new THREE.Vector3()).length() / 2 || 1;

    const meshes: { obj: THREE.Object3D; cWorld: THREE.Vector3 }[] = [];
    let maxDist = 0;
    scene.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        const b = new THREE.Box3().setFromObject(o);
        if (b.isEmpty()) return;
        const c = b.getCenter(new THREE.Vector3());
        meshes.push({ obj: o, cWorld: c });
        maxDist = Math.max(maxDist, c.distanceTo(center));
      }
    });

    const parts: Part[] = meshes.map(({ obj, cWorld }) => {
      const dirWorld = cWorld.clone().sub(center);
      const dist = dirWorld.length();
      if (dist < 1e-6) dirWorld.set(0, 1, 0);
      else dirWorld.normalize();
      // express a world-unit displacement in the parent's local space so
      // setting obj.position moves the part radially in world terms even
      // under gltfpack's quantization scale nodes
      const parent = obj.parent ?? scene;
      const la = parent.worldToLocal(cWorld.clone());
      const lb = parent.worldToLocal(cWorld.clone().add(dirWorld));
      return {
        obj,
        base: obj.position.clone(),
        dirLocal: lb.sub(la),
        weight: 0.35 + 0.65 * (maxDist > 0 ? dist / maxDist : 0),
      };
    });

    // GLTFLoader sanitizes node names (spaces become underscores), so match
    // on lowercase forms with whitespace and underscores removed
    const norm = (s: string) => s.toLowerCase().replace(/[\s_]+/g, "");
    const anchors: (LabelAnchor | null)[] = CHECKPOINTS.map((cp) => {
      if (!cp.label) return null;
      const pattern = norm(cp.label.nodePattern);
      // first name match can be an empty transform leaf (gltfpack keeps
      // named nodes even when geometry lives on an unnamed sibling) — take
      // the first match that actually has geometry under it
      let found: THREE.Object3D | null = null;
      let box = new THREE.Box3();
      scene.traverse((o) => {
        if (found || !o.name || !norm(o.name).includes(pattern)) return;
        const b = new THREE.Box3().setFromObject(o);
        if (!b.isEmpty()) {
          found = o;
          box = b;
        }
      });
      if (!found) return null;
      const node: THREE.Object3D = found;
      const c = box.getCenter(new THREE.Vector3());
      return { node, local: node.worldToLocal(c.clone()) };
    });

    return { parts, center, radius, anchors };
  }, [scene]);

  useFrame((state, delta) => {
    const t = progress.current ?? 0;
    const target = sampleCheckpoints(t);
    const cur = current.current;
    cur.rotationY = THREE.MathUtils.damp(
      cur.rotationY,
      target.rotationY,
      6,
      delta,
    );
    cur.explode = THREE.MathUtils.damp(cur.explode, target.explode, 6, delta);

    if (groupRef.current) groupRef.current.rotation.y = cur.rotationY;
    const d = cur.explode * EXPLODE_SCALE * radius;
    for (const p of parts) {
      p.obj.position.set(
        p.base.x + p.dirLocal.x * d * p.weight,
        p.base.y + p.dirLocal.y * d * p.weight,
        p.base.z + p.dirLocal.z * d * p.weight,
      );
    }

    const idx = activeLabelIndex(t);
    if (idx !== labelIdx) setLabelIdx(idx);

    // demand frameloop: keep rendering until the damped motion settles
    const settled =
      Math.abs(cur.rotationY - target.rotationY) < 1e-3 &&
      Math.abs(cur.explode - target.explode) < 1e-3;
    if (!settled) state.invalidate();
  });

  const activeAnchor = labelIdx >= 0 ? anchors[labelIdx] : null;
  const activeLabel = labelIdx >= 0 ? CHECKPOINTS[labelIdx].label : null;

  // normalize model size: outer group scales bounding radius to 1 so the
  // fixed camera works for any export
  const s = 1 / radius;

  return (
    <group ref={groupRef} scale={[s, s, s]}>
      <group position={[-center.x, -center.y, -center.z]}>
        <primitive object={scene} />
        {activeAnchor && activeLabel &&
          createPortal(
            <Html
              position={activeAnchor.local}
              style={{ pointerEvents: "none" }}
              zIndexRange={[10, 0]}
            >
              {/* leader line + mono callout (§6.2); accent marks data */}
              <div className="flex -translate-y-full flex-col items-start">
                <span className="whitespace-nowrap border border-line bg-graphite/90 px-1 py-0.5 font-mono text-data text-accent-text">
                  {activeLabel.text}
                </span>
                <span className="ml-1 block h-4 w-px bg-accent" />
                <span className="ml-1 -mt-0.5 block size-1 -translate-x-1/2 rounded-full bg-accent" />
              </div>
            </Html>,
            activeAnchor.node,
          )}
      </group>
    </group>
  );
}

useGLTF.preload("/models/stair-robot/stair-robot.glb");

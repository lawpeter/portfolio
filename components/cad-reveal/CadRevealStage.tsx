"use client";

import { Suspense, useEffect, type RefObject } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { RobotModel } from "./RobotModel";

function InvalidateOnScroll({
  subscribe,
}: {
  subscribe: (fn: (p: number) => void) => () => void;
}) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => subscribe(() => invalidate()), [subscribe, invalidate]);
  return null;
}

// The heavy chunk: three + model. Loaded only when the section approaches
// the viewport (gate in CadReveal.tsx). Camera fixed per §6.2 — the model
// rotates, the camera holds.
export default function CadRevealStage({
  progress,
  subscribe,
  modelPath,
}: {
  progress: RefObject<number>;
  subscribe: (fn: (p: number) => void) => () => void;
  modelPath: string;
}) {
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 2]}
      camera={{ position: [1.6, 1.05, 1.6], fov: 40 }}
      // preserveDrawingBuffer keeps the canvas readable for the
      // screenshot-compare verification pass (§10); negligible cost here
      gl={{ preserveDrawingBuffer: true, antialias: true }}
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 4, 2]} intensity={1.4} />
      <directionalLight position={[-3, 2, -2]} intensity={0.4} />
      <InvalidateOnScroll subscribe={subscribe} />
      <Suspense fallback={null}>
        <RobotModel progress={progress} modelPath={modelPath} />
      </Suspense>
    </Canvas>
  );
}

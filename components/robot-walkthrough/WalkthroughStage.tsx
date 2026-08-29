"use client";

import { Suspense, useCallback, useEffect, useState, type RefObject } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { GaugeLoader } from "@/components/GaugeLoader";
import { RobotModel } from "./RobotModel";

function InvalidateOnSubsystem({
  subscribe,
}: {
  subscribe: (listener: (index: number) => void) => () => void;
}) {
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => subscribe(() => invalidate()), [invalidate, subscribe]);
  return null;
}

export default function WalkthroughStage({
  activeIndex,
  subscribe,
  reducedMotion,
  modelPath,
}: {
  activeIndex: RefObject<number>;
  subscribe: (listener: (index: number) => void) => () => void;
  reducedMotion: boolean;
  modelPath: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const handleLoaded = useCallback(() => setLoaded(true), []);

  return (
    <div className="relative aspect-square border border-line" aria-label="Interactive stair-climbing robot model">
      {!loaded && (
        <div className="pointer-events-none absolute inset-0 z-10 bg-graphite">
          <GaugeLoader label="Loading robot" />
        </div>
      )}
      <Canvas
        frameloop="demand"
        dpr={[1, 1.75]}
        camera={{ position: [1.6, 1.05, 1.6], fov: 40 }}
        gl={{ preserveDrawingBuffer: true, antialias: true }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[3, 4, 2]} intensity={1.4} />
        <directionalLight position={[-3, 2, -2]} intensity={0.4} />
        <InvalidateOnSubsystem subscribe={subscribe} />
        <Suspense fallback={null}>
          <RobotModel
            activeIndex={activeIndex}
            reducedMotion={reducedMotion}
            modelPath={modelPath}
            onLoaded={handleLoaded}
          />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} makeDefault />
      </Canvas>
    </div>
  );
}

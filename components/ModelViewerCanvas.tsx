"use client";

import { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Bounds, Html, OrbitControls, useGLTF } from "@react-three/drei";

function Model({ path, onLoaded }: { path: string; onLoaded: () => void }) {
  const { scene } = useGLTF(path);

  useEffect(() => {
    onLoaded();
  }, [onLoaded, scene]);

  return <primitive object={scene} />;
}

// Lightweight orbit viewer for any modelPath GLB (side-project tier).
// Slow auto-rotate signals "this is 3D, drag me"; zoom/pan disabled so the
// wheel never captures page scroll.
export default function ModelViewerCanvas({
  modelPath,
  autoRotate,
  onLoaded,
}: {
  modelPath: string;
  autoRotate: boolean;
  onLoaded: () => void;
}) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      frameloop={autoRotate ? "always" : "demand"}
      camera={{ position: [0.9, 0.7, 0.9], fov: 35 }}
      gl={{ preserveDrawingBuffer: true, antialias: true }}
    >
      <ambientLight intensity={1.1} />
      <directionalLight position={[2, 3, 2]} intensity={1.3} />
      <directionalLight position={[-2, 1, -1]} intensity={0.4} />
      <Suspense fallback={<Html center><span role="status" className="whitespace-nowrap font-mono text-data text-muted">Loading CAD assembly…</span></Html>}>
        <Bounds fit clip observe margin={1.15}>
          <Model path={modelPath} onLoaded={onLoaded} />
        </Bounds>
      </Suspense>
      <OrbitControls
        makeDefault
        autoRotate={autoRotate}
        autoRotateSpeed={1.1}
        enableZoom={false}
        enablePan={false}
      />
    </Canvas>
  );
}

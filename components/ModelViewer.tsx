"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { GaugeLoader } from "@/components/GaugeLoader";

const ModelViewerCanvas = dynamic(() => import("./ModelViewerCanvas"), {
  ssr: false,
});

/*
 * Lazy, touch-capable orbit viewer for the keyboard project page. The GLB is
 * requested only when the frame nears the viewport; SSR and loading retain the
 * photograph. Zoom and pan stay disabled so wheel and touch scrolling remain
 * page interactions.
 */
export function ModelViewer({
  modelPath,
  fallbackSrc,
  fallbackAlt,
  label,
}: {
  modelPath: string;
  fallbackSrc?: string;
  fallbackAlt: string;
  label: string;
}) {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const handleLoaded = useCallback(() => setLoaded(true), []);

  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      (entries) => setVisible(entries.some((e) => e.isIntersecting)),
      { rootMargin: "25% 0px" },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      role="group"
      aria-label={fallbackAlt}
      className="relative h-full w-full overflow-hidden bg-panel"
    >
      {fallbackSrc && !loaded && (
        <Image
          src={fallbackSrc}
          alt={fallbackAlt}
          fill
          sizes="(min-width: 680px) 680px, 100vw"
          className="object-cover"
        />
      )}
      {visible && (
        <div className="absolute inset-0">
          <ModelViewerCanvas
            modelPath={modelPath}
            autoRotate={!reduced}
            onLoaded={handleLoaded}
          />
          {!loaded && (
            <div className="absolute inset-0 bg-graphite/85">
              <GaugeLoader label="Loading keyboard model" />
            </div>
          )}
          {loaded && (
          <span className="pointer-events-none absolute bottom-0.5 left-0.5 font-mono text-data text-muted">
            {label}
          </span>
          )}
        </div>
      )}
    </div>
  );
}

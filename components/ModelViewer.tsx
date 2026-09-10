"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { Component, type ReactNode, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/lib/useMediaQuery";

const ModelViewerCanvas = dynamic(() => import("./ModelViewerCanvas"), {
  ssr: false,
});

// A failed model load must not take down the project writeup.
class ViewerBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

/*
 * Data-driven 3D thumb for side-project cards: desktop viewports get the
 * orbit viewer (mounted only while the card is near the viewport — the
 * canvas unmounts when scrolled away, and the GLB stays cached); smaller
 * screens and SSR get the photo fallback. Mobile islands stay a later
 * phase (§4).
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
  const desktop = useMediaQuery("(min-width: 1024px)");
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!desktop || !ref.current) return;
    const io = new IntersectionObserver(
      (entries) => setVisible(entries.some((e) => e.isIntersecting)),
      { rootMargin: "25% 0px" },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [desktop]);

  return (
    <div ref={ref} className="relative h-full w-full">
      {desktop && visible && !reduced ? (
        <>
          <ViewerBoundary key={modelPath} fallback={fallbackSrc ? <Image src={fallbackSrc} alt={fallbackAlt} fill sizes="(min-width: 1024px) 832px, 100vw" className="object-contain" /> : <p className="p-2 text-muted">CAD view unavailable.</p>}>
            <ModelViewerCanvas modelPath={modelPath} autoRotate={false} />
          </ViewerBoundary>
          <span className="pointer-events-none absolute bottom-0.5 left-0.5 font-mono text-data text-muted">
            {label}
          </span>
        </>
      ) : fallbackSrc ? (
        <Image
          src={fallbackSrc}
          alt={fallbackAlt}
          fill
          sizes="(min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      ) : null}
    </div>
  );
}

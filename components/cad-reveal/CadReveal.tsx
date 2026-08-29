"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { PhotoFrame } from "@/components/PhotoFrame";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { useScrollProgress } from "@/lib/useScrollProgress";

const CadRevealStage = dynamic(() => import("./CadRevealStage"), {
  ssr: false,
});

/*
 * §6.2 CAD scroll-reveal gate. Server render + reduced-motion + sub-desktop
 * viewports get a static poster (mobile islands are a later phase; nothing
 * may look broken meanwhile). Desktop upgrades to the pinned 3D stage after
 * mount; the three/GLB chunk loads only when the section is within ~1.5
 * viewports of the fold.
 */
export function CadReveal({
  modelPath,
  poster,
  posterCaption,
  title,
}: {
  modelPath: string;
  poster?: string;
  posterCaption: string;
  title: string;
}) {
  const desktop = useMediaQuery("(min-width: 1024px)");
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const full = desktop && !reduced;
  const { ref, progress, subscribe } = useScrollProgress<HTMLDivElement>(full);
  const [near, setNear] = useState(false);
  const hudRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!full || !ref.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "150% 0px" },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [full, ref]);

  useEffect(() => {
    if (!full) return;
    return subscribe((p) => {
      // belt-and-braces alongside the IntersectionObserver: scrolling within
      // the section always mounts the stage
      if (p > 0) setNear(true);
      if (hudRef.current) {
        hudRef.current.textContent = String(Math.round(p * 100)).padStart(
          3,
          "0",
        );
      }
    });
  }, [full, subscribe]);

  if (!full) {
    return (
      <div className="max-w-reading">
        <PhotoFrame src={poster} alt={posterCaption} fig="00" caption={posterCaption} />
      </div>
    );
  }

  return (
    <div ref={ref} className="relative h-[300vh]">
      <div className="sticky top-0 flex h-screen flex-col justify-center">
        <div className="relative h-[82vh] border border-line">
          {near && (
            <CadRevealStage
              progress={progress}
              subscribe={subscribe}
              modelPath={modelPath}
            />
          )}
          <div className="pointer-events-none absolute top-1 right-1 border border-line bg-graphite/90 px-1 py-0.5 font-mono text-data">
            <span className="text-muted">ASSEMBLY </span>
            <span ref={hudRef} className="text-accent-text">
              000
            </span>
            <span className="text-accent-text">%</span>
          </div>
          <div className="pointer-events-none absolute bottom-1 left-1 font-mono text-data text-muted">
            {title.toUpperCase()} / CAD / SCROLL TO EXPLODE
          </div>
        </div>
      </div>
    </div>
  );
}

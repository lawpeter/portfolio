"use client";

import { useCallback, useEffect, useRef } from "react";

/*
 * Maps a tall wrapper element's scroll position to 0..1 progress, written to
 * a ref — never per-frame React state. Consumers that need frame updates
 * subscribe (rAF/useFrame side); nothing re-renders on scroll.
 */
export function useScrollProgress<T extends HTMLElement>(enabled = true) {
  const ref = useRef<T | null>(null);
  const progress = useRef(0);
  const listeners = useRef(new Set<(p: number) => void>());

  useEffect(() => {
    // enabled in deps: the target element may only render after a client
    // upgrade (e.g. poster → full 3D stage), so re-attach when it flips
    const el = ref.current;
    if (!enabled || !el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p =
        total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      if (p !== progress.current) {
        progress.current = p;
        listeners.current.forEach((fn) => fn(p));
      }
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [enabled]);

  const subscribe = useCallback((fn: (p: number) => void) => {
    listeners.current.add(fn);
    return () => {
      listeners.current.delete(fn);
    };
  }, []);

  return { ref, progress, subscribe };
}

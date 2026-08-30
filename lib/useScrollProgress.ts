"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefCallback,
} from "react";

/* Tracks the ordinary document-flow section occupying the viewport center.
 * The active index lives in a ref for the 3D model and only crosses into React
 * state when a section boundary changes. Gaps latch the prior value; before
 * the first section, the first value remains active. It never clears to null. */
export function useSectionProgress(ids: readonly string[]) {
  const elements = useRef(new Map<string, HTMLElement>());
  const activeIndex = useRef(0);
  const [activeId, setActiveId] = useState(ids[0]);
  const listeners = useRef(new Set<(index: number) => void>());
  const idsKey = ids.join("|");

  const registerSection = useCallback(
    (id: string): RefCallback<HTMLElement> =>
      (node) => {
        if (node) elements.current.set(id, node);
        else elements.current.delete(id);
      },
    [],
  );

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const center = window.innerHeight / 2;
      let next = 0;

      for (let index = 0; index < ids.length; index += 1) {
        const element = elements.current.get(ids[index]);
        if (!element) continue;
        const rect = element.getBoundingClientRect();
        if (rect.top <= center) next = index;
        else break;
      }

      if (next === activeIndex.current) return;
      activeIndex.current = next;
      setActiveId(ids[next]);
      listeners.current.forEach((listener) => listener(next));
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const observer = new ResizeObserver(schedule);
    elements.current.forEach((element) => observer.observe(element));

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer.disconnect();
    };
  }, [ids, idsKey]);

  const subscribe = useCallback((listener: (index: number) => void) => {
    listeners.current.add(listener);
    return () => listeners.current.delete(listener);
  }, []);

  return { activeId, activeIndex, registerSection, subscribe };
}

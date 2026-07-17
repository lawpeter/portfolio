"use client";

import { useSyncExternalStore } from "react";

// SSR-safe media query: server snapshot is false, so pages render their
// static fallback and clients upgrade after hydration. Live-reactive to
// viewport/preference changes.
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

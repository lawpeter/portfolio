"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Fires one beacon per route view (§6.3 groundwork). sendBeacon is
// fire-and-forget and survives navigation; the endpoint no-ops until the
// database is provisioned.
export function TelemetryBeacon() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof navigator.sendBeacon !== "function") return;
    navigator.sendBeacon("/api/telemetry", JSON.stringify({ path: pathname }));
  }, [pathname]);

  return null;
}

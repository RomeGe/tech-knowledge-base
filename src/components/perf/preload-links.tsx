"use client";

import { useEffect, useCallback, useRef } from "react";

/**
 * Preloads links on hover/focus with debouncing.
 * Injects <link rel="prefetch"> into document head.
 */
export function PreloadLinks() {
  const prefetched = useRef<Set<string>>(new Set());
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const prefetch = useCallback((url: string) => {
    if (prefetched.current.has(url)) return;
    if (!url.startsWith("/") || url.startsWith("//")) return;

    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = url;
    link.as = "document";
    document.head.appendChild(link);
    prefetched.current.add(url);
  }, []);

  const handleInteraction = useCallback(
    (e: Event) => {
      const target = (e.target as HTMLElement).closest("a[href]") as HTMLAnchorElement | null;
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        prefetch(href);
      }, 200);
    },
    [prefetch],
  );

  useEffect(() => {
    document.addEventListener("mouseover", handleInteraction, { passive: true });
    document.addEventListener("focusin", handleInteraction);

    return () => {
      document.removeEventListener("mouseover", handleInteraction);
      document.removeEventListener("focusin", handleInteraction);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [handleInteraction]);

  return null;
}

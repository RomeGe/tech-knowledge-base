"use client";

import { useEffect, useRef, useCallback } from "react";

interface UseInfiniteScrollOptions {
  onLoadMore: () => void | Promise<void>;
  hasMore: boolean;
  threshold?: number;
  throttleMs?: number;
  debounceMs?: number;
}

/**
 * Performance-optimized infinite scroll hook.
 * Uses throttled scroll handler and debounced load callback.
 */
export function useInfiniteScroll({
  onLoadMore,
  hasMore,
  threshold = 200,
  throttleMs = 100,
  debounceMs = 300,
}: UseInfiniteScrollOptions) {
  const loadingRef = useRef(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const throttleTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const throttledCheck = useCallback(() => {
    if (throttleTimer.current) return;

    throttleTimer.current = setTimeout(() => {
      throttleTimer.current = undefined;
    }, throttleMs);

    if (loadingRef.current || !hasMore) return;

    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;
    const clientHeight = window.innerHeight;

    if (scrollHeight - scrollTop - clientHeight < threshold) {
      loadingRef.current = true;

      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(async () => {
        try {
          await onLoadMore();
        } finally {
          loadingRef.current = false;
        }
      }, debounceMs);
    }
  }, [onLoadMore, hasMore, threshold, throttleMs, debounceMs]);

  useEffect(() => {
    window.addEventListener("scroll", throttledCheck, { passive: true });
    window.addEventListener("resize", throttledCheck, { passive: true });
    return () => {
      window.removeEventListener("scroll", throttledCheck);
      window.removeEventListener("resize", throttledCheck);
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      if (throttleTimer.current) clearTimeout(throttleTimer.current);
    };
  }, [throttledCheck]);
}

/**
 * Sentinel component to trigger infinite scroll loading.
 */
export function InfiniteScrollSentinel({
  onLoadMore,
  hasMore,
  loading,
}: {
  onLoadMore: () => void;
  hasMore: boolean;
  loading: boolean;
}) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sentinelRef.current || !hasMore) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loading) {
          onLoadMore();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [onLoadMore, hasMore, loading]);

  if (!hasMore) return null;

  return (
    <div ref={sentinelRef} className="h-1" aria-hidden="true" />
  );
}

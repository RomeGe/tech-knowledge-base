"use client";

import { useEffect, useRef, useCallback } from "react";

interface InfiniteScrollProps {
  children: React.ReactNode;
  onLoadMore: () => void;
  hasMore: boolean;
  loading?: boolean;
  loader?: React.ReactNode;
  threshold?: number;
}

export function InfiniteScroll({
  children,
  onLoadMore,
  hasMore,
  loading = false,
  loader,
  threshold = 200,
}: InfiniteScrollProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        onLoadMore();
      }
    },
    [hasMore, loading, onLoadMore]
  );

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin: `${threshold}px`,
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [handleIntersect, threshold]);

  return (
    <div>
      {children}
      <div ref={sentinelRef} />
      {loading && (
        <div className="flex justify-center py-6">
          {loader ?? (
            <div className="flex items-center gap-2 text-sm text-text-tertiary">
              <div className="w-4 h-4 border-2 border-border border-t-accent rounded-full animate-spin" />
              加载中...
            </div>
          )}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";

interface VirtualListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  estimateItemHeight?: number;
  overscan?: number;
  className?: string;
}

export function VirtualList<T>({
  items,
  renderItem,
  estimateItemHeight = 48,
  overscan = 5,
  className = "",
}: VirtualListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [itemHeights, setItemHeights] = useState<Map<number, number>>(new Map());
  const measureRefs = useRef<Map<number, HTMLElement>>(new Map());

  // Measure container height
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      setContainerHeight(entry.contentRect.height);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Measure individual items
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      setItemHeights((prev) => {
        const next = new Map(prev);
        for (const entry of entries) {
          const index = Number((entry.target as HTMLElement).dataset.index);
          if (!isNaN(index)) {
            next.set(index, entry.contentRect.height);
          }
        }
        return next;
      });
    });

    measureRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  const getItemHeight = useCallback(
    (index: number) => itemHeights.get(index) ?? estimateItemHeight,
    [itemHeights, estimateItemHeight],
  );

  // Calculate total height and visible range
  const { totalHeight, startIndex, endIndex, offsets } = useMemo(() => {
    const offsets: number[] = [];
    let total = 0;
    for (let i = 0; i < items.length; i++) {
      offsets.push(total);
      total += getItemHeight(i);
    }

    let start = 0;
    while (start < items.length && offsets[start] + getItemHeight(start) < scrollTop) {
      start++;
    }
    start = Math.max(0, start - overscan);

    let end = start;
    while (end < items.length && offsets[end] < scrollTop + containerHeight) {
      end++;
    }
    end = Math.min(items.length - 1, end + overscan);

    return { totalHeight: total, startIndex: start, endIndex: end, offsets };
  }, [items.length, scrollTop, containerHeight, overscan, getItemHeight]);

  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
    }
  }, []);

  const visibleItems = useMemo(() => {
    const result: React.ReactNode[] = [];
    for (let i = startIndex; i <= endIndex; i++) {
      result.push(
        <div
          key={i}
          data-index={i}
          ref={(el) => {
            if (el) measureRefs.current.set(i, el);
            else measureRefs.current.delete(i);
          }}
          style={{
            position: "absolute",
            top: offsets[i],
            left: 0,
            right: 0,
          }}
        >
          {renderItem(items[i], i)}
        </div>,
      );
    }
    return result;
  }, [startIndex, endIndex, offsets, items, renderItem]);

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      onScroll={handleScroll}
      role="list"
    >
      <div style={{ position: "relative", height: totalHeight }}>
        {visibleItems}
      </div>
    </div>
  );
}

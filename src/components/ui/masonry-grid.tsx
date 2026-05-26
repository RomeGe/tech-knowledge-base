"use client";

import { useRef, useState, useEffect } from "react";

interface MasonryGridProps {
  children: React.ReactNode[];
  columns?: number;
  gap?: number;
}

export function MasonryGrid({
  children,
  columns: fixedColumns,
  gap = 16,
}: MasonryGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState(fixedColumns ?? 3);

  useEffect(() => {
    if (fixedColumns) return;
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const width = el.offsetWidth;
      if (width < 640) setColumns(1);
      else if (width < 768) setColumns(2);
      else if (width < 1024) setColumns(3);
      else setColumns(4);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [fixedColumns]);

  // Distribute children into columns for balanced heights
  const columnArrays: React.ReactNode[][] = Array.from(
    { length: columns },
    () => []
  );
  children.forEach((child, i) => {
    columnArrays[i % columns].push(child);
  });

  return (
    <div
      ref={containerRef}
      className="flex"
      style={{ gap: `${gap}px` }}
    >
      {columnArrays.map((col, colIndex) => (
        <div
          key={colIndex}
          className="flex-1 flex flex-col"
          style={{ gap: `${gap}px` }}
        >
          {col}
        </div>
      ))}
    </div>
  );
}

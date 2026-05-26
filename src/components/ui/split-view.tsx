"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface SplitViewProps {
  left: React.ReactNode;
  right: React.ReactNode;
  defaultRatio?: number;
  minRatio?: number;
}

export function SplitView({
  left,
  right,
  defaultRatio = 0.5,
  minRatio = 0.2,
}: SplitViewProps) {
  const [ratio, setRatio] = useState(defaultRatio);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const pct = (e.clientX - rect.left) / rect.width;
      setRatio(Math.max(minRatio, Math.min(1 - minRatio, pct)));
    },
    [minRatio]
  );

  const onPointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  useEffect(() => {
    window.addEventListener("pointerup", onPointerUp);
    return () => window.removeEventListener("pointerup", onPointerUp);
  }, [onPointerUp]);

  return (
    <div
      ref={containerRef}
      className="flex flex-col md:flex-row w-full h-full"
    >
      <div
        className="overflow-auto md:border-r border-border"
        style={{ flex: `${ratio} 1 0%` }}
      >
        {left}
      </div>
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        className="hidden md:block shrink-0 w-1 cursor-col-resize bg-border hover:bg-accent/30 transition-colors"
        style={{ touchAction: "none" }}
        role="separator"
      />
      <div
        className="overflow-auto md:border-l border-border"
        style={{ flex: `${1 - ratio} 1 0%` }}
      >
        {right}
      </div>
    </div>
  );
}

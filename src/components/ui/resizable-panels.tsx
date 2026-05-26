"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface ResizablePanelsProps {
  left: React.ReactNode;
  right: React.ReactNode;
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  direction?: "horizontal" | "vertical";
}

export function ResizablePanels({
  left,
  right,
  defaultSize = 50,
  minSize = 20,
  maxSize = 80,
  direction = "horizontal",
}: ResizablePanelsProps) {
  const [size, setSize] = useState(defaultSize);
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
      let pct: number;
      if (direction === "horizontal") {
        pct = ((e.clientX - rect.left) / rect.width) * 100;
      } else {
        pct = ((e.clientY - rect.top) / rect.height) * 100;
      }
      setSize(Math.max(minSize, Math.min(maxSize, pct)));
    },
    [direction, minSize, maxSize]
  );

  const onPointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  useEffect(() => {
    window.addEventListener("pointerup", onPointerUp);
    return () => window.removeEventListener("pointerup", onPointerUp);
  }, [onPointerUp]);

  const isH = direction === "horizontal";

  return (
    <div
      ref={containerRef}
      className={`flex ${isH ? "flex-row" : "flex-col"} w-full h-full`}
    >
      <div style={{ [isH ? "width" : "height"]: `${size}%` }} className="overflow-auto">
        {left}
      </div>
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        className={`shrink-0 ${
          isH
            ? "w-1 cursor-col-resize hover:bg-accent/30"
            : "h-1 cursor-row-resize hover:bg-accent/30"
        } bg-border transition-colors`}
        style={{ touchAction: "none" }}
        role="separator"
      />
      <div className="flex-1 overflow-auto">{right}</div>
    </div>
  );
}

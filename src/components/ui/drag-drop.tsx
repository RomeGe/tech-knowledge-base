"use client";

import { useState, useRef, useCallback } from "react";

interface DragDropProps<T> {
  items: T[];
  renderItem: (item: T, index: number, isDragging: boolean) => React.ReactNode;
  onReorder: (items: T[]) => void;
  keyExtractor: (item: T, index: number) => string;
}

export function DragDrop<T>({
  items,
  renderItem,
  onReorder,
  keyExtractor,
}: DragDropProps<T>) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const startY = useRef(0);

  const onPointerDown = useCallback((e: React.PointerEvent, index: number) => {
    startY.current = e.clientY;
    setDragIndex(index);
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (dragIndex === null) return;
      // Determine which item we're hovering over
      const container = (e.currentTarget as HTMLElement).parentElement;
      if (!container) return;
      const rects = Array.from(container.children).map((c) =>
        c.getBoundingClientRect()
      );
      const midY = e.clientY;
      let newOver = dragIndex;
      for (let i = 0; i < rects.length; i++) {
        if (midY < rects[i].top + rects[i].height / 2) {
          newOver = i;
          break;
        }
        newOver = i;
      }
      setOverIndex(newOver);
    },
    [dragIndex]
  );

  const onPointerUp = useCallback(() => {
    if (dragIndex !== null && overIndex !== null && dragIndex !== overIndex) {
      const next = [...items];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(overIndex, 0, moved);
      onReorder(next);
    }
    setDragIndex(null);
    setOverIndex(null);
  }, [dragIndex, overIndex, items, onReorder]);

  return (
    <div className="flex flex-col">
      {items.map((item, i) => {
        const isDragging = dragIndex === i;
        const showBefore = overIndex !== null && dragIndex !== null && overIndex === i && i < dragIndex;
        const showAfter = overIndex !== null && dragIndex !== null && overIndex === i && i > dragIndex;

        return (
          <div key={keyExtractor(item, i)}>
            {showBefore && (
              <div className="h-0.5 bg-accent rounded-full mx-2" />
            )}
            <div
              onPointerDown={(e) => onPointerDown(e, i)}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              className={`transition-opacity ${
                isDragging ? "opacity-50 cursor-grabbing" : "cursor-grab"
              }`}
              style={{ touchAction: "none" }}
            >
              {renderItem(item, i, isDragging)}
            </div>
            {showAfter && (
              <div className="h-0.5 bg-accent rounded-full mx-2" />
            )}
          </div>
        );
      })}
    </div>
  );
}

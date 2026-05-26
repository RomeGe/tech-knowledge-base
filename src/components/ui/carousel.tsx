"use client";

import { useState, useCallback, useEffect, useRef } from "react";

interface CarouselProps {
  items: React.ReactNode[];
  autoPlay?: boolean;
  interval?: number;
}

export function Carousel({
  items,
  autoPlay = false,
  interval = 4000,
}: CarouselProps) {
  const [current, setCurrent] = useState(0);
  const pointerStart = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const prev = useCallback(
    () => setCurrent((i) => (i - 1 + items.length) % items.length),
    [items.length]
  );

  const next = useCallback(
    () => setCurrent((i) => (i + 1) % items.length),
    [items.length]
  );

  useEffect(() => {
    if (!autoPlay) return;
    const id = setInterval(next, interval);
    return () => clearInterval(id);
  }, [autoPlay, interval, next]);

  const onPointerDown = (e: React.PointerEvent) => {
    pointerStart.current = e.clientX;
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (pointerStart.current === null) return;
    const diff = pointerStart.current - e.clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev();
    }
    pointerStart.current = null;
  };

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-lg"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      <div
        className="flex transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {items.map((item, i) => (
          <div key={i} className="w-full shrink-0">
            {item}
          </div>
        ))}
      </div>

      {/* Prev/Next buttons */}
      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
        aria-label="上一个"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
        aria-label="下一个"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === current ? "bg-white" : "bg-white/40"
            }`}
            aria-label={`第 ${i + 1} 项`}
          />
        ))}
      </div>
    </div>
  );
}

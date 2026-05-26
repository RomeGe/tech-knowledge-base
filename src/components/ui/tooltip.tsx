"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

type Position = "top" | "bottom" | "left" | "right";

interface TooltipProps {
  content: React.ReactNode;
  position?: Position;
  delay?: number;
  children: React.ReactNode;
}

export function Tooltip({
  content,
  position = "top",
  delay = 200,
  children,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const show = useCallback(() => {
    timerRef.current = setTimeout(() => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      const gap = 8;
      let top = 0;
      let left = 0;

      switch (position) {
        case "top":
          top = rect.top - gap;
          left = rect.left + rect.width / 2;
          break;
        case "bottom":
          top = rect.bottom + gap;
          left = rect.left + rect.width / 2;
          break;
        case "left":
          top = rect.top + rect.height / 2;
          left = rect.left - gap;
          break;
        case "right":
          top = rect.top + rect.height / 2;
          left = rect.right + gap;
          break;
      }

      setCoords({ top, left });
      setVisible(true);
    }, delay);
  }, [position, delay]);

  const hide = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(false);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const transform =
    position === "top"
      ? "translate(-50%, -100%)"
      : position === "bottom"
      ? "translate(-50%, 0)"
      : position === "left"
      ? "translate(-100%, -50%)"
      : "translate(0, -50%)";

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        className="inline-block"
      >
        {children}
      </div>
      {visible &&
        createPortal(
          <div
            className="fixed z-[250] px-2.5 py-1.5 text-xs text-white bg-gray-900 rounded shadow-md pointer-events-none whitespace-nowrap"
            style={{ top: coords.top, left: coords.left, transform }}
          >
            {content}
          </div>,
          document.body
        )}
    </>
  );
}

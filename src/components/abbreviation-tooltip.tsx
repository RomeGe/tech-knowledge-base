"use client";

import { useState, useRef, useEffect } from "react";

interface AbbreviationProps {
  abbr: string;
  title: string;
  children?: React.ReactNode;
}

// Abbreviation with tooltip showing full form on hover
export function Abbreviation({ abbr, title, children }: AbbreviationProps) {
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleEnter = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setShow(true), 300);
  };

  const handleLeave = () => {
    clearTimeout(timeoutRef.current);
    setShow(false);
  };

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return (
    <span ref={ref as React.RefObject<HTMLSpanElement>} className="relative inline-block">
      <abbr
        title={title}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onFocus={handleEnter}
        onBlur={handleLeave}
        className="underline decoration-dotted underline-offset-2 cursor-help text-text-primary"
      >
        {children ?? abbr}
      </abbr>
      {show && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-surface border border-border rounded-md shadow-sm text-xs text-text-secondary whitespace-nowrap z-50">
          <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-border" />
          {title}
        </span>
      )}
    </span>
  );
}

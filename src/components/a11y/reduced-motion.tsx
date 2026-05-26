"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Hook that detects prefers-reduced-motion user preference.
 */
export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return reducedMotion;
}

/**
 * Wrapper component that conditionally renders animated content.
 * When reduced motion is preferred, renders children without animation wrapper.
 */
export function MotionSafe({
  children,
  fallback,
  className = "",
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <>{fallback ?? children}</>;
  }

  return <div className={className}>{children}</div>;
}

"use client";

import { useEffect, useCallback } from "react";

/**
 * Hook that prevents body scroll when active.
 * Useful for modals, menus, and overlays.
 */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;

    document.body.style.overflow = "hidden";
    // Compensate for scrollbar width to prevent layout shift
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
    };
  }, [active]);
}

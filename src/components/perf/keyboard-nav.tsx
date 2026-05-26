"use client";

import { useState, useCallback } from "react";

/**
 * Enhanced keyboard navigation hook for list-style UIs.
 * Returns focused index and key event handlers.
 */
export function useKeyboardNav(itemCount: number) {
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setFocusedIndex((prev) => (prev < itemCount - 1 ? prev + 1 : 0));
          break;
        case "ArrowUp":
          e.preventDefault();
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : itemCount - 1));
          break;
        case "Home":
          e.preventDefault();
          setFocusedIndex(0);
          break;
        case "End":
          e.preventDefault();
          setFocusedIndex(itemCount - 1);
          break;
        case "Escape":
          setFocusedIndex(-1);
          break;
      }
    },
    [itemCount],
  );

  const selectIndex = useCallback((index: number) => {
    setFocusedIndex(index);
  }, []);

  const reset = useCallback(() => {
    setFocusedIndex(-1);
  }, []);

  return { focusedIndex, handleKeyDown, selectIndex, reset };
}

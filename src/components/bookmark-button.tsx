"use client";

import { useState, useEffect } from "react";
import { isBookmarked, toggleBookmark } from "@/lib/bookmarks";

export function BookmarkButton({ id }: { id: string }) {
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    setBookmarked(isBookmarked(id));
  }, [id]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newState = toggleBookmark(id);
    setBookmarked(newState);
  };

  return (
    <button
      onClick={handleToggle}
      className="p-1 text-text-tertiary hover:text-accent transition-colors"
      aria-label={bookmarked ? "取消收藏" : "收藏"}
    >
      <svg
        className="w-4 h-4"
        fill={bookmarked ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
        />
      </svg>
    </button>
  );
}

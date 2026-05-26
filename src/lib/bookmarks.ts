"use client";

const STORAGE_KEY = "tech-kb-bookmarks";

export function getBookmarks(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleBookmark(id: string): boolean {
  if (typeof window === "undefined") return false;
  const bookmarks = getBookmarks();
  const index = bookmarks.indexOf(id);
  if (index === -1) {
    bookmarks.push(id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
    return true;
  } else {
    bookmarks.splice(index, 1);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
    return false;
  }
}

export function isBookmarked(id: string): boolean {
  return getBookmarks().includes(id);
}

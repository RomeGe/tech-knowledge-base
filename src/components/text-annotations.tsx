"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface Annotation {
  id: string;
  text: string;
  startOffset: number;
  endOffset: number;
  color: string;
  note: string;
  createdAt: number;
}

const STORAGE_PREFIX = "tech-kb-annotations-";
const COLORS = ["#fef08a", "#bbf7d0", "#bfdbfe", "#fbcfe8", "#ddd6fe"];

function loadAnnotations(articleId: string): Annotation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + articleId);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAnnotations(articleId: string, items: Annotation[]) {
  localStorage.setItem(STORAGE_PREFIX + articleId, JSON.stringify(items));
}

function nextColor(existing: Annotation[]): string {
  const counts = COLORS.map(
    (c) => existing.filter((a) => a.color === c).length
  );
  const minIdx = counts.indexOf(Math.min(...counts));
  return COLORS[minIdx];
}

// Get the full plain text content of a container element
function getFullText(container: HTMLElement): string {
  let text = "";
  const walker = document.createTreeWalker(
    container,
    NodeFilter.SHOW_TEXT
  );
  let node: Node | null;
  while ((node = walker.nextNode())) {
    text += node.textContent || "";
  }
  return text;
}

// Get the plain text offset of a DOM node+offset relative to container
function getTextOffset(
  container: HTMLElement,
  targetNode: Node,
  targetOffset: number
): number {
  let offset = 0;
  const walker = document.createTreeWalker(
    container,
    NodeFilter.SHOW_TEXT
  );
  let node: Node | null;
  while ((node = walker.nextNode())) {
    if (node === targetNode) {
      return offset + targetOffset;
    }
    offset += (node.textContent || "").length;
  }
  return offset;
}

// Remove existing highlight overlays from container
function removeHighlights(container: HTMLElement) {
  const existing = container.querySelectorAll("[data-annotation-highlight]");
  existing.forEach((el) => {
    const parent = el.parentNode;
    if (!parent) return;
    while (el.firstChild) parent.insertBefore(el.firstChild, el);
    parent.removeChild(el);
    parent.normalize();
  });
}

// Apply highlight spans to container text based on annotations
function applyHighlights(container: HTMLElement, annotations: Annotation[]) {
  removeHighlights(container);
  if (annotations.length === 0) return;

  const sorted = [...annotations].sort((a, b) => a.startOffset - b.startOffset);
  let globalOffset = 0;
  const walker = document.createTreeWalker(
    container,
    NodeFilter.SHOW_TEXT
  );
  let textNode: Node | null;
  let skipNext = false;

  while ((textNode = walker.nextNode())) {
    // Skip the last node we inserted in the previous iteration
    if (skipNext) {
      skipNext = false;
      globalOffset += (textNode.textContent || "").length;
      continue;
    }

    const nodeText = textNode.textContent || "";
    const nodeLen = nodeText.length;
    const nodeStart = globalOffset;
    const nodeEnd = globalOffset + nodeLen;

    // Find annotations that overlap with this text node
    const overlapping = sorted.filter(
      (a) => a.startOffset < nodeEnd && a.endOffset > nodeStart
    );

    if (overlapping.length > 0) {
      const parent = textNode.parentNode;
      if (!parent) {
        globalOffset += nodeLen;
        continue;
      }

      // Build segments: split this text node by annotation boundaries
      const boundaries = new Set<number>([0, nodeLen]);
      for (const ann of overlapping) {
        const localStart = Math.max(0, ann.startOffset - nodeStart);
        const localEnd = Math.min(nodeLen, ann.endOffset - nodeStart);
        boundaries.add(localStart);
        boundaries.add(localEnd);
      }

      const sortedBounds = [...boundaries].sort((a, b) => a - b);
      const fragment = document.createDocumentFragment();
      let lastInserted: ChildNode | null = null;

      for (let i = 0; i < sortedBounds.length - 1; i++) {
        const segStart = sortedBounds[i];
        const segEnd = sortedBounds[i + 1];
        const segText = nodeText.slice(segStart, segEnd);

        // Find which annotation covers this segment
        const covering = overlapping.find((a) => {
          const localStart = Math.max(0, a.startOffset - nodeStart);
          const localEnd = Math.min(nodeLen, a.endOffset - nodeStart);
          return segStart >= localStart && segEnd <= localEnd;
        });

        if (covering) {
          const span = document.createElement("span");
          span.setAttribute("data-annotation-highlight", covering.id);
          span.style.backgroundColor = covering.color;
          span.style.borderRadius = "2px";
          span.style.padding = "1px 0";
          span.style.cursor = "pointer";
          span.style.position = "relative";
          span.title = covering.note || covering.text;
          span.textContent = segText;
          fragment.appendChild(span);
          lastInserted = span;
        } else {
          const tn = document.createTextNode(segText);
          fragment.appendChild(tn);
          lastInserted = tn;
        }
      }

      parent.insertBefore(fragment, textNode);
      parent.removeChild(textNode);

      // Reposition walker to last inserted node so it continues correctly
      if (lastInserted) {
        walker.currentNode = lastInserted;
        skipNext = true;
      }
      globalOffset += nodeLen;
    } else {
      globalOffset += nodeLen;
    }
  }
}

export function TextAnnotations({
  articleId,
  children,
}: {
  articleId: string;
  children: React.ReactNode;
}) {
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [showPanel, setShowPanel] = useState(false);
  const [toolbar, setToolbar] = useState<{
    x: number;
    y: number;
    text: string;
    startOffset: number;
    endOffset: number;
  } | null>(null);
  const [noteInput, setNoteInput] = useState("");
  const articleRef = useRef<HTMLDivElement>(null);

  // Load annotations from localStorage on mount
  useEffect(() => {
    setAnnotations(loadAnnotations(articleId));
  }, [articleId]);

  // Apply highlight overlay whenever annotations or content change
  useEffect(() => {
    const el = articleRef.current;
    if (!el) return;
    // Small delay to let React render settle
    const timer = setTimeout(() => applyHighlights(el, annotations), 50);
    return () => clearTimeout(timer);
  }, [annotations, children]);

  // Handle text selection for new annotation
  const handleSelectionChange = useCallback(() => {
    const sel = window.getSelection();
    if (
      !sel ||
      sel.isCollapsed ||
      !sel.rangeCount ||
      !sel.toString().trim()
    ) {
      return;
    }

    const range = sel.getRangeAt(0);
    const container = articleRef.current;
    if (
      !container ||
      !container.contains(range.startContainer) ||
      !container.contains(range.endContainer)
    ) {
      return;
    }

    const fullText = getFullText(container);
    const start = getTextOffset(container, range.startContainer, range.startOffset);
    const end = getTextOffset(container, range.endContainer, range.endOffset);

    if (start === end) return;

    const rect = range.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    setToolbar({
      x: rect.left - containerRect.left + rect.width / 2,
      y: rect.top - containerRect.top - 10,
      text: fullText.slice(start, end),
      startOffset: start,
      endOffset: end,
    });
    setNoteInput("");
  }, []);

  useEffect(() => {
    document.addEventListener("selectionchange", handleSelectionChange);
    return () =>
      document.removeEventListener("selectionchange", handleSelectionChange);
  }, [handleSelectionChange]);

  // Dismiss toolbar on outside click
  useEffect(() => {
    if (!toolbar) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-annotation-toolbar]")) {
        setToolbar(null);
        window.getSelection()?.removeAllRanges();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [toolbar]);

  const addAnnotation = () => {
    if (!toolbar) return;
    const newAnnotation: Annotation = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      text: toolbar.text,
      startOffset: toolbar.startOffset,
      endOffset: toolbar.endOffset,
      color: nextColor(annotations),
      note: noteInput.trim(),
      createdAt: Date.now(),
    };
    const updated = [...annotations, newAnnotation];
    setAnnotations(updated);
    saveAnnotations(articleId, updated);
    setToolbar(null);
    window.getSelection()?.removeAllRanges();
  };

  const removeAnnotation = (id: string) => {
    const updated = annotations.filter((a) => a.id !== id);
    setAnnotations(updated);
    saveAnnotations(articleId, updated);
  };

  return (
    <div className="relative">
      {/* Article content with selection handler */}
      <div ref={articleRef} className="relative">
        {children}
      </div>

      {/* Floating toolbar for adding annotation */}
      {toolbar && (
        <div
          data-annotation-toolbar
          className="absolute z-50 bg-surface border border-border rounded-lg shadow-lg p-3 w-64"
          style={{
            left: Math.max(0, toolbar.x - 128),
            top: Math.max(0, toolbar.y - 80),
          }}
        >
          <p className="text-xs text-text-tertiary mb-2 line-clamp-2">
            &ldquo;{toolbar.text.slice(0, 60)}
            {toolbar.text.length > 60 ? "..." : ""}&rdquo;
          </p>
          <input
            type="text"
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            placeholder="添加笔记 (可选)"
            className="w-full px-2 py-1 text-xs border border-border rounded bg-muted text-text-primary placeholder:text-text-tertiary mb-2 focus:outline-none focus:border-accent"
            onKeyDown={(e) => e.key === "Enter" && addAnnotation()}
          />
          <div className="flex gap-2">
            <button
              onClick={addAnnotation}
              className="flex-1 px-2 py-1 text-xs bg-accent text-white rounded hover:opacity-90 transition-opacity"
            >
              标注
            </button>
            <button
              onClick={() => setToolbar(null)}
              className="px-2 py-1 text-xs border border-border rounded text-text-tertiary hover:text-text-primary transition-colors"
            >
              取消
            </button>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="mt-4 flex items-center gap-1.5 text-xs text-text-tertiary hover:text-accent transition-colors"
      >
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
          />
        </svg>
        {annotations.length > 0
          ? `${annotations.length} 条标注`
          : "标注文章"}
      </button>

      {/* Annotations panel */}
      {showPanel && (
        <div className="mt-3 p-3 bg-muted border border-border rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-text-tertiary font-medium">
              文章标注
            </span>
            <button
              onClick={() => setShowPanel(false)}
              className="text-text-tertiary hover:text-text-primary transition-colors"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {annotations.length === 0 ? (
            <p className="text-xs text-text-tertiary">
              选中文章中的文字即可添加标注。
            </p>
          ) : (
            <ul className="space-y-2">
              {annotations.map((ann) => (
                <li
                  key={ann.id}
                  className="flex items-start gap-2 text-xs group"
                >
                  <span
                    className="w-3 h-3 rounded-sm shrink-0 mt-0.5"
                    style={{ backgroundColor: ann.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-text-secondary line-clamp-2">
                      {ann.text}
                    </p>
                    {ann.note && (
                      <p className="text-text-tertiary mt-0.5 italic">
                        {ann.note}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => removeAnnotation(ann.id)}
                    className="shrink-0 text-text-tertiary hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    aria-label="删除标注"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

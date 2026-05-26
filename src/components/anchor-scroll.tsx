"use client";

import { useCallback } from "react";

// Generate a URL-friendly slug from heading text
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// Heading wrapper that adds an anchor link; clicking scrolls and updates hash
export function AnchorHeading({
  level = 2,
  id: explicitId,
  children,
  className = "",
}: {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  // Extract text content for slug generation
  const textContent =
    typeof children === "string"
      ? children
      : Array.isArray(children)
        ? children
            .map((c) => (typeof c === "string" ? c : ""))
            .join("")
        : "";

  const id = explicitId || slugify(textContent);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", `#${id}`);
      }
    },
    [id]
  );

  const sizeClasses: Record<number, string> = {
    1: "text-2xl",
    2: "text-xl",
    3: "text-lg",
    4: "text-base",
    5: "text-sm",
    6: "text-xs",
  };
  const sizeClass = sizeClasses[level] ?? "text-xl";

  const anchorLink = (
    <a
      href={`#${id}`}
      onClick={handleClick}
      className="absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-text-tertiary hover:text-accent no-underline"
      aria-label={`Link to ${textContent}`}
    >
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.386-3.04a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L5.25 8.688"
        />
      </svg>
    </a>
  );

  const cls = `group relative ${sizeClass} font-medium text-text-primary ${className}`;

  if (level === 1) return <h1 id={id} className={cls}>{anchorLink}{children}</h1>;
  if (level === 2) return <h2 id={id} className={cls}>{anchorLink}{children}</h2>;
  if (level === 3) return <h3 id={id} className={cls}>{anchorLink}{children}</h3>;
  if (level === 4) return <h4 id={id} className={cls}>{anchorLink}{children}</h4>;
  if (level === 5) return <h5 id={id} className={cls}>{anchorLink}{children}</h5>;
  return <h6 id={id} className={cls}>{anchorLink}{children}</h6>;
}

// Standalone anchor link icon that can be placed next to any heading
export function AnchorLink({
  id,
  className = "",
}: {
  id: string;
  className?: string;
}) {
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", `#${id}`);
      }
    },
    [id]
  );

  return (
    <a
      href={`#${id}`}
      onClick={handleClick}
      className={`inline-flex items-center ml-1.5 text-text-tertiary hover:text-accent opacity-0 group-hover:opacity-100 transition-opacity no-underline ${className}`}
      aria-label={`Link to section ${id}`}
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
          d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.386-3.04a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L5.25 8.688"
        />
      </svg>
    </a>
  );
}

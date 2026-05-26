"use client";

/**
 * FocusIndicator wraps interactive elements with proper focus-visible styling.
 * The actual :focus-visible rule is in globals.css.
 * This component provides a wrapper for programmatic focus management.
 */
export function FocusIndicator({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`focus-within:outline-2 focus-within:outline-accent focus-within:outline-offset-2 ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * VisuallyHidden hides content visually while keeping it accessible
 * to screen readers. Equivalent to Tailwind's sr-only class.
 */
export function VisuallyHidden({ children }: { children: React.ReactNode }) {
  return <span className="sr-only">{children}</span>;
}

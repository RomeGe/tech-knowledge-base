import Link from "next/link";

interface NavArticle {
  slug: string;
  title: string;
}

// Previous/Next article navigation at bottom of article page
export function PrevNextNav({
  prev,
  next,
}: {
  prev?: NavArticle | null;
  next?: NavArticle | null;
}) {
  if (!prev && !next) return null;

  return (
    <nav
      className="mt-12 pt-6 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-4"
      aria-label="Article navigation"
    >
      {prev ? (
        <Link
          href={`/articles/${prev.slug}`}
          className="group flex flex-col gap-1 p-3 rounded-lg border border-border hover:border-text-tertiary hover:bg-surface-hover transition-colors"
        >
          <span className="text-xs text-text-tertiary flex items-center gap-1">
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
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
            Previous
          </span>
          <span className="text-sm text-text-primary group-hover:text-accent transition-colors line-clamp-2">
            {prev.title}
          </span>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          href={`/articles/${next.slug}`}
          className="group flex flex-col items-end gap-1 p-3 rounded-lg border border-border hover:border-text-tertiary hover:bg-surface-hover transition-colors text-right"
        >
          <span className="text-xs text-text-tertiary flex items-center gap-1">
            Next
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
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </span>
          <span className="text-sm text-text-primary group-hover:text-accent transition-colors line-clamp-2">
            {next.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}

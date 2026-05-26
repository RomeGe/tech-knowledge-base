import Link from "next/link";

interface SeriesArticle {
  slug: string;
  title: string;
  part: number;
}

// "Part of a series" component showing list of articles with current highlighted
export function ArticleSeries({
  seriesName,
  articles,
  currentSlug,
}: {
  seriesName: string;
  articles: SeriesArticle[];
  currentSlug: string;
}) {
  return (
    <div className="my-8 p-4 bg-muted border border-border rounded-lg">
      <div className="text-xs text-text-tertiary mb-3 uppercase tracking-wider">
        Part of a series
      </div>
      <h4 className="text-sm font-medium text-text-primary mb-3">
        {seriesName}
      </h4>
      <ol className="space-y-1.5 list-none pl-0">
        {[...articles]
          .sort((a, b) => a.part - b.part)
          .map((article) => {
            const isCurrent = article.slug === currentSlug;
            return (
              <li key={article.slug} className="flex items-start gap-2">
                <span className="text-xs text-text-tertiary font-mono mt-0.5 shrink-0 w-5 text-right">
                  {article.part}.
                </span>
                {isCurrent ? (
                  <span className="text-sm text-accent font-medium">
                    {article.title}
                    <span className="text-xs text-text-tertiary ml-1.5">
                      (current)
                    </span>
                  </span>
                ) : (
                  <Link
                    href={`/articles/${article.slug}`}
                    className="text-sm text-text-secondary hover:text-accent transition-colors"
                  >
                    {article.title}
                  </Link>
                )}
              </li>
            );
          })}
      </ol>
    </div>
  );
}

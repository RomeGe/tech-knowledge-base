// Unified diff viewer showing additions (green) and deletions (red)
export function CodeDiffView({
  diff,
  language,
}: {
  diff: string;
  language?: string;
}) {
  const lines = diff.split("\n");

  return (
    <div className="my-4 rounded-lg border border-border overflow-hidden">
      {language && (
        <div className="flex items-center gap-2 px-3 py-2 bg-muted border-b border-border text-xs text-text-tertiary">
          {language}
        </div>
      )}
      <div className="overflow-x-auto">
        {lines.map((line, i) => {
          let bgClass = "";
          let prefix = " ";
          let lineColor = "text-text-primary";

          if (line.startsWith("+")) {
            bgClass = "bg-emerald-500/8 dark:bg-emerald-400/8";
            prefix = "+";
            lineColor = "text-emerald-700 dark:text-emerald-400";
          } else if (line.startsWith("-")) {
            bgClass = "bg-red-500/8 dark:bg-red-400/8";
            prefix = "-";
            lineColor = "text-red-700 dark:text-red-400";
          } else if (line.startsWith("@@")) {
            bgClass = "bg-accent-subtle";
            lineColor = "text-accent";
          }

          return (
            <div
              key={i}
              className={`flex leading-6 ${bgClass} hover:brightness-95 transition-colors`}
            >
              {/* Prefix gutter */}
              <span
                className={`flex-none w-8 text-center text-sm font-mono select-none ${lineColor}`}
              >
                {prefix}
              </span>
              {/* Line content */}
              <pre className={`flex-1 px-2 text-sm font-mono m-0 ${lineColor}`}>
                <code>{line.length > 0 ? line.slice(1) : " "}</code>
              </pre>
            </div>
          );
        })}
      </div>
    </div>
  );
}

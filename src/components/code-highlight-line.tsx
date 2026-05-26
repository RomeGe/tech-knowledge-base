// Highlights specific lines in a code block by applying background highlight
export function CodeHighlightLine({
  code,
  highlightLines = [],
  language,
}: {
  code: string;
  highlightLines?: number[];
  language?: string;
}) {
  const lines = code.split("\n");
  const lineCount = lines.length;
  const gutterWidth = String(lineCount).length;
  const highlightSet = new Set(highlightLines);

  return (
    <div className="my-4 rounded-lg border border-border overflow-hidden">
      {language && (
        <div className="flex items-center gap-2 px-3 py-2 bg-muted border-b border-border text-xs text-text-tertiary">
          {language}
        </div>
      )}
      <div className="flex">
        {/* Line number gutter */}
        <div
          className="flex-none py-3 pr-3 pl-4 text-right select-none border-r border-border bg-muted"
          style={{ minWidth: `${gutterWidth + 2}rem` }}
        >
          {lines.map((_, i) => {
            const lineNum = i + 1;
            return (
              <div
                key={i}
                className={`text-xs leading-6 font-mono ${
                  highlightSet.has(lineNum)
                    ? "text-accent font-medium"
                    : "text-text-tertiary"
                }`}
              >
                {lineNum}
              </div>
            );
          })}
        </div>

        {/* Code lines */}
        <div className="flex-1 overflow-x-auto py-3">
          {lines.map((line, i) => {
            const lineNum = i + 1;
            const isHighlighted = highlightSet.has(lineNum);
            return (
              <div
                key={i}
                className={`px-4 leading-6 ${
                  isHighlighted
                    ? "bg-accent-subtle border-l-2 border-accent"
                    : ""
                }`}
              >
                <pre className="text-sm font-mono text-text-primary m-0">
                  <code>{line || " "}</code>
                </pre>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

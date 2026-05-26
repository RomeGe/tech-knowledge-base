// Wraps a code block to add line numbers in a gutter column
export function CodeLineNumbers({
  children,
  code,
}: {
  children?: React.ReactNode;
  code?: string;
}) {
  const text = code ?? (typeof children === "string" ? children : "");
  const lines = text.split("\n");
  const lineCount = lines.length;
  const gutterWidth = String(lineCount).length;

  return (
    <div className="my-4 rounded-lg border border-border overflow-hidden">
      <div className="flex">
        {/* Line number gutter */}
        <div
          className="flex-none py-4 pr-3 pl-4 text-right select-none border-r border-border bg-muted"
          style={{ minWidth: `${gutterWidth + 2}rem` }}
        >
          {lines.map((_, i) => (
            <div
              key={i}
              className="text-xs leading-6 text-text-tertiary font-mono"
            >
              {i + 1}
            </div>
          ))}
        </div>
        {/* Code content */}
        <div className="flex-1 overflow-x-auto py-4 px-4 bg-surface">
          <pre className="text-sm leading-6 font-mono text-text-primary m-0">
            <code>{text}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}

// Variant that wraps pre-existing code content with line numbers
export function CodeWithLineNumbers({ code, language }: { code: string; language?: string }) {
  const lines = code.split("\n");
  const lineCount = lines.length;
  const gutterWidth = String(lineCount).length;

  return (
    <div className="my-4 rounded-lg border border-border overflow-hidden">
      {language && (
        <div className="flex items-center gap-2 px-3 py-2 bg-muted border-b border-border text-xs text-text-tertiary">
          {language}
        </div>
      )}
      <div className="flex">
        <div
          className="flex-none py-3 pr-3 pl-4 text-right select-none border-r border-border bg-muted"
          style={{ minWidth: `${gutterWidth + 2}rem` }}
        >
          {lines.map((_, i) => (
            <div key={i} className="text-xs leading-6 text-text-tertiary font-mono">
              {i + 1}
            </div>
          ))}
        </div>
        <div className="flex-1 overflow-x-auto py-3 px-4">
          <pre className="text-sm leading-6 font-mono text-text-primary m-0">
            <code>{code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}

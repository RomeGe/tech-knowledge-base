// Renders highlighted text with accent background (==text== syntax)
export function HighlightText({ children }: { children: React.ReactNode }) {
  return (
    <mark className="bg-accent-subtle text-text-primary px-0.5 rounded-sm">
      {children}
    </mark>
  );
}

// Parse text containing ==highlighted== segments and render as JSX
export function parseHighlights(text: string): React.ReactNode[] {
  const parts = text.split(/(==.+?==)/g);
  return parts.map((part, i) => {
    if (part.startsWith("==") && part.endsWith("==")) {
      return <HighlightText key={i}>{part.slice(2, -2)}</HighlightText>;
    }
    return part;
  });
}

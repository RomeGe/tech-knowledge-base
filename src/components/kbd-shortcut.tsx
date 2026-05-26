// Renders keyboard shortcut with proper key styling
export function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex items-center justify-center min-w-[1.5em] px-1.5 py-0.5 text-xs font-mono text-text-secondary bg-muted border border-border rounded shadow-[0_1px_0_var(--border)]">
      {children}
    </kbd>
  );
}

// Renders a keyboard shortcut combination (e.g. Ctrl+K)
export function KbdShortcut({ keys }: { keys: string[] }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {keys.map((key, i) => (
        <span key={i} className="inline-flex items-center gap-0.5">
          <Kbd>{key}</Kbd>
          {i < keys.length - 1 && (
            <span className="text-text-tertiary text-xs">+</span>
          )}
        </span>
      ))}
    </span>
  );
}

// Parse shortcut strings like "Ctrl+K" or "Cmd+Shift+P"
export function parseShortcutString(shortcut: string) {
  const keys = shortcut.split("+").map((k) => k.trim());
  return <KbdShortcut keys={keys} />;
}

// Superscript component (^text^ syntax)
export function Superscript({ children }: { children: React.ReactNode }) {
  return (
    <sup className="text-[0.7em] leading-none text-text-secondary align-super">
      {children}
    </sup>
  );
}

// Subscript component (~text~ syntax)
export function Subscript({ children }: { children: React.ReactNode }) {
  return (
    <sub className="text-[0.7em] leading-none text-text-secondary align-sub">
      {children}
    </sub>
  );
}

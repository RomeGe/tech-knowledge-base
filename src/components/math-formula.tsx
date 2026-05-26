// Basic LaTeX-to-HTML math formula converter
// Handles: Greek letters, fractions, superscripts, subscripts, square roots, integrals, summations

const GREEK_MAP: Record<string, string> = {
  alpha: "α",
  beta: "β",
  gamma: "γ",
  delta: "δ",
  epsilon: "ε",
  zeta: "ζ",
  eta: "η",
  theta: "θ",
  iota: "ι",
  kappa: "κ",
  lambda: "λ",
  mu: "μ",
  nu: "ν",
  xi: "ξ",
  pi: "π",
  rho: "ρ",
  sigma: "σ",
  tau: "τ",
  phi: "φ",
  chi: "χ",
  psi: "ψ",
  omega: "ω",
  Gamma: "Γ",
  Delta: "Δ",
  Theta: "Θ",
  Lambda: "Λ",
  Xi: "Ξ",
  Pi: "Π",
  Sigma: "Σ",
  Phi: "Φ",
  Psi: "Ψ",
  Omega: "Ω",
  infty: "∞",
  partial: "∂",
  nabla: "∇",
  forall: "∀",
  exists: "∃",
  in: "∈",
  notin: "∉",
  subset: "⊂",
  supset: "⊃",
  subseteq: "⊆",
  supseteq: "⊇",
  cup: "∪",
  cap: "∩",
  pm: "±",
  mp: "∓",
  times: "×",
  cdot: "·",
  div: "÷",
  neq: "≠",
  approx: "≈",
  leq: "≤",
  geq: "≥",
  ll: "≪",
  gg: "≫",
  leftarrow: "←",
  rightarrow: "→",
  Leftarrow: "⇐",
  Rightarrow: "⇒",
  leftrightarrow: "↔",
  ldots: "…",
  cdots: "⋯",
  vdots: "⋮",
  ddots: "⋱",
  sum: "∑",
  prod: "∏",
  int: "∫",
  iint: "∬",
  iiint: "∭",
  oint: "∮",
  sqrt: "√",
  sin: "sin",
  cos: "cos",
  tan: "tan",
  log: "log",
  ln: "ln",
  lim: "lim",
  max: "max",
  min: "min",
};

// Convert LaTeX string to HTML string
function latexToHtml(latex: string): string {
  let result = latex;

  // Replace \frac{a}{b} with (a)/(b) styled
  result = result.replace(
    /\\frac\{([^}]*)\}\{([^}]*)\}/g,
    '<span class="inline-flex flex-col items-center mx-0.5"><span class="border-b border-text-primary px-1 text-sm">$1</span><span class="px-1 text-sm">$2</span></span>'
  );

  // Replace \sqrt{x}
  result = result.replace(
    /\\sqrt\{([^}]*)\}/g,
    '<span class="inline-flex items-center"><span class="text-lg leading-none mr-px">√</span><span class="border-t border-text-primary px-0.5">$1</span></span>'
  );

  // Replace \text{...}
  result = result.replace(
    /\\text\{([^}]*)\}/g,
    '<span class="not-italic font-sans">$1</span>'
  );

  // Replace \mathbf{...}
  result = result.replace(
    /\\mathbf\{([^}]*)\}/g,
    '<span class="font-bold">$1</span>'
  );

  // Replace \mathrm{...}
  result = result.replace(
    /\\mathrm\{([^}]*)\}/g,
    '<span class="not-italic">$1</span>'
  );

  // Replace \quad and \qquad
  result = result.replace(/\\qquad/g, '<span class="inline-block w-8"/>');
  result = result.replace(/\\quad/g, '<span class="inline-block w-4"/>');

  // Replace Greek letters and symbols
  for (const [cmd, char] of Object.entries(GREEK_MAP)) {
    result = result.replace(new RegExp(`\\\\${cmd}\\b`, "g"), char);
  }

  // Replace superscripts: ^{...} or ^x
  result = result.replace(
    /\^\{([^}]*)\}/g,
    '<sup class="text-[0.7em] align-super">$1</sup>'
  );
  result = result.replace(
    /\^(\w)/g,
    '<sup class="text-[0.7em] align-super">$1</sup>'
  );

  // Replace subscripts: _{...} or _x
  result = result.replace(
    /_\{([^}]*)\}/g,
    '<sub class="text-[0.7em] align-sub">$1</sub>'
  );
  result = result.replace(
    /_(\w)/g,
    '<sub class="text-[0.7em] align-sub">$1</sub>'
  );

  // Replace remaining backslash commands
  result = result.replace(/\\\\/g, "");
  result = result.replace(/\\[,;!]/g, "");

  // Replace operators
  result = result.replace(/\*/g, "×");

  return result;
}

// Inline math: $...$
function InlineMath({ formula }: { formula: string }) {
  return (
    <span
      className="inline-block mx-0.5 font-mono text-text-primary italic align-middle"
      dangerouslySetInnerHTML={{ __html: latexToHtml(formula) }}
    />
  );
}

// Block math: $$...$$
function BlockMath({ formula }: { formula: string }) {
  return (
    <div className="my-6 px-4 py-3 overflow-x-auto text-center bg-muted rounded-lg border border-border-subtle">
      <span
        className="inline-block font-mono text-text-primary text-lg italic"
        dangerouslySetInnerHTML={{ __html: latexToHtml(formula) }}
      />
    </div>
  );
}

// Main component: renders math formula
export function MathFormula({
  formula,
  block = false,
}: {
  formula: string;
  block?: boolean;
}) {
  const trimmed = formula.trim();
  if (block) {
    return <BlockMath formula={trimmed} />;
  }
  return <InlineMath formula={trimmed} />;
}

// Parse text containing $...$ and $$...$$ math expressions
export function parseMathExpressions(text: string): React.ReactNode[] {
  const parts = text.split(/(\$\$[\s\S]*?\$\$|\$[^$\n]+?\$)/g);
  return parts.map((part, i) => {
    if (part.startsWith("$$") && part.endsWith("$$")) {
      return <MathFormula key={i} formula={part.slice(2, -2)} block />;
    }
    if (part.startsWith("$") && part.endsWith("$")) {
      return <MathFormula key={i} formula={part.slice(1, -1)} />;
    }
    return part;
  });
}

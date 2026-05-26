"use client";

type Variant = "spinner" | "dots" | "pulse";
type Size = "sm" | "md" | "lg";

interface LoadingStateProps {
  variant?: Variant;
  size?: Size;
  label?: string;
}

const sizeMap: Record<Size, string> = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-10 h-10",
};

const dotSizeMap: Record<Size, string> = {
  sm: "w-1.5 h-1.5",
  md: "w-2 h-2",
  lg: "w-3 h-3",
};

export function LoadingState({
  variant = "spinner",
  size = "md",
  label,
}: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      {variant === "spinner" && (
        <div
          className={`${sizeMap[size]} border-2 border-border border-t-accent rounded-full animate-spin`}
        />
      )}

      {variant === "dots" && (
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`${dotSizeMap[size]} rounded-full bg-accent animate-pulse`}
              style={{ animationDelay: `${i * 200}ms` }}
            />
          ))}
        </div>
      )}

      {variant === "pulse" && (
        <div
          className={`${sizeMap[size]} rounded-lg bg-accent/40 animate-pulse`}
        />
      )}

      {label && <p className="text-sm text-text-tertiary">{label}</p>}
    </div>
  );
}

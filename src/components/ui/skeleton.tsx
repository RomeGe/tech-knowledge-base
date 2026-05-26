"use client";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: "text" | "circle" | "rect";
  className?: string;
}

export function Skeleton({
  width,
  height,
  variant = "text",
  className = "",
}: SkeletonProps) {
  const base = "bg-muted animate-pulse";

  const variantClass =
    variant === "circle"
      ? "rounded-full"
      : variant === "rect"
      ? "rounded-lg"
      : "rounded";

  const style: React.CSSProperties = {};
  if (width !== undefined) style.width = typeof width === "number" ? `${width}px` : width;
  if (height !== undefined) style.height = typeof height === "number" ? `${height}px` : height;

  // Default sizes
  if (variant === "text" && !height) style.height = "1em";
  if (variant === "circle" && !width && !height) {
    style.width = "40px";
    style.height = "40px";
  }

  return (
    <div
      className={`${base} ${variantClass} ${className}`}
      style={style}
    />
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";

export function ImageLightbox({
  src,
  alt,
  children,
}: {
  src: string;
  alt: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  return (
    <>
      <div onClick={() => setOpen(true)} className="cursor-zoom-in">
        {children}
      </div>
      {open && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-8"
          onClick={close}
        >
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </>
  );
}

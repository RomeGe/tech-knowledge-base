"use client";

import { useEffect, useCallback, useState } from "react";
import { createPortal } from "react-dom";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "danger";
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = "确认",
  cancelLabel = "取消",
  variant = "default",
}: ConfirmDialogProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    },
    [onCancel]
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onKeyDown]);

  if (!isOpen || !mounted) return null;

  const confirmBtnClass =
    variant === "danger"
      ? "bg-red-600 hover:bg-red-700 text-white"
      : "bg-accent hover:bg-accent-hover text-white";

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative w-full max-w-sm mx-4 bg-surface border border-border rounded-lg shadow-xl overflow-hidden">
        <div className="px-6 py-5">
          <h3 className="text-base font-medium text-text-primary mb-2">
            {title}
          </h3>
          <p className="text-sm text-text-secondary">{message}</p>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-muted/50">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-text-secondary border border-border rounded-lg hover:bg-surface-hover transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${confirmBtnClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

"use client";

import { useState, useEffect } from "react";

export function ServiceWorkerRegister() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    const register = async () => {
      try {
        const reg = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
        setRegistration(reg);

        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing;
          if (!newWorker) return;

          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "activated" && navigator.serviceWorker.controller) {
              setUpdateAvailable(true);
            }
          });
        });
      } catch {
        // Service worker registration failed — non-critical
      }
    };

    register();

    // Check for updates periodically
    const interval = setInterval(() => {
      registration?.update().catch(() => {});
    }, 60 * 60 * 1000); // every hour

    return () => clearInterval(interval);
  }, []);

  const applyUpdate = () => {
    registration?.waiting?.postMessage({ type: "SKIP_WAITING" });
    window.location.reload();
  };

  if (!updateAvailable) return null;

  return (
    <div
      className="fixed bottom-4 left-4 z-50 bg-surface border border-border rounded-lg shadow-lg p-4 flex items-center gap-3 max-w-sm"
      role="alert"
    >
      <p className="text-sm text-text-primary flex-1">A new version is available.</p>
      <button
        onClick={applyUpdate}
        className="px-3 py-1.5 text-sm bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors"
      >
        Update
      </button>
      <button
        onClick={() => setUpdateAvailable(false)}
        className="text-text-tertiary hover:text-text-primary"
        aria-label="Dismiss"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

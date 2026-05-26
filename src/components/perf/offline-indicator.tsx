"use client";

import { useState, useEffect } from "react";

export function OfflineIndicator() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    setOffline(!navigator.onLine);

    const handleOffline = () => setOffline(true);
    const handleOnline = () => setOffline(false);

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  if (!offline) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[90] bg-amber-500 text-black text-center py-2 text-sm font-medium"
      role="alert"
      aria-live="assertive"
    >
      You are currently offline. Some features may be unavailable.
    </div>
  );
}

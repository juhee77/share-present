"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export type ToastType = "success" | "info" | "error";

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Floating Toast Container */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none w-full max-w-sm px-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            onClick={() => removeToast(t.id)}
            className={`pointer-events-auto px-4 py-3 rounded-2xl shadow-2xl border flex items-center gap-2.5 text-xs font-semibold backdrop-blur-md transition-all duration-300 animate-fade-in ${
              t.type === "success"
                ? "bg-[#1f2e24]/95 border-[#3b4d40] text-[#f2f7f4]"
                : t.type === "error"
                ? "bg-rose-950/95 border-rose-800 text-rose-100"
                : "bg-[#181818]/95 border-[#333] text-white"
            }`}
          >
            <span className="text-sm">
              {t.type === "success" ? "✨" : t.type === "error" ? "⚠️" : "✦"}
            </span>
            <span className="flex-1 leading-snug">{t.message}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeToast(t.id);
              }}
              className="text-white/50 hover:text-white text-xs ml-1"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    // Fallback if rendered outside provider
    return {
      showToast: (message: string) => {
        if (typeof window !== "undefined") {
          console.log("[Toast]", message);
        }
      },
    };
  }
  return context;
}

"use client";

import React, { createContext, useContext, useState } from "react";

export interface Toast {
  id: string;
  type: "success" | "danger" | "info" | "warning";
  title: string;
  message: string;
  timestamp: string;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (
    title: string,
    message: string,
    type?: Toast["type"]
  ) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  function showToast(
    title: string,
    message: string,
    type: Toast["type"] = "info"
  ) {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: Toast = {
      id,
      title,
      message,
      type,
      timestamp: "Just now",
    };

    setToasts((prev) => [newToast, ...prev.slice(0, 4)]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }

  function removeToast(id: string) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  const typeStyles = {
    success: {
      bg: "bg-emerald-50 border-emerald-300 text-emerald-950",
      icon: "✓",
      badge: "bg-emerald-600 text-white",
    },
    danger: {
      bg: "bg-rose-50 border-rose-300 text-rose-950",
      icon: "🚨",
      badge: "bg-rose-600 text-white",
    },
    warning: {
      bg: "bg-amber-50 border-amber-300 text-amber-950",
      icon: "⚠️",
      badge: "bg-amber-600 text-white",
    },
    info: {
      bg: "bg-blue-50 border-blue-300 text-blue-950",
      icon: "ℹ️",
      badge: "bg-blue-600 text-white",
    },
  };

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}

      {/* Floating Notifications Hub */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          const style = typeStyles[toast.type];
          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border shadow-xl backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-5 ${style.bg}`}
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-xs font-black shadow-xs ${style.badge}`}
              >
                {style.icon}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold leading-snug">
                    {toast.title}
                  </h4>
                  <span className="text-[10px] opacity-60">
                    {toast.timestamp}
                  </span>
                </div>
                <p className="text-[11px] opacity-80 mt-0.5 leading-tight">
                  {toast.message}
                </p>
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="text-xs opacity-40 hover:opacity-100 transition-opacity ml-1"
                aria-label="Dismiss"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

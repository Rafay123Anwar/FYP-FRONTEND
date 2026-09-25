import React, { createContext, useCallback, useContext, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextType {
  toast: (opts: Omit<Toast, "id">) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const ICONS: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0" />,
  error:   <AlertCircle  className="w-4.5 h-4.5 text-rose-500 shrink-0" />,
  info:    <Info         className="w-4.5 h-4.5 text-blue-500 shrink-0" />,
  warning: <AlertTriangle className="w-4.5 h-4.5 text-amber-500 shrink-0" />,
};

const STYLES: Record<ToastType, string> = {
  success: "border-l-4 border-emerald-500 bg-white dark:bg-slate-800",
  error:   "border-l-4 border-rose-500 bg-white dark:bg-slate-800",
  info:    "border-l-4 border-blue-500 bg-white dark:bg-slate-800",
  warning: "border-l-4 border-amber-500 bg-white dark:bg-slate-800",
};

const ToastItem: React.FC<{ toast: Toast; onRemove: (id: string) => void }> = ({ toast, onRemove }) => {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const exitTimer = setTimeout(() => setExiting(true), (toast.duration ?? 4000) - 300);
    const removeTimer = setTimeout(() => onRemove(toast.id), toast.duration ?? 4000);
    return () => { clearTimeout(exitTimer); clearTimeout(removeTimer); };
  }, [toast, onRemove]);

  return (
    <div
      className={cn(
        "flex items-start gap-3 px-4 py-3.5 rounded-xl shadow-elevated min-w-[300px] max-w-[400px]",
        STYLES[toast.type],
        exiting ? "animate-toast-out" : "animate-toast-in"
      )}
    >
      <div className="mt-0.5">{ICONS[toast.type]}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{toast.title}</p>
        {toast.description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{toast.description}</p>
        )}
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors shrink-0 mt-0.5"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((opts: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev.slice(-4), { ...opts, id }]);
  }, []);

  const success = useCallback((title: string, description?: string) => toast({ type: "success", title, description }), [toast]);
  const error   = useCallback((title: string, description?: string) => toast({ type: "error",   title, description }), [toast]);
  const info    = useCallback((title: string, description?: string) => toast({ type: "info",    title, description }), [toast]);
  const warning = useCallback((title: string, description?: string) => toast({ type: "warning", title, description }), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, info, warning }}>
      {children}
      {createPortal(
        <div id="toast-container">
          {toasts.map((t) => (
            <ToastItem key={t.id} toast={t} onRemove={removeToast} />
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};

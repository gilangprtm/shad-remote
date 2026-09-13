import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { ToastController, ToastOptions } from "../contracts/notifications";
import { cn } from "../lib/cn";

type ToastItem = ToastOptions & { id: string };
const NotificationContext = createContext<ToastController | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const dismiss = useCallback((id: string) => setItems((current) => current.filter((item) => item.id !== id)), []);
  const controller = useMemo<ToastController>(() => ({
    show: (options) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      setItems((current) => [...current, { ...options, id }]);
      if (options.duration !== 0) window.setTimeout(() => dismiss(id), options.duration ?? 4000);
      return id;
    },
    dismiss,
    dismissAll: () => setItems([]),
  }), [dismiss]);
  return <NotificationContext.Provider value={controller}>{children}<Toaster items={items} onDismiss={dismiss} /></NotificationContext.Provider>;
}

export function Toaster({ items, onDismiss }: { items: ToastItem[]; onDismiss: (id: string) => void }) {
  return <div className="fixed right-4 top-4 z-[60] grid w-[min(24rem,calc(100vw-2rem))] gap-2">{items.map((item) => <div role="status" key={item.id} className={cn("rounded-lg border bg-background p-4 text-sm shadow-md", item.variant === "error" && "border-destructive text-destructive")}><div className="flex items-start justify-between gap-3"><div><strong>{item.title}</strong>{item.description && <p className="mt-1 text-muted-foreground">{item.description}</p>}</div><button type="button" aria-label="Dismiss notification" onClick={() => onDismiss(item.id)}>×</button></div></div>)}</div>;
}

export function useToast() { const controller = useContext(NotificationContext); if (!controller) throw new Error("useToast must be used inside NotificationProvider"); return controller; }

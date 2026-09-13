import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../lib/cn";

const focusableSelector = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex=\"-1\"])",
].join(",");

type OverlayProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  side?: "center" | "right" | "bottom";
  closeOnOverlayClick?: boolean;
};

function OverlayFrame({ open, onOpenChange, title, children, side = "center", closeOnOverlayClick = true }: OverlayProps) {
  const panelRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusPanel = () => {
      const first = panelRef.current?.querySelector<HTMLElement>(focusableSelector);
      (first ?? panelRef.current)?.focus();
    };
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onOpenChange(false);
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>(focusableSelector));
      if (focusable.length === 0) {
        event.preventDefault();
        panelRef.current.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const frame = requestAnimationFrame(focusPanel);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus();
      previousFocusRef.current = null;
    };
  }, [onOpenChange, open]);

  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-50 bg-black/40" onMouseDown={() => closeOnOverlayClick && onOpenChange(false)}>
      <section
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onMouseDown={(event) => event.stopPropagation()}
        className={cn(
          "absolute bg-background p-6 shadow-lg outline-none",
          side === "center" && "left-1/2 top-1/2 w-[min(32rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-lg",
          side === "right" && "right-0 top-0 h-full w-[min(28rem,100vw)]",
          side === "bottom" && "bottom-0 left-0 w-full rounded-t-lg",
        )}
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 id={titleId} className="font-semibold">{title}</h2>
          <button type="button" aria-label="Close" className="rounded-md px-2 py-1 text-muted-foreground hover:bg-muted" onClick={() => onOpenChange(false)}>×</button>
        </div>
        {children}
      </section>
    </div>,
    document.body,
  );
}

export function Dialog({ open, onOpenChange, title, children }: { open: boolean; onOpenChange: (open: boolean) => void; title: string; children: ReactNode }) {
  return <OverlayFrame open={open} onOpenChange={onOpenChange} title={title}>{children}</OverlayFrame>;
}

export function AlertDialog({ open, onOpenChange, title, description, confirmLabel = "Confirm", onConfirm, children }: { open: boolean; onOpenChange: (open: boolean) => void; title: string; description?: ReactNode; confirmLabel?: string; onConfirm?: () => void; children?: ReactNode }) {
  return <OverlayFrame open={open} onOpenChange={onOpenChange} title={title} closeOnOverlayClick={false}><div className="grid gap-4">{description && <p className="text-sm text-muted-foreground">{description}</p>}{children}<div className="flex justify-end gap-2"><button type="button" className="rounded-md border px-3 py-2 text-sm" onClick={() => onOpenChange(false)}>Cancel</button><button type="button" className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground" onClick={() => { onConfirm?.(); onOpenChange(false); }}>{confirmLabel}</button></div></div></OverlayFrame>;
}

export function Drawer({ open, onOpenChange, title, children }: { open: boolean; onOpenChange: (open: boolean) => void; title: string; children: ReactNode }) { return <OverlayFrame open={open} onOpenChange={onOpenChange} title={title} side="right">{children}</OverlayFrame>; }
export function Sheet({ open, onOpenChange, title, children }: { open: boolean; onOpenChange: (open: boolean) => void; title: string; children: ReactNode }) { return <OverlayFrame open={open} onOpenChange={onOpenChange} title={title} side="bottom">{children}</OverlayFrame>; }

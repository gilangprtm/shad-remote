import type { HTMLAttributes, ReactNode } from "react";
import { useState } from "react";
import { cn } from "../../lib/cn";

export function Direction({ dir = "ltr", children, className, ...props }: HTMLAttributes<HTMLDivElement> & { dir?: "ltr" | "rtl" | "auto"; children: ReactNode }) {
  return <div dir={dir} className={cn(className)} {...props}>{children}</div>;
}

export function Empty({ title = "Nothing here yet", description, action, className, ...props }: HTMLAttributes<HTMLDivElement> & { title?: ReactNode; description?: ReactNode; action?: ReactNode }) {
  return <div className={cn("grid justify-items-center gap-2 rounded-lg border border-dashed p-8 text-center", className)} {...props}><h3 className="font-medium">{title}</h3>{description && <p className="max-w-md text-sm text-muted-foreground">{description}</p>}{action}</div>;
}

export function HoverCard({ trigger, children, openDelay = 150, className }: { trigger: ReactNode; children: ReactNode; openDelay?: number; className?: string }) {
  const [open, setOpen] = useState(false);
  let timer: number | undefined;
  const show = () => { timer = window.setTimeout(() => setOpen(true), openDelay); };
  const hide = () => { if (timer) window.clearTimeout(timer); setOpen(false); };
  return <span className="relative inline-flex" onMouseEnter={show} onMouseLeave={hide} onFocus={() => setOpen(true)} onBlur={hide}><span tabIndex={0} aria-expanded={open}>{trigger}</span>{open && <div role="dialog" className={cn("absolute left-0 top-full z-40 mt-2 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md", className)}>{children}</div>}</span>;
}

export function Marker({ children, color = "currentColor", className, ...props }: HTMLAttributes<HTMLElement> & { color?: string; children?: ReactNode }) {
  return <mark style={{ color }} className={cn("rounded-sm bg-transparent font-medium underline decoration-2 underline-offset-2", className)} {...props}>{children}</mark>;
}

export function Message({ title, children, variant = "default", className, ...props }: HTMLAttributes<HTMLDivElement> & { title?: ReactNode; variant?: "default" | "error" | "success" }) {
  return <div role={variant === "error" ? "alert" : "status"} className={cn("rounded-lg border p-4 text-sm", variant === "error" && "border-destructive text-destructive", variant === "success" && "border-green-600/40", className)} {...props}>{title && <strong className="block">{title}</strong>}{children}</div>;
}

export function MessageScroller({ messages, className }: { messages: ReactNode[]; className?: string }) {
  return <div aria-live="polite" className={cn("grid max-h-64 gap-2 overflow-auto", className)}>{messages.map((message, index) => <div key={index}>{message}</div>)}</div>;
}

export function Typography({ as: Element = "p", children, className, ...props }: HTMLAttributes<HTMLElement> & { as?: "p" | "h1" | "h2" | "h3" | "blockquote" | "code"; children?: ReactNode }) {
  return <Element className={cn(Element === "h1" && "text-3xl font-semibold", Element === "h2" && "text-2xl font-semibold", Element === "h3" && "text-xl font-semibold", Element === "blockquote" && "border-l-2 pl-4 italic", Element === "code" && "rounded bg-muted px-1 py-0.5 font-mono text-sm", className)} {...props}>{children}</Element>;
}

export function Calendar({ value, onChange, min, max, className }: { value?: string; onChange?: (value: string) => void; min?: string; max?: string; className?: string }) {
  return <input type="date" value={value ?? ""} min={min} max={max} onChange={(event) => onChange?.(event.target.value)} aria-label="Calendar date" className={cn("h-9 rounded-md border border-input bg-background px-3 text-sm", className)} />;
}

export function Toast({ title, description, onDismiss }: { title: ReactNode; description?: ReactNode; onDismiss?: () => void }) {
  return <div role="status" className="rounded-lg border bg-background p-4 text-sm shadow-md"><div className="flex items-start justify-between gap-3"><div><strong>{title}</strong>{description && <p className="mt-1 text-muted-foreground">{description}</p>}</div>{onDismiss && <button type="button" aria-label="Dismiss notification" onClick={onDismiss}>×</button>}</div></div>;
}

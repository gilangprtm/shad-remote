import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";

export function Spinner({ className, ...props }: HTMLAttributes<HTMLSpanElement>) { return <span role="status" aria-label="Loading" className={cn("inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent", className)} {...props} />; }
export function Kbd({ className, ...props }: HTMLAttributes<HTMLElement>) { return <kbd className={cn("rounded border bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground", className)} {...props} />; }
export function KbdGroup({ children, className, ...props }: HTMLAttributes<HTMLSpanElement>) { return <span className={cn("inline-flex items-center gap-1", className)} {...props}>{children}</span>; }
export function AspectRatio({ ratio = 16 / 9, children, className }: { ratio?: number; children: ReactNode; className?: string }) { return <div className={cn("relative w-full", className)} style={{ aspectRatio: ratio }}>{children}</div>; }
export function ScrollArea({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) { return <div className={cn("overflow-auto", className)} {...props}>{children}</div>; }
export function Item({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) { return <div className={cn("flex items-center gap-3 rounded-lg p-3", className)} {...props}>{children}</div>; }
export function Field({ label, description, children, className }: { label?: ReactNode; description?: ReactNode; children: ReactNode; className?: string }) { return <div className={cn("grid gap-2", className)}>{label && <div className="text-sm font-medium">{label}</div>}{children}{description && <div className="text-xs text-muted-foreground">{description}</div>}</div>; }
export function NativeSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) { return <select {...props} className={cn("h-9 rounded-md border border-input bg-background px-3 text-sm", props.className)} />; }

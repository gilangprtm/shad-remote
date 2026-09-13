import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";

export function Alert({ title, children, variant = "default", className, ...props }: HTMLAttributes<HTMLDivElement> & { title?: ReactNode; variant?: "default" | "destructive" }) {
  return <div role="alert" className={cn("grid gap-1 rounded-lg border p-4 text-sm", variant === "destructive" ? "border-destructive/40 text-destructive" : "bg-muted/40", className)} {...props}>{title && <h5 className="font-medium">{title}</h5>}{children}</div>;
}

export function AlertDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

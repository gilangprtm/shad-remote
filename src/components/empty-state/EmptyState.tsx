import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export function EmptyState({ title, description, action, className }: { title: string; description?: string; action?: ReactNode; className?: string }) {
  return <div className={cn("flex min-h-40 flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-6 text-center", className)}><h3 className="font-medium">{title}</h3>{description && <p className="max-w-md text-sm text-muted-foreground">{description}</p>}{action}</div>;
}

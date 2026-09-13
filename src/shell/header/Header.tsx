import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export function Header({ title, actions, children, className }: { title?: ReactNode; actions?: ReactNode; children?: ReactNode; className?: string }) {
  return <header className={cn("flex min-h-14 items-center justify-between gap-4 border-b bg-background px-6 py-3", className)}><div>{title}</div><div className="flex items-center gap-2">{children}{actions}</div></header>;
}

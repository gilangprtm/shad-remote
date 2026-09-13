import { useState, type ReactNode } from "react";
import { cn } from "../../lib/cn";

export function Tooltip({ content, children, className }: { content: ReactNode; children: ReactNode; className?: string }) {
  const [open, setOpen] = useState(false);
  return <span className="relative inline-flex" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}><span onFocus={() => setOpen(true)} onBlur={() => setOpen(false)}>{children}</span>{open && <span role="tooltip" className={cn("absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2.5 py-1.5 text-xs text-background shadow-sm", className)}>{content}</span>}</span>;
}

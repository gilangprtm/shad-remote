import { useState, type ReactNode } from "react";
import { cn } from "../../lib/cn";

export function Popover({ trigger, children, className }: { trigger: ReactNode; children: ReactNode; className?: string }) {
  const [open, setOpen] = useState(false);
  return <span className="relative inline-flex"><span onClick={() => setOpen(!open)}>{trigger}</span>{open && <span role="dialog" className={cn("absolute left-0 top-full z-50 mt-2 w-72 rounded-lg border bg-popover p-4 text-popover-foreground shadow-md", className)}>{children}</span>}</span>;
}

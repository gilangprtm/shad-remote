import { cloneElement, isValidElement, useId, useState, type ReactElement, type ReactNode } from "react";
import { cn } from "../../lib/cn";

export function Popover({ trigger, children, className }: { trigger: ReactNode; children: ReactNode; className?: string }) {
  const [open, setOpen] = useState(false);
  const contentId = useId();
  const triggerElement = isValidElement(trigger)
    ? cloneElement(trigger as ReactElement<{ onClick?: () => void; "aria-expanded"?: boolean; "aria-controls"?: string }>, { onClick: () => setOpen((value) => !value), "aria-expanded": open, "aria-controls": contentId })
    : <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls={contentId}>{trigger}</button>;
  return <span className="relative inline-flex">{triggerElement}{open && <span id={contentId} role="dialog" className={cn("absolute left-0 top-full z-50 mt-2 w-72 rounded-lg border bg-popover p-4 text-popover-foreground shadow-md", className)}>{children}</span>}</span>;
}

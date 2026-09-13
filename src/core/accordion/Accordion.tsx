import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export function Accordion({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("w-full", className)}>{children}</div>;
}
export function AccordionItem({ value, disabled = false, children, className }: { value: string; disabled?: boolean; children: ReactNode; className?: string }) {
  return <details data-value={value} aria-disabled={disabled || undefined} className={cn("border-b", disabled && "pointer-events-none opacity-50", className)}>{children}</details>;
}
export function AccordionTrigger({ children, className }: { children: ReactNode; className?: string }) {
  return <summary className={cn("flex cursor-pointer list-none items-center justify-between py-4 font-medium [&::-webkit-details-marker]:hidden", className)}>{children}<span aria-hidden="true">+</span></summary>;
}
export function AccordionContent({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("pb-4 text-sm text-muted-foreground", className)}>{children}</div>;
}

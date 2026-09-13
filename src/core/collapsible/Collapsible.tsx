import type { ReactNode } from "react";

export function Collapsible({ children, open, defaultOpen = false }: { children: ReactNode; open?: boolean; defaultOpen?: boolean }) {
  return <details open={open ?? defaultOpen}>{children}</details>;
}
export function CollapsibleTrigger({ children }: { children: ReactNode }) {
  return <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">{children}</summary>;
}
export function CollapsibleContent({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}

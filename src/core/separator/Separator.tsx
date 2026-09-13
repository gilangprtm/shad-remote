import type { HTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export function Separator({ className, orientation = "horizontal", ...props }: HTMLAttributes<HTMLDivElement> & { orientation?: "horizontal" | "vertical" }) {
  return <div data-slot="separator" data-orientation={orientation} role="separator" className={cn("shrink-0 bg-border", orientation === "vertical" ? "h-full w-px" : "h-px w-full", className)} {...props} />;
}

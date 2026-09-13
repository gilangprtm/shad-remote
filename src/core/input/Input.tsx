import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ className, type, ...props }, ref) {
  return <input ref={ref} data-slot="input" type={type} className={cn("h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50", className)} {...props} />;
});

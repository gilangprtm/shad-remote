import type { ImgHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";

export function Avatar({ className, children }: { className?: string; children?: ReactNode }) {
  return <span className={cn("relative flex size-9 shrink-0 overflow-hidden rounded-full bg-muted", className)}>{children}</span>;
}
export function AvatarImage({ className, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  return <img className={cn("aspect-square size-full object-cover", className)} {...props} />;
}
export function AvatarFallback({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("flex size-full items-center justify-center text-xs font-medium", className)} {...props} />;
}

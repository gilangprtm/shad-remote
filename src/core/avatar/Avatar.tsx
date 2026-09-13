import type { ImgHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";

export type AvatarSize = "default" | "sm" | "lg";

export function Avatar({ className, size = "default", children }: { className?: string; size?: AvatarSize; children?: ReactNode }) {
  return <span data-size={size} className={cn("group/avatar relative flex shrink-0 overflow-hidden rounded-full bg-muted", size === "sm" ? "size-6" : size === "lg" ? "size-10" : "size-8", className)}>{children}</span>;
}
export function AvatarImage({ className, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  return <img className={cn("aspect-square size-full object-cover", className)} {...props} />;
}
export function AvatarFallback({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("flex size-full items-center justify-center rounded-full text-xs font-medium text-muted-foreground", className)} {...props} />;
}
export function AvatarBadge({ className, children, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("absolute right-0 bottom-0 z-10 inline-flex size-2.5 items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-background", className)} {...props}>{children}</span>;
}
export function AvatarGroup({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex -space-x-2 *:ring-2 *:ring-background", className)} {...props}>{children}</div>;
}
export function AvatarGroupCount({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("relative flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground ring-2 ring-background", className)} {...props}>{children}</div>;
}

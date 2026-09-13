import type { HTMLAttributes } from "react";
import { cn } from "../../lib/cn";

type DivProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: DivProps) {
  return <div data-slot="card" className={cn("flex flex-col gap-4 overflow-hidden rounded-xl bg-card py-4 text-sm text-card-foreground ring-1 ring-foreground/10 [&:has(>[data-slot=card-footer])]:pb-0", className)} {...props} />;
}
export function CardHeader({ className, ...props }: DivProps) {
  return <div data-slot="card-header" className={cn("grid gap-1 px-4", className)} {...props} />;
}
export function CardTitle({ className, ...props }: DivProps) {
  return <div data-slot="card-title" className={cn("font-medium leading-snug", className)} {...props} />;
}
export function CardDescription({ className, ...props }: DivProps) {
  return <div data-slot="card-description" className={cn("text-sm text-muted-foreground", className)} {...props} />;
}
export function CardAction({ className, ...props }: DivProps) {
  return <div data-slot="card-action" className={cn("self-start justify-self-end", className)} {...props} />;
}
export function CardContent({ className, ...props }: DivProps) {
  return <div data-slot="card-content" className={cn("px-4", className)} {...props} />;
}
export function CardFooter({ className, ...props }: DivProps) {
  return <div data-slot="card-footer" className={cn("flex items-center border-t bg-muted/50 p-4", className)} {...props} />;
}

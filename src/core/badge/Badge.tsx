import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

export const badgeVariants = cva("inline-flex h-5 w-fit items-center justify-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap", {
  variants: {
    variant: {
      default: "border-transparent bg-primary text-primary-foreground",
      secondary: "border-transparent bg-secondary text-secondary-foreground",
      destructive: "border-transparent bg-destructive/10 text-destructive",
      outline: "border-border text-foreground",
      ghost: "border-transparent hover:bg-muted",
      link: "border-transparent text-primary underline-offset-4 hover:underline",
    },
  },
  defaultVariants: { variant: "default" },
});

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>;
export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return <span data-slot="badge" data-variant={variant} className={cn(badgeVariants({ variant, className }))} {...props} />;
}

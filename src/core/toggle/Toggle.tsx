import { useState, type ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export function Toggle({ pressed, defaultPressed = false, onPressedChange, className, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { pressed?: boolean; defaultPressed?: boolean; onPressedChange?: (pressed: boolean) => void }) {
  const [internalPressed, setInternalPressed] = useState(defaultPressed);
  const active = pressed ?? internalPressed;
  return <button type="button" aria-pressed={active} className={cn("inline-flex h-8 items-center justify-center rounded-md px-3 text-sm font-medium hover:bg-muted", active && "bg-muted text-foreground", className)} onClick={(event) => { const next = !active; if (pressed === undefined) setInternalPressed(next); onPressedChange?.(next); props.onClick?.(event); }} {...props} />;
}

import { useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/cn";

export function ButtonGroup({ children, className }: { children: ReactNode; className?: string }) {
  return <div role="group" className={cn("inline-flex items-center [&>button:not(:first-child)]:rounded-l-none [&>button:not(:last-child)]:rounded-r-none", className)}>{children}</div>;
}

export function ToggleGroup({ value, defaultValue, onValueChange, children, className }: { value?: string; defaultValue?: string; onValueChange?: (value: string) => void; children: ReactNode; className?: string }) {
  const [selected, setSelected] = useState(defaultValue ?? "");
  return <div role="group" className={cn("inline-flex items-center gap-1 rounded-lg bg-muted p-1", className)}>{Array.isArray(children) ? children.map((child) => child && typeof child === "object" && "props" in child ? { ...child, props: { ...child.props, selected: (value ?? selected) === child.props.value, onSelect: (next: string) => { if (value === undefined) setSelected(next); onValueChange?.(next); } } } : child) : children}</div>;
}

export function ToggleGroupItem({ value, selected, onSelect, children, className, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { value: string; selected?: boolean; onSelect?: (value: string) => void }) {
  return <button type="button" aria-pressed={selected} className={cn("rounded-md px-3 py-1.5 text-sm hover:bg-background", selected && "bg-background text-foreground shadow-sm", className)} onClick={() => onSelect?.(value)} {...props}>{children}</button>;
}

export function Slider({ value, defaultValue = 0, min = 0, max = 100, step = 1, onValueChange, className }: { value?: number; defaultValue?: number; min?: number; max?: number; step?: number; onValueChange?: (value: number) => void; className?: string }) {
  const [internal, setInternal] = useState(defaultValue);
  const current = value ?? internal;
  return <input aria-label="Slider" type="range" min={min} max={max} step={step} value={current} className={cn("h-2 w-full accent-primary", className)} onChange={(event) => { const next = Number(event.target.value); if (value === undefined) setInternal(next); onValueChange?.(next); }} />;
}

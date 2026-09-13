import { useRef, useState, type ReactNode, type HTMLAttributes } from "react";
import { Button } from "../button/Button";
import { Input } from "../input/Input";
import { cn } from "../../lib/cn";

export function InputGroup({ prefix, suffix, children, className }: { prefix?: ReactNode; suffix?: ReactNode; children: ReactNode; className?: string }) { return <div className={cn("flex items-center rounded-md border border-input bg-background focus-within:ring-2 focus-within:ring-ring/50", className)}>{prefix && <span className="px-3 text-sm text-muted-foreground">{prefix}</span>}{children}{suffix && <span className="px-3 text-sm text-muted-foreground">{suffix}</span>}</div>; }

export function InputOTP({ length = 6, value = "", onChange, className }: { length?: number; value?: string; onChange: (value: string) => void; className?: string }) { const refs = useRef<Array<HTMLInputElement | null>>([]); const chars = Array.from({ length }, (_, index) => value[index] ?? ""); return <div className={cn("flex gap-2", className)}>{chars.map((char, index) => <Input key={index} ref={(element) => { refs.current[index] = element; }} inputMode="numeric" maxLength={1} value={char} aria-label={`Code digit ${index + 1}`} className="size-10 p-0 text-center" onChange={(event) => { const next = event.target.value.replace(/\D/g, "").slice(-1); const updated = chars.map((item, itemIndex) => itemIndex === index ? next : item).join(""); onChange(updated); if (next) refs.current[index + 1]?.focus(); }} onKeyDown={(event) => { if (event.key === "Backspace" && !chars[index]) refs.current[index - 1]?.focus(); }} />)}</div>; }

type CarouselProps = { items: ReactNode[]; renderItem?: (item: ReactNode, index: number) => ReactNode; className?: string; orientation?: "horizontal" | "vertical"; showControls?: boolean; dir?: "ltr" | "rtl"; itemSize?: "full" | "half" | "third" };
export function Carousel({ items, renderItem, className, orientation = "horizontal", showControls = true, dir = "ltr", itemSize = "full" }: CarouselProps) {
  const [index, setIndex] = useState(0); const count = items.length; if (!count) return null;
  const move = (delta: number) => setIndex((current) => (current + delta + count) % count);
  const stepKey = orientation === "horizontal" ? (dir === "rtl" ? "ArrowRight" : "ArrowLeft") : "ArrowUp";
  return <div dir={dir} className={cn("grid gap-3", className)} onKeyDown={(event) => { if (event.key === stepKey) { event.preventDefault(); move(-1); } if (event.key === (orientation === "horizontal" && dir === "rtl" ? "ArrowLeft" : orientation === "horizontal" ? "ArrowRight" : "ArrowDown")) { event.preventDefault(); move(1); } }} tabIndex={0} aria-roledescription="carousel" aria-label="Carousel">
    <div className={cn("overflow-hidden rounded-lg border p-4", orientation === "vertical" && "min-h-40", itemSize === "half" && "max-w-[70%]", itemSize === "third" && "max-w-[45%]")}>{renderItem ? renderItem(items[index], index) : items[index]}</div>
    {showControls && <div className="flex items-center justify-between"><Button size="sm" variant="outline" aria-label="Previous slide" disabled={count < 2} onClick={() => move(-1)}>Previous</Button><span className="text-xs text-muted-foreground" aria-live="polite">{index + 1} / {count}</span><Button size="sm" variant="outline" aria-label="Next slide" disabled={count < 2} onClick={() => move(1)}>Next</Button></div>}
  </div>;
}

type ResizableProps = { children: [ReactNode, ReactNode]; direction?: "horizontal" | "vertical"; defaultSize?: number; min?: number; max?: number; withHandle?: boolean; dir?: "ltr" | "rtl"; className?: string };
export function Resizable({ children, direction = "horizontal", defaultSize = 50, min = 20, max = 80, withHandle = false, dir = "ltr", className }: ResizableProps) {
  const [size, setSize] = useState(Math.min(max, Math.max(min, defaultSize))); const firstStyle = direction === "horizontal" ? { width: `${size}%` } : { height: `${size}%` }; const secondStyle = direction === "horizontal" ? { width: `${100 - size}%` } : { height: `${100 - size}%` };
  return <div dir={dir} className={cn("flex min-h-32", direction === "vertical" && "flex-col", className)} aria-orientation={direction}>
    <div style={firstStyle} className="min-w-0 overflow-auto">{children[0]}</div><div className={cn("flex shrink-0 items-center justify-center", direction === "horizontal" ? "w-3" : "h-3 w-full")}><input aria-label="Resize panels" type="range" min={min} max={max} value={size} onChange={(event) => setSize(Number(event.target.value))} className={cn(direction === "horizontal" ? "h-full w-2" : "h-2 w-full", "accent-primary", withHandle && "rounded-full bg-muted")} />{withHandle && <span aria-hidden="true" className={cn("pointer-events-none absolute rounded-full bg-border", direction === "horizontal" ? "h-8 w-1" : "h-1 w-8")} />}</div><div style={secondStyle} className="min-w-0 overflow-auto">{children[1]}</div>
  </div>;
}

export type { HTMLAttributes };

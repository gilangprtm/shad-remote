import type { ReactNode } from "react";
import { Input } from "../../core/input/Input";
import { Button } from "../../core/button/Button";

export function FilterBar({ value, onValueChange, onReset, children, placeholder = "Filter components..." }: { value: string; onValueChange: (value: string) => void; onReset?: () => void; children?: ReactNode; placeholder?: string }) {
  return <div className="flex flex-wrap items-center gap-2"><Input className="max-w-xs" value={value} onChange={(event) => onValueChange(event.target.value)} placeholder={placeholder} aria-label={placeholder} />{children}{onReset && <Button variant="ghost" size="sm" onClick={onReset}>Reset</Button>}</div>;
}

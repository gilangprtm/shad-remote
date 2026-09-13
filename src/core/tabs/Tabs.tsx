import { createContext, useContext, useState, type ReactNode } from "react";
import { cn } from "../../lib/cn";

type TabsContextValue = { value: string; setValue: (value: string) => void };
const TabsContext = createContext<TabsContextValue | null>(null);

export function Tabs({ defaultValue, value: controlledValue, onValueChange, children, className }: { defaultValue?: string; value?: string; onValueChange?: (value: string) => void; children: ReactNode; className?: string }) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const value = controlledValue ?? internalValue;
  const setValue = (next: string) => { if (controlledValue === undefined) setInternalValue(next); onValueChange?.(next); };
  return <TabsContext.Provider value={{ value, setValue }}><div className={cn("flex flex-col gap-2", className)}>{children}</div></TabsContext.Provider>;
}

export function TabsList({ className, children }: { className?: string; children: ReactNode }) {
  return <div role="tablist" className={cn("inline-flex h-9 w-fit items-center gap-1 rounded-lg bg-muted p-1 text-muted-foreground", className)}>{children}</div>;
}

export function TabsTrigger({ value, children, className }: { value: string; children: ReactNode; className?: string }) {
  const tabs = useContext(TabsContext);
  if (!tabs) throw new Error("TabsTrigger must be used inside Tabs");
  return <button type="button" role="tab" aria-selected={tabs.value === value} onClick={() => tabs.setValue(value)} className={cn("rounded-md px-3 py-1 text-sm font-medium transition-colors hover:text-foreground", tabs.value === value && "bg-background text-foreground shadow-sm", className)}>{children}</button>;
}

export function TabsContent({ value, children, className }: { value: string; children: ReactNode; className?: string }) {
  const tabs = useContext(TabsContext);
  if (!tabs || tabs.value !== value) return null;
  return <div role="tabpanel" className={cn("outline-none", className)}>{children}</div>;
}

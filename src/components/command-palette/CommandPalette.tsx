import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../../core/button/Button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../../core/command/Command";
import type { CommandItem as CommandDefinition, CommandPaletteProps } from "../../contracts/command";

export type CommandPaletteOptions = CommandPaletteProps & {
  enableGlobalShortcut?: boolean;
};

export function CommandPalette({ commands, open, onOpenChange, placeholder = "Search commands...", enableGlobalShortcut = true }: CommandPaletteOptions) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const filteredCommands = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return commands.filter((item) => {
      if (item.disabled) return false;
      if (!normalizedQuery) return true;
      return `${item.label} ${item.keywords?.join(" ") ?? ""}`.toLowerCase().includes(normalizedQuery);
    });
  }, [commands, query]);

  const groups = useMemo(() => filteredCommands.reduce<Record<string, CommandDefinition[]>>((result, item) => {
    const group = item.group ?? "Commands";
    (result[group] ??= []).push(item);
    return result;
  }, {}), [filteredCommands]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, open]);

  useEffect(() => {
    if (!enableGlobalShortcut) return;
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [enableGlobalShortcut, onOpenChange, open]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onOpenChange(false);
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((index) => Math.min(index + 1, Math.max(filteredCommands.length - 1, 0)));
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex((index) => Math.max(index - 1, 0));
      } else if (event.key === "Enter") {
        event.preventDefault();
        const item = filteredCommands[activeIndex];
        if (item) {
          item.onSelect();
          onOpenChange(false);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, filteredCommands, onOpenChange, open]);

  if (!open) return null;
  return <div className="fixed inset-0 z-50 bg-black/40 p-4" role="presentation" onMouseDown={() => onOpenChange(false)}><div className="mx-auto mt-[12vh] w-full max-w-lg" onMouseDown={(event) => event.stopPropagation()}><Command><CommandInput inputRef={inputRef} value={query} onValueChange={setQuery} placeholder={placeholder} /><CommandList>{filteredCommands.length === 0 ? <CommandEmpty>No matching commands.</CommandEmpty> : Object.entries(groups).map(([group, items]) => <CommandGroup heading={group} key={group}>{items.map((item) => { const itemIndex = filteredCommands.indexOf(item); return <CommandItem key={item.id} value={`${item.label} ${item.keywords?.join(" ") ?? ""}`} query={query} active={itemIndex === activeIndex} onSelect={() => { item.onSelect(); onOpenChange(false); }}><span className="mr-2">{item.icon}</span>{item.label}</CommandItem>; })}</CommandGroup>)}</CommandList></Command><div className="mt-2 flex justify-between"><span className="text-xs text-muted-foreground">Use ↑ ↓ and Enter · Esc to close</span><Button size="sm" variant="ghost" onClick={() => onOpenChange(false)}>Close</Button></div></div></div>;
}

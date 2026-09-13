import { cloneElement, isValidElement, useEffect, useId, useRef, useState, type ReactElement, type ReactNode } from "react";
import { cn } from "../../lib/cn";

type MenuItemElement = HTMLButtonElement | HTMLAnchorElement;

function focusMenuItem(container: HTMLElement, direction: 1 | -1 = 1) {
  const items = [...container.querySelectorAll<MenuItemElement>("[role=menuitem]:not([aria-disabled='true']):not(:disabled)")];
  if (items.length) items[direction === 1 ? 0 : items.length - 1]?.focus();
}

function menuKeyDown(event: React.KeyboardEvent<HTMLElement>) {
  const target = event.target as HTMLElement;
  const items = [...event.currentTarget.querySelectorAll<MenuItemElement>("[role=menuitem]:not([aria-disabled='true']):not(:disabled)")];
  const index = items.indexOf(target as MenuItemElement);
  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault();
    const next = index < 0 ? 0 : (index + (event.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
    items[next]?.focus();
  } else if (event.key === "Home" || event.key === "End") {
    event.preventDefault();
    items[event.key === "Home" ? 0 : items.length - 1]?.focus();
  }
}

export function DropdownMenu({ trigger, children, open: controlledOpen, defaultOpen = false, onOpenChange }: { trigger: ReactNode; children: ReactNode; open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void }) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = (next: boolean) => { if (controlledOpen === undefined) setUncontrolledOpen(next); onOpenChange?.(next); };
  const menuId = useId();
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerElement = isValidElement(trigger)
    ? cloneElement(trigger as ReactElement<any>, { onClick: () => setOpen(!open), "aria-expanded": open, "aria-controls": menuId })
        : <button type="button" aria-expanded={open} aria-controls={menuId} onClick={() => setOpen(!open)}>{trigger}</button>;
  useEffect(() => { if (open) focusMenuItem(menuRef.current!, 1); }, [open]);
  return <span className="relative inline-flex" onKeyDown={(event) => { if (event.key === "Escape") { setOpen(false); } }}>
    {triggerElement}
    {open && <div ref={menuRef} id={menuId} role="menu" aria-label="Menu" tabIndex={-1} onKeyDown={menuKeyDown} className="absolute right-0 top-full z-40 mt-2 min-w-44 rounded-md border bg-popover p-1 text-popover-foreground shadow-md">{children}</div>}
  </span>;
}

export function DropdownMenuItem({ children, onSelect, disabled = false, kind = "item", checked, destructive = false }: { children: ReactNode; onSelect?: () => void; disabled?: boolean; kind?: "item" | "checkbox" | "radio"; checked?: boolean; destructive?: boolean }) {
  const role = kind === "checkbox" ? "menuitemcheckbox" : kind === "radio" ? "menuitemradio" : "menuitem";
  return <button type="button" role={role} disabled={disabled} aria-disabled={disabled || undefined} aria-checked={kind === "item" ? undefined : checked} className={cn("flex w-full items-center rounded-sm px-2 py-1.5 text-left text-sm hover:bg-muted disabled:pointer-events-none disabled:opacity-50", destructive && "text-destructive hover:bg-destructive/10")} onClick={onSelect}>{children}</button>;
}
export function DropdownMenuSeparator() { return <div role="separator" className="-mx-1 my-1 h-px bg-border" />; }

export function ContextMenu({ children, menu }: { children: ReactNode; menu: ReactNode }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (open) focusMenuItem(menuRef.current!, 1); }, [open]);
  return <span className="relative inline-flex" onContextMenu={(event) => { event.preventDefault(); setOpen(true); }} onClick={() => setOpen(false)} onKeyDown={(event) => { if (event.key === "Escape") setOpen(false); }}>
    {children}
    {open && <div ref={menuRef} role="menu" aria-label="Context menu" tabIndex={-1} onKeyDown={menuKeyDown} className="absolute left-0 top-full z-40 mt-1 min-w-44 rounded-md border bg-popover p-1 shadow-md">{menu}</div>}
  </span>;
}

export function Menubar({ children, className }: { children: ReactNode; className?: string }) {
  const barRef = useRef<HTMLElement>(null);
  return <nav ref={barRef} role="menubar" aria-label="Application menu" className={cn("flex items-center gap-1 rounded-lg border bg-background p-1", className)} onKeyDown={(event) => {
    const items = [...event.currentTarget.querySelectorAll<MenuItemElement>("[role=menuitem]:not([aria-disabled='true']):not(:disabled)")];
    const index = items.indexOf(event.target as MenuItemElement);
    if ((event.key === "ArrowRight" || event.key === "ArrowLeft") && index >= 0) { event.preventDefault(); items[(index + (event.key === "ArrowRight" ? 1 : -1) + items.length) % items.length]?.focus(); }
    if (event.key === "Home" || event.key === "End") { event.preventDefault(); items[event.key === "Home" ? 0 : items.length - 1]?.focus(); }
  }}>{children}</nav>;
}
export function MenubarItem({ children, href, onClick, disabled = false }: { children: ReactNode; href?: string; onClick?: () => void; disabled?: boolean }) {
  return href ? <a role="menuitem" className={cn("rounded-md px-3 py-1.5 text-sm hover:bg-muted", disabled && "pointer-events-none opacity-50")} aria-disabled={disabled || undefined} href={disabled ? undefined : href}>{children}</a> : <button type="button" role="menuitem" disabled={disabled} aria-disabled={disabled || undefined} className="rounded-md px-3 py-1.5 text-sm hover:bg-muted disabled:pointer-events-none disabled:opacity-50" onClick={onClick}>{children}</button>;
}
export function NavigationMenu({ children, className }: { children: ReactNode; className?: string }) { return <nav aria-label="Navigation" className={cn("flex items-center gap-1", className)}>{children}</nav>; }
export function NavigationMenuLink({ children, href, active = false }: { children: ReactNode; href: string; active?: boolean }) { return <a href={href} aria-current={active ? "page" : undefined} className={cn("rounded-md px-3 py-2 text-sm hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring", active && "bg-muted font-medium")}>{children}</a>; }
export function Combobox({ options, value, onValueChange, placeholder = "Select...", disabled = false, invalid = false, dir = "ltr" }: { options: { value: string; label: string }[]; value?: string; onValueChange: (value: string) => void; placeholder?: string; disabled?: boolean; invalid?: boolean; dir?: "ltr" | "rtl" }) { const [query, setQuery] = useState(""); const [open, setOpen] = useState(false); const [highlighted, setHighlighted] = useState(0); const selected = options.find((option) => option.value === value); const visible = options.filter((option) => option.label.toLowerCase().includes(query.toLowerCase())); const select = (next: string) => { onValueChange(next); setQuery(""); setOpen(false); }; return <span dir={dir} className="relative block"><input role="combobox" aria-expanded={open} aria-invalid={invalid || undefined} disabled={disabled} value={selected && !query ? selected.label : query} placeholder={placeholder} onFocus={() => !disabled && setOpen(true)} onChange={(event) => { setQuery(event.target.value); setHighlighted(0); setOpen(true); }} onKeyDown={(event) => { if (event.key === "ArrowDown" || event.key === "ArrowUp") { event.preventDefault(); setHighlighted((current) => Math.max(0, Math.min(visible.length - 1, current + (event.key === "ArrowDown" ? 1 : -1)))); } else if (event.key === "Enter" && open && visible[highlighted]) { event.preventDefault(); select(visible[highlighted].value); } else if (event.key === "Escape") setOpen(false); }} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50" />{open && <div role="listbox" className="absolute top-full z-40 mt-1 max-h-48 w-full overflow-auto rounded-md border bg-popover p-1 shadow-md">{visible.map((option, index) => <button type="button" role="option" aria-selected={option.value === value} key={option.value} className={cn("block w-full rounded px-2 py-1.5 text-left text-sm hover:bg-muted", index === highlighted && "bg-muted")} onMouseEnter={() => setHighlighted(index)} onClick={() => select(option.value)}>{option.label}</button>)}</div>}</span>; }

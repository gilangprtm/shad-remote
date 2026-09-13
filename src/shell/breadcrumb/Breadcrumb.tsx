import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export type BreadcrumbItem = { label: ReactNode; href?: string };
export function Breadcrumb({ items, className }: { items: BreadcrumbItem[]; className?: string }) {
  return <nav aria-label="Breadcrumb" className={cn("flex items-center gap-2 text-sm text-muted-foreground", className)}>{items.map((item, index) => <span className="flex items-center gap-2" key={index}>{index > 0 && <span aria-hidden="true">/</span>}{item.href ? <a className="hover:text-foreground" href={item.href}>{item.label}</a> : <span className="text-foreground">{item.label}</span>}</span>)}</nav>;
}

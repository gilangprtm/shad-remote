import { createContext, useContext, type ReactNode } from "react";
import { cn } from "../../lib/cn";

type SidebarContextValue = { open: boolean; setOpen?: (open: boolean) => void };
const SidebarContext = createContext<SidebarContextValue>({ open: true });

export function SidebarProvider({ children, open = true, setOpen }: { children: ReactNode; open?: boolean; setOpen?: (open: boolean) => void }) {
  return <SidebarContext.Provider value={{ open, setOpen }}>{children}</SidebarContext.Provider>;
}
export function useSidebar() { return useContext(SidebarContext); }
export function Sidebar({ children, className }: { children: ReactNode; className?: string }) { const { open } = useSidebar(); return <aside data-state={open ? "expanded" : "collapsed"} className={cn("flex min-h-screen w-64 flex-col border-r bg-sidebar text-sidebar-foreground", !open && "w-16", className)}>{children}</aside>; }
export function SidebarHeader({ children, className }: { children: ReactNode; className?: string }) { return <div className={cn("p-4", className)}>{children}</div>; }
export function SidebarContent({ children, className }: { children: ReactNode; className?: string }) { return <div className={cn("flex-1 overflow-auto px-3", className)}>{children}</div>; }
export function SidebarFooter({ children, className }: { children: ReactNode; className?: string }) { return <div className={cn("border-t p-3", className)}>{children}</div>; }
export function SidebarInset({ children, className }: { children: ReactNode; className?: string }) { return <main className={cn("min-w-0 flex-1 bg-background", className)}>{children}</main>; }

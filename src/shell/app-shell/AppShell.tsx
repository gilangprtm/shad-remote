import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  BookOpen,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Component,
  FileCode2,
  FolderOpen,
  LayoutDashboard,
  Layers3,
  Menu,
  Moon,
  MoreHorizontal,
  PanelLeft,
  Palette,
  Search,
  Settings2,
  Sun,
  Table2,
  Type,
  X,
} from "lucide-react";
import { cn } from "../../lib/cn";
import { Breadcrumb } from "../breadcrumb/Breadcrumb";
import { componentRegistry } from "../../components/docs/component-registry";

type Icon = typeof LayoutDashboard;
export type ShellNavItem = { label: string; url: string };
export type ShellNavGroup = {
  label: string;
  items: Array<ShellNavItem & { description?: string; icon?: Icon }>;
};
export type ShellTheme = "light" | "dark" | "system";

const registryGroups = Array.from(new Set(componentRegistry.map((item) => item.group)));
const defaultGroups: ShellNavGroup[] = [
  { label: "Workspace", items: [{ label: "Overview", url: "/", icon: LayoutDashboard, description: "Catalog summary" }] },
  ...registryGroups.map((group) => ({
    label: group,
    items: componentRegistry.filter((item) => item.group === group).map((item) => ({ label: item.name, url: item.path, icon: Component, description: `${item.variants.length} documented variation${item.variants.length === 1 ? "" : "s"}` })),
  })),
  { label: "Resources", items: [{ label: "Usage guide", url: "/docs/usage", icon: BookOpen, description: "How to consume a remote module" }, { label: "Contracts", url: "/docs/contracts", icon: FileCode2, description: "Consumer-facing interfaces" }] },
];

function resolveTheme(theme: ShellTheme): "light" | "dark" {
  if (theme !== "system") return theme;
  return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function useShellTheme(initial: ShellTheme) {
  const [theme, setTheme] = useState<ShellTheme>(() => {
    if (typeof window === "undefined") return initial;
    return (window.localStorage.getItem("edjavu-ui-theme") as ShellTheme | null) ?? initial;
  });
  useEffect(() => {
    const resolved = resolveTheme(theme);
    document.documentElement.classList.toggle("dark", resolved === "dark");
    document.documentElement.dataset.themeMode = theme;
    window.localStorage.setItem("edjavu-ui-theme", theme);
  }, [theme]);
  return [theme, setTheme] as const;
}

function isActive(url: string, currentPath: string) {
  return url === "/" ? currentPath === "/" : currentPath === url || currentPath.startsWith(`${url}/`);
}

export function AppShell({
  title,
  nav = [],
  navGroups = defaultGroups,
  children,
  breadcrumbs,
  theme: initialTheme = "light",
  onNavigate,
}: {
  title: string;
  nav?: ShellNavItem[];
  navGroups?: ShellNavGroup[];
  children: ReactNode;
  breadcrumbs?: Array<{ label: ReactNode; href?: string }>;
  theme?: ShellTheme;
  onNavigate?: (url: string) => void;
}) {
  const [theme, setTheme] = useShellTheme(initialTheme);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ Components: true, Patterns: true });
  const [currentPath, setCurrentPath] = useState(() => typeof window === "undefined" ? "/" : window.location.pathname);
  const groups: ShellNavGroup[] = useMemo(() => navGroups.length ? navGroups : [{ label: "Workspace", items: nav.map((item) => ({ ...item })) }], [nav, navGroups]);
  const navigate = (url: string) => { setCurrentPath(url); window.history.replaceState({}, "", url); window.dispatchEvent(new CustomEvent("edjavu:navigate", { detail: url })); if (url === "/preferences") setPreferencesOpen(true); onNavigate?.(url); setMobileOpen(false); };
  const cycleTheme = () => setTheme(theme === "light" ? "dark" : theme === "dark" ? "system" : "light");

  return (
    <div className={cn("edjavu-dashboard", !sidebarOpen && "edjavu-dashboard-collapsed")}>
      <div className={cn("edjavu-sidebar-backdrop", mobileOpen && "is-open")} onClick={() => setMobileOpen(false)} aria-hidden="true" />
      <aside className={cn("edjavu-dashboard-sidebar", mobileOpen && "is-mobile-open")} aria-label="Remote UI navigation">
        <div className="edjavu-sidebar-brand">
          <button type="button" className="edjavu-brand-mark" onClick={() => navigate("/")} aria-label="Open overview">E</button>
          {sidebarOpen && <div><strong>EDJAVU UI</strong><span>Remote component catalog</span></div>}
          <button type="button" className="edjavu-icon-button edjavu-sidebar-close" onClick={() => setMobileOpen(false)} aria-label="Close navigation"><X size={17} /></button>
        </div>
        <div className="edjavu-sidebar-scroll">
          <button type="button" className="edjavu-quick-search" onClick={() => navigate("/docs/usage")}><Search size={16} /><span>{sidebarOpen ? "Search components" : "Search"}</span><kbd>⌘K</kbd></button>
          {groups.map((group) => {
            const isExpanded = expanded[group.label] ?? true;
            const hasNested = group.items.length > 1;
            return <section className="edjavu-nav-group" key={group.label}>
              {sidebarOpen && <button type="button" className="edjavu-nav-group-label" onClick={() => hasNested && setExpanded((value) => ({ ...value, [group.label]: !isExpanded }))}><span>{group.label}</span>{hasNested && (isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />)}</button>}
              {isExpanded && <nav className="edjavu-nav-list">{group.items.map((item) => { const Icon = item.icon ?? Component; const active = isActive(item.url, currentPath); return <button type="button" key={item.url} className={cn("edjavu-nav-item", active && "is-active")} onClick={() => navigate(item.url)} title={sidebarOpen ? item.description : item.label}><Icon size={17} /><span className="edjavu-nav-copy"><strong>{item.label}</strong>{sidebarOpen && item.description && <small>{item.description}</small>}</span></button>; })}</nav>}
            </section>;
          })}
        </div>
        <div className="edjavu-sidebar-footer">
          {sidebarOpen && <div className="edjavu-sidebar-profile"><div className="edjavu-avatar">GP</div><div><strong>Remote workspace</strong><span>Consumer-ready</span></div><MoreHorizontal size={17} /></div>}
          <button type="button" className="edjavu-preference-link" onClick={() => navigate("/preferences")}><Settings2 size={17} /><span>{sidebarOpen ? "Preferences" : "Settings"}</span></button>
        </div>
      </aside>
      <main className="edjavu-dashboard-main">
        <header className="edjavu-dashboard-header">
          <div className="edjavu-header-leading"><button type="button" className="edjavu-icon-button" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu size={19} /></button><button type="button" className="edjavu-icon-button edjavu-desktop-toggle" onClick={() => setSidebarOpen((value) => !value)} aria-label="Toggle sidebar"><PanelLeft size={18} /></button><div className="edjavu-header-title"><span>Remote UI</span><strong>{title}</strong></div></div>
          <div className="edjavu-header-actions"><button type="button" className="edjavu-icon-button" onClick={cycleTheme} aria-label={`Theme: ${theme}`} title={`Theme: ${theme}`}>{theme === "dark" ? <Sun size={18} /> : theme === "light" ? <Moon size={18} /> : <CircleHelp size={18} />}</button><button type="button" className="edjavu-avatar edjavu-avatar-button" onClick={() => navigate("/preferences")} aria-label="Open workspace preferences">GP</button></div>
        </header>
        <div className="edjavu-dashboard-content">
          <div className="edjavu-dashboard-breadcrumb"><Breadcrumb items={breadcrumbs ?? [{ label: "Remote UI" }, { label: title }]} /></div>
          {children}
        </div>
        {preferencesOpen && <div className="edjavu-preferences-panel" role="dialog" aria-modal="true" aria-labelledby="preferences-title">
          <div className="edjavu-preferences-panel-head"><div><span>Workspace</span><h2 id="preferences-title">Preferences</h2></div><button type="button" className="edjavu-icon-button" onClick={() => setPreferencesOpen(false)} aria-label="Close preferences"><X size={17} /></button></div>
          <div className="edjavu-preference-section"><strong>Theme mode</strong><p>Choose the appearance used by this catalog.</p><div className="edjavu-preference-options">{(["light", "dark", "system"] as ShellTheme[]).map((option) => <button type="button" key={option} className={cn("edjavu-preference-option", theme === option && "is-selected")} onClick={() => setTheme(option)}>{option === "light" ? <Sun size={16} /> : option === "dark" ? <Moon size={16} /> : <CircleHelp size={16} />}<span>{option[0].toUpperCase() + option.slice(1)}</span></button>)}</div></div>
          <div className="edjavu-preference-section"><strong>Sidebar behavior</strong><p>Keep the navigation expanded or use icon-only mode.</p><button type="button" className="edjavu-preference-wide-button" onClick={() => setSidebarOpen((value) => !value)}><PanelLeft size={16} />{sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}</button></div>
          <div className="edjavu-preference-section"><strong>Workspace links</strong><p>All component entries are framework-agnostic and accept consumer data through contracts.</p><button type="button" className="edjavu-preference-wide-button" onClick={() => { setPreferencesOpen(false); navigate("/docs/usage"); }}><BookOpen size={16} />Open usage guide</button></div>
        </div>}
      </main>
    </div>
  );
}

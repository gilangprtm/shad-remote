import { useEffect, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Check, Copy } from "lucide-react";
import { Badge } from "../../core/badge/Badge";
import { Button } from "../../core/button/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../core/card/Card";
import { Input } from "../../core/input/Input";
import { Label } from "../../core/label/Label";
import { Select } from "../../core/select/Select";
import { Switch } from "../../core/switch/Switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../core/tabs/Tabs";
import { Textarea } from "../../core/textarea/Textarea";

const pages = [
  { path: "/components/core/button", category: "Core primitives", name: "Button", description: "Triggers an action or submits a user decision.", usage: '<Button onClick={() => save()}>Save changes</Button>', preview: "button" },
  { path: "/components/core/card", category: "Core primitives", name: "Card", description: "Groups related content into a readable surface.", usage: '<Card><CardContent>Content</CardContent></Card>', preview: "card" },
  { path: "/components/forms/select", category: "Forms & controls", name: "Select", description: "Displays a list of options for the user to pick from.", usage: '<Select defaultValue="stable"><option value="stable">Stable</option></Select>', preview: "select" },
  { path: "/components/forms/input", category: "Forms & controls", name: "Input", description: "Accepts a short, single-line value from the user.", usage: '<Input placeholder="Component name" />', preview: "input" },
  { path: "/components/data/table", category: "Data display", name: "Table", description: "Presents structured data for scanning and comparison.", usage: '<Table rows={rows} columns={columns} />', preview: "table" },
  { path: "/components/overlays/dialog", category: "Overlays & menus", name: "Dialog", description: "Shows focused content above the current page.", usage: '<Dialog open={open} onOpenChange={setOpen} title="Details">Content</Dialog>', preview: "dialog" },
  { path: "/patterns/calendar", category: "Patterns", name: "Calendar", description: "Displays dates and events through a consumer-owned calendar contract.", usage: '<EventCalendar events={events} view="month" onEventClick={openEvent} />', preview: "calendar" },
  { path: "/patterns/charts", category: "Patterns", name: "Chart", description: "Renders consumer-provided series as an accessible visualization.", usage: '<Chart definition={definition} state={state} />', preview: "chart" },
  { path: "/patterns/files", category: "Patterns", name: "File uploader", description: "Presents file selection, validation, progress, and lifecycle states.", usage: '<FileUploader files={files} onFilesSelected={addFiles} />', preview: "files" },
];

function Preview({ kind }: { kind: string }) {
  const [open, setOpen] = useState(false);
  const [enabled, setEnabled] = useState(true);
  if (kind === "button") return <div className="docs-preview-row"><Button onClick={() => setOpen((value) => !value)}>{open ? "Saved" : "Save changes"}</Button><Button variant="outline">Secondary action</Button>{open && <Badge>Action completed</Badge>}</div>;
  if (kind === "input") return <div className="docs-preview-form"><Label htmlFor="docs-input">Component name</Label><Input id="docs-input" placeholder="Select" /></div>;
  if (kind === "select") return <div className="docs-preview-form"><Label htmlFor="docs-select">Release channel</Label><Select id="docs-select" defaultValue="stable"><option value="stable">Stable</option><option value="canary">Canary</option></Select></div>;
  if (kind === "card") return <Card><CardHeader><CardTitle>Card title</CardTitle><CardDescription>A surface for related content.</CardDescription></CardHeader><CardContent><Button size="sm">Continue</Button></CardContent></Card>;
  if (kind === "dialog") return <div className="docs-preview-row"><Button onClick={() => setOpen(true)}>Open dialog</Button>{open && <div className="docs-inline-dialog" role="dialog" aria-modal="true"><strong>Dialog title</strong><p className="showcase-muted">The consumer controls the open state.</p><Button size="sm" onClick={() => setOpen(false)}>Close</Button></div>}</div>;
  if (kind === "table") return <div className="showcase-table"><div className="showcase-table-row showcase-table-head"><span>Component</span><span>Type</span><span>Status</span></div><div className="showcase-table-row"><span>Button</span><span>Core</span><Badge>Stable</Badge></div><div className="showcase-table-row"><span>Select</span><span>Form</span><Badge>Stable</Badge></div></div>;
  if (kind === "calendar") return <div className="docs-placeholder">EventCalendar preview uses the selected date and event contract supplied by the consumer.</div>;
  if (kind === "chart") return <div className="docs-placeholder">Chart preview renders SVG from the series definition and async state.</div>;
  if (kind === "files") return <div className="docs-preview-row"><Button variant="outline">Choose files</Button><Switch checked={enabled} onCheckedChange={setEnabled} /> <span className="showcase-muted">Validation enabled</span></div>;
  return null;
}

function CodeBlock({ children }: { children: string }) {
  const [copied, setCopied] = useState(false);
  return <div className="docs-code-wrap"><pre><code>{children}</code></pre><button type="button" className="docs-copy-button" onClick={() => { void navigator.clipboard?.writeText(children); setCopied(true); window.setTimeout(() => setCopied(false), 1200); }} aria-label="Copy code">{copied ? <Check size={15} /> : <Copy size={15} />}</button></div>;
}

function ApiRow({ name, type, description }: { name: string; type: string; description: string }) {
  return <div className="docs-api-row"><code>{name}</code><code>{type}</code><span>{description}</span></div>;
}

export function ComponentDocsPage({ path }: { path: string }) {
  const [currentPath, setCurrentPath] = useState(path);
  useEffect(() => {
    const onNavigate = (event: Event) => setCurrentPath((event as CustomEvent<string>).detail);
    window.addEventListener("edjavu:navigate", onNavigate);
    return () => window.removeEventListener("edjavu:navigate", onNavigate);
  }, []);
  const page = pages.find((item) => item.path === currentPath) ?? pages.find((item) => currentPath.startsWith(item.path.split("/").slice(0, 3).join("/"))) ?? pages[0];
  const index = pages.findIndex((item) => item.path === page.path);
  const previous = pages[index - 1];
  const next = pages[index + 1];
  const categoryPages = pages.filter((item) => item.category === page.category);
  const navigate = (url: string) => { window.history.replaceState({}, "", url); window.dispatchEvent(new CustomEvent("edjavu:navigate", { detail: url })); };
  return <article className="docs-page">
    <div className="docs-page-heading"><div><Badge variant="secondary">{page.category}</Badge><h1>{page.name}</h1><p>{page.description}</p></div><div className="docs-heading-actions"><Button variant="outline" onClick={() => navigate("/")}>Back to overview</Button></div></div>
    <Tabs defaultValue="preview"><TabsList><TabsTrigger value="preview">Preview</TabsTrigger><TabsTrigger value="code">Code</TabsTrigger></TabsList><TabsContent value="preview"><Card className="docs-demo-card"><CardHeader><CardTitle>Preview</CardTitle><CardDescription>Interact with the component before adding it to a consumer.</CardDescription></CardHeader><CardContent><Preview kind={page.preview} /></CardContent></Card></TabsContent><TabsContent value="code"><Card className="docs-demo-card"><CardHeader><CardTitle>Usage</CardTitle><CardDescription>The consumer owns data, callbacks, and persistence.</CardDescription></CardHeader><CardContent><CodeBlock>{page.usage}</CodeBlock></CardContent></Card></TabsContent></Tabs>
    <section className="docs-section"><h2>Installation</h2><p>Load the grouped module from the configured Remote UI channel.</p><CodeBlock>{'const remote = await loadRemote("edjavu_ui/core");'}</CodeBlock></section>
    <section className="docs-section"><h2>Usage</h2><p>Keep the component controlled when its value or action belongs to application state.</p><CodeBlock>{page.usage}</CodeBlock></section>
    <section className="docs-section"><h2>API Reference</h2><div className="docs-api"><div className="docs-api-row docs-api-head"><span>Prop</span><span>Type</span><span>Description</span></div><ApiRow name="children" type="ReactNode" description="Content rendered inside the component." /><ApiRow name="className" type="string" description="Optional style override using the shared token system." /><ApiRow name="onChange" type="(value) => void" description="Consumer callback for controlled interaction." /></div></section>
    <section className="docs-section docs-related"><div><h2>In this category</h2><div className="docs-related-list">{categoryPages.map((item) => <button type="button" key={item.path} className={item.path === page.path ? "is-current" : ""} onClick={() => navigate(item.path)}>{item.name}<span>{item.description}</span></button>)}</div></div><div><h2>Next</h2><div className="docs-pager">{previous && <Button variant="outline" onClick={() => navigate(previous.path)}><ArrowLeft size={15} />{previous.name}</Button>}{next && <Button variant="outline" onClick={() => navigate(next.path)}>{next.name}<ArrowRight size={15} /></Button>}</div></div></section>
  </article>;
}

export function isDocsPath(path: string) { return path !== "/"; }

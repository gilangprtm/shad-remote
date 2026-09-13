import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Copy } from "lucide-react";
import { Badge } from "../../core/badge/Badge";
import { Button } from "../../core/button/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../core/card/Card";
import { Input } from "../../core/input/Input";
import { Label } from "../../core/label/Label";
import { Select } from "../../core/select/Select";
import { Switch } from "../../core/switch/Switch";
import { componentRegistry, getComponentDoc } from "./component-registry";

function CodeBlock({ children }: { children: string }) {
  const [copied, setCopied] = useState(false);
  return <div className="docs-code-wrap"><pre><code>{children}</code></pre><button type="button" className="docs-copy-button" onClick={() => { void navigator.clipboard?.writeText(children); setCopied(true); window.setTimeout(() => setCopied(false), 1200); }} aria-label="Copy code">{copied ? <Check size={15} /> : <Copy size={15} />}</button></div>;
}

function Preview({ name }: { name: string }) {
  const [enabled, setEnabled] = useState(true);
  if (name === "Button") return <div className="docs-preview-row"><Button>Default</Button><Button variant="secondary">Secondary</Button><Button variant="outline">Outline</Button><Button variant="ghost">Ghost</Button><Button variant="destructive">Delete</Button><Button variant="link">Link</Button></div>;
  if (name === "Card") return <Card><CardHeader><CardTitle>Card title</CardTitle><CardDescription>A surface for related content.</CardDescription></CardHeader><CardContent><Button size="sm">Continue</Button></CardContent></Card>;
  if (name === "Input") return <div className="docs-preview-form"><Label htmlFor="docs-input">Component name</Label><Input id="docs-input" placeholder="Select" /></div>;
  if (name === "Select") return <div className="docs-preview-form"><Label htmlFor="docs-select">Release channel</Label><Select id="docs-select" defaultValue="stable"><option value="stable">Stable</option><option value="canary">Canary</option></Select></div>;
  if (name === "Switch") return <div className="docs-preview-row"><Switch checked={enabled} onCheckedChange={setEnabled} /><span className="showcase-muted">{enabled ? "Enabled" : "Disabled"}</span></div>;
  if (name === "Badge") return <div className="docs-preview-row"><Badge>Stable</Badge><Badge variant="secondary">Preview</Badge><Badge variant="outline">Optional</Badge><Badge variant="destructive">Deprecated</Badge></div>;
  return <div className="docs-placeholder">Interactive preview for {name}. The example uses the public contract shown below.</div>;
}

function ApiReference({ page }: { page: ReturnType<typeof getComponentDoc> }) {
  if (!page) return null;
  return <section className="docs-section"><h2>API Reference</h2><div className="docs-api"><div className="docs-api-row docs-api-head"><span>Prop</span><span>Type</span><span>Description</span></div>{page.api.map((item) => <div className="docs-api-row" key={item.name}><code>{item.name}</code><code>{item.type}</code><span>{item.description}</span></div>)}</div></section>;
}

export function ComponentDocsPage({ path }: { path: string }) {
  const [currentPath, setCurrentPath] = useState(path);
  useEffect(() => {
    const onNavigate = (event: Event) => setCurrentPath((event as CustomEvent<string>).detail);
    window.addEventListener("edjavu:navigate", onNavigate);
    return () => window.removeEventListener("edjavu:navigate", onNavigate);
  }, []);
  const page = getComponentDoc(currentPath) ?? componentRegistry[0];
  const index = componentRegistry.findIndex((item) => item.path === page.path);
  const previous = componentRegistry[index - 1];
  const next = componentRegistry[index + 1];
  const categoryPages = componentRegistry.filter((item) => item.group === page.group);
  const navigate = (url: string) => { window.history.replaceState({}, "", url); window.dispatchEvent(new CustomEvent("edjavu:navigate", { detail: url })); };
  return <article className="docs-page">
    <div className="docs-page-heading"><div><Badge variant="secondary">{page.group}</Badge><h1>{page.name}</h1><p>{page.description}</p></div><div className="docs-heading-actions"><Button variant="outline" onClick={() => navigate("/")}>Back to overview</Button></div></div>
    <section className="docs-section"><h2>Preview</h2><p>Try the public behavior before adding the component to a consumer.</p><Card className="docs-demo-card"><CardContent><Preview name={page.name} /></CardContent></Card></section>
    <section className="docs-section"><h2>Installation</h2><p>Load the grouped module from the configured Remote UI channel.</p><CodeBlock>{`const remote = await loadRemote("${page.module}");`}</CodeBlock></section>
    <section className="docs-section"><h2>Usage</h2><p>The consumer owns data, callbacks, and persistence. Remote UI owns the presentation and local interaction state.</p><CodeBlock>{page.usage}</CodeBlock></section>
    <section className="docs-section"><h2>Variations</h2><p>{page.variants.length} documented variation{page.variants.length === 1 ? "" : "s"} are available for this component.</p><div className="docs-variants">{page.variants.map((variant) => <Card key={variant.name}><CardHeader><CardTitle>{variant.name}</CardTitle><CardDescription>{variant.description}</CardDescription></CardHeader><CardContent><CodeBlock>{variant.code}</CodeBlock></CardContent></Card>)}</div></section>
    <ApiReference page={page} />
    <section className="docs-section docs-related"><div><h2>In this category</h2><div className="docs-related-list">{categoryPages.map((item) => <button type="button" key={item.path} className={item.path === page.path ? "is-current" : ""} onClick={() => navigate(item.path)}>{item.name}<span>{item.variants.length} variation{item.variants.length === 1 ? "" : "s"}</span></button>)}</div></div><div><h2>Next</h2><div className="docs-pager">{previous && <Button variant="outline" onClick={() => navigate(previous.path)}><ArrowLeft size={15} />{previous.name}</Button>}{next && <Button variant="outline" onClick={() => navigate(next.path)}>{next.name}<ArrowRight size={15} /></Button>}</div></div></section>
  </article>;
}

export function isDocsPath(path: string) { return path !== "/"; }

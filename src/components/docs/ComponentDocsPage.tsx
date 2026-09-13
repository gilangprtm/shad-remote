import { useEffect, useState, type ReactNode } from "react";
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
  return <div className="docs-placeholder"><strong>Contract preview</strong><p>This page shows the public contract for {name}. A live preview will be added when the producer wiring is available.</p></div>;
}

type SelectExample = {
  title: string;
  description: string;
  code: string;
  preview: ReactNode;
};

function SelectDocumentation() {
  const examples: SelectExample[] = [
    {
      title: "Composition",
      description: "Combine Label, Select, and supporting text when the control needs context.",
      code: `<div className="field">\n  <Label htmlFor="fruit">Fruit</Label>\n  <Select id="fruit" defaultValue="apple">\n    <option value="apple">Apple</option>\n    <option value="banana">Banana</option>\n  </Select>\n  <p>Choose one item.</p>\n</div>`,
      preview: <div className="docs-preview-form"><Label htmlFor="select-composition">Fruit</Label><Select id="select-composition" defaultValue="apple"><option value="apple">Apple</option><option value="banana">Banana</option></Select><span className="showcase-muted">Choose one item.</span></div>,
    },
    {
      title: "Groups",
      description: "Use native optgroup labels to organize related options.",
      code: `<Select defaultValue="button">\n  <optgroup label="Primitives">\n    <option value="button">Button</option>\n    <option value="card">Card</option>\n  </optgroup>\n  <optgroup label="Forms">\n    <option value="input">Input</option>\n    <option value="select">Select</option>\n  </optgroup>\n</Select>`,
      preview: <div className="docs-preview-form"><Label htmlFor="select-groups">Component</Label><Select id="select-groups" defaultValue="button"><optgroup label="Primitives"><option value="button">Button</option><option value="card">Card</option></optgroup><optgroup label="Forms"><option value="input">Input</option><option value="select">Select</option></optgroup></Select></div>,
    },
    {
      title: "Long option list",
      description: "A native select delegates option-list scrolling to the browser and platform.",
      code: `<Select defaultValue="utc">\n  <option value="utc">UTC</option>\n  <option value="asia-jakarta">Asia/Jakarta</option>\n  <option value="europe-london">Europe/London</option>\n  <option value="america-new-york">America/New York</option>\n  {/* additional consumer-owned options */}\n</Select>`,
      preview: <div className="docs-preview-form"><Label htmlFor="select-long">Timezone</Label><Select id="select-long" defaultValue="utc"><option value="utc">UTC</option><option value="asia-jakarta">Asia/Jakarta</option><option value="europe-london">Europe/London</option><option value="america-new-york">America/New York</option><option value="australia-sydney">Australia/Sydney</option></Select></div>,
    },
    {
      title: "Disabled",
      description: "Use the disabled attribute when the consumer temporarily prevents selection.",
      code: `<Select disabled defaultValue="unavailable">\n  <option value="unavailable">Unavailable</option>\n</Select>`,
      preview: <div className="docs-preview-form"><Label htmlFor="select-disabled">Release channel</Label><Select id="select-disabled" disabled defaultValue="unavailable"><option value="unavailable">Unavailable</option></Select></div>,
    },
    {
      title: "Invalid",
      description: "Pair aria-invalid with visible supporting text supplied by the consumer.",
      code: `<Label htmlFor="select-invalid">Fruit</Label>\n<Select id="select-invalid" aria-invalid="true" defaultValue="">\n  <option value="" disabled>Select a fruit</option>\n  <option value="apple">Apple</option>\n</Select>\n<p role="alert">Please select a fruit.</p>`,
      preview: <div className="docs-preview-form"><Label htmlFor="select-invalid">Fruit</Label><Select id="select-invalid" aria-invalid="true" defaultValue=""><option value="" disabled>Select a fruit</option><option value="apple">Apple</option></Select><span className="docs-error" role="alert">Please select a fruit.</span></div>,
    },
    {
      title: "RTL",
      description: "Set the direction on the containing region when the consumer is rendering right-to-left content.",
      code: `<div dir="rtl">\n  <Label htmlFor="select-rtl">فاكهة</Label>\n  <Select id="select-rtl" defaultValue="apple">\n    <option value="apple">تفاح</option>\n    <option value="banana">موز</option>\n  </Select>\n</div>`,
      preview: <div className="docs-preview-form docs-rtl-preview" dir="rtl"><Label htmlFor="select-rtl">فاكهة</Label><Select id="select-rtl" defaultValue="apple"><option value="apple">تفاح</option><option value="banana">موز</option></Select></div>,
    },
  ];
  return <section className="docs-section docs-component-sections"><div className="docs-section-intro"><h2>Examples</h2><p>Each example below documents one named usage pattern. The previews are separate so the behavior and configuration can be compared without merging unrelated cases.</p></div>{examples.map((example) => <section className="docs-example-section" key={example.title}><div><h3>{example.title}</h3><p>{example.description}</p></div><Card className="docs-example-card"><CardContent>{example.preview}</CardContent></Card><CodeBlock>{example.code}</CodeBlock></section>)}</section>;
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
  const navigate = (url: string) => { window.history.replaceState({}, "", url); window.dispatchEvent(new CustomEvent("edjavu:navigate", { detail: url })); };
  const page = getComponentDoc(currentPath);
  if (!page) return <article className="docs-page"><div className="docs-page-heading"><div><Badge variant="destructive">Not found</Badge><h1>Documentation not found</h1><p>No documented component matches this path.</p></div><div className="docs-heading-actions"><Button variant="outline" onClick={() => navigate("/")}>Back to overview</Button></div></div></article>;
  const index = componentRegistry.findIndex((item) => item.path === page.path);
  const previous = componentRegistry[index - 1];
  const next = componentRegistry[index + 1];
  const categoryPages = componentRegistry.filter((item) => item.group === page.group);
  return <article className="docs-page">
    <div className="docs-page-heading"><div><Badge variant="secondary">{page.group}</Badge><h1>{page.name}</h1><p>{page.description}</p></div><div className="docs-heading-actions"><Button variant="outline" onClick={() => navigate("/")}>Back to overview</Button></div></div>
    <section className="docs-section"><h2>Preview</h2><p>Try the public behavior before adding the component to a consumer.</p><Card className="docs-demo-card"><CardContent><Preview name={page.name} /></CardContent></Card></section>
    <section className="docs-section"><h2>Installation</h2><p>Load the grouped module from the configured Remote UI channel.</p><CodeBlock>{`const remote = await loadRemote("${page.module}");`}</CodeBlock></section>
    <section className="docs-section"><h2>Usage</h2><p>The consumer owns data, callbacks, and persistence. Remote UI owns the presentation and local interaction state.</p><CodeBlock>{page.usage}</CodeBlock></section>
    {page.name === "Select" ? <SelectDocumentation /> : <section className="docs-section"><h2>Variations</h2><p>{page.variants.length} documented variation{page.variants.length === 1 ? "" : "s"} are available for this component.</p><div className="docs-variants">{page.variants.map((variant) => <Card key={variant.name}><CardHeader><CardTitle>{variant.name}</CardTitle><CardDescription>{variant.description}</CardDescription></CardHeader><CardContent><CodeBlock>{variant.code}</CodeBlock></CardContent></Card>)}</div></section>}
    <ApiReference page={page} />
    <section className="docs-section docs-related"><div><h2>In this category</h2><div className="docs-related-list">{categoryPages.map((item) => <button type="button" key={item.path} className={item.path === page.path ? "is-current" : ""} onClick={() => navigate(item.path)}>{item.name}<span>{item.variants.length} variation{item.variants.length === 1 ? "" : "s"}</span></button>)}</div></div><div><h2>Next</h2><div className="docs-pager">{previous && <Button variant="outline" onClick={() => navigate(previous.path)}><ArrowLeft size={15} />{previous.name}</Button>}{next && <Button variant="outline" onClick={() => navigate(next.path)}>{next.name}<ArrowRight size={15} /></Button>}</div></div></section>
  </article>;
}

export function isDocsPath(path: string) { return path !== "/"; }

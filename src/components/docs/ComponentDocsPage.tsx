import { useEffect, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Check, Copy, Download, MoreHorizontal, Plus, Search, Settings } from "lucide-react";
import { Badge } from "../../core/badge/Badge";
import { Button } from "../../core/button/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../core/card/Card";
import { Input } from "../../core/input/Input";
import { Label } from "../../core/label/Label";
import { Select } from "../../core/select/Select";
import { Switch } from "../../core/switch/Switch";
import { Checkbox } from "../../core/checkbox/Checkbox";
import { Alert, AlertDescription } from "../../core/alert/Alert";
import { Avatar, AvatarFallback } from "../../core/avatar/Avatar";
import { Progress } from "../../core/progress/Progress";
import { Skeleton } from "../../core/skeleton/Skeleton";
import { Separator } from "../../core/separator/Separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../core/tabs/Tabs";
import { Tooltip } from "../../core/tooltip/Tooltip";
import { Popover } from "../../core/popover/Popover";
import { Slider } from "../../core/controls/Controls";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../core/accordion/Accordion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../core/collapsible/Collapsible";
import { Spinner, Kbd, AspectRatio, ScrollArea, Item, Field, NativeSelect } from "../../core/misc/Misc";
import { Direction, Empty, HoverCard, Marker, Message, MessageScroller, Typography, Calendar, Toast } from "../../core/foundation/Foundation";
import { Attachment, Bubble, Questionnaire } from "../../core/foundation/ExtendedFoundation";
import { InputGroup, InputOTP, Carousel, Resizable } from "../../core/advanced/Advanced";
import { DropdownMenu, DropdownMenuItem, ContextMenu, Menubar, MenubarItem, NavigationMenu, NavigationMenuLink, Combobox } from "../../core/menus/Menus";
import { componentRegistry, getComponentDoc } from "./component-registry";

function CodeBlock({ children }: { children: string }) {
  const [copied, setCopied] = useState(false);
  return <div className="docs-code-wrap"><pre><code>{children}</code></pre><button type="button" className="docs-copy-button" onClick={() => { void navigator.clipboard?.writeText(children); setCopied(true); window.setTimeout(() => setCopied(false), 1200); }} aria-label="Copy code">{copied ? <Check size={15} /> : <Copy size={15} />}</button></div>;
}

function ButtonPreview({ variant = "All variants" }: { variant?: string }) {
  if (variant === "All variants") return <div className="docs-preview-row docs-preview-centered"><Button>Default</Button><Button variant="secondary">Secondary</Button><Button variant="outline">Outline</Button><Button variant="ghost">Ghost</Button><Button variant="destructive">Delete item</Button><Button variant="link">View details</Button></div>;
  if (variant === "Sizes") return <div className="docs-preview-row docs-preview-centered"><Button size="xs">Extra small</Button><Button size="sm">Small</Button><Button>Default</Button><Button size="lg">Large</Button></div>;
  if (variant === "Icon only") return <div className="docs-preview-row docs-preview-centered"><Button size="icon" aria-label="Search"><Search /></Button><Button size="icon" variant="outline" aria-label="Settings"><Settings /></Button><Button size="icon" variant="ghost" aria-label="More actions"><MoreHorizontal /></Button></div>;
  if (variant === "Icon with title") return <div className="docs-preview-row docs-preview-centered"><Button><Plus />Add item</Button><Button variant="outline"><Download />Download</Button></div>;
  if (variant === "Loading") return <div className="docs-preview-row docs-preview-centered"><Button disabled aria-busy="true"><span className="docs-spinner" aria-hidden="true" />Saving…</Button></div>;
  if (variant === "Disabled") return <div className="docs-preview-row docs-preview-centered"><Button disabled>Default</Button><Button disabled variant="outline">Unavailable</Button><Button disabled variant="destructive">Delete item</Button></div>;
  if (variant === "Form actions") return <div className="docs-preview-actions"><Button variant="ghost">Cancel</Button><Button variant="outline">Save draft</Button><Button>Submit</Button></div>;
  if (variant === "Destructive confirmation") return <div className="docs-preview-actions"><Button variant="outline">Cancel</Button><Button variant="destructive">Delete item</Button></div>;
  if (variant === "Link action") return <div className="docs-preview-copy">Use a <Button variant="link">link-style button</Button> for an in-page action. Use an anchor for navigation.</div>;
  const variants: Record<string, ReactNode> = { Default: <Button>Default</Button>, Secondary: <Button variant="secondary">Secondary</Button>, Outline: <Button variant="outline">Outline</Button>, Ghost: <Button variant="ghost">Ghost</Button>, Destructive: <Button variant="destructive">Delete item</Button>, Link: <Button variant="link">View details</Button> };
  return <div className="docs-preview-row docs-preview-centered">{variants[variant] ?? variants.Default}</div>;
}

function ComponentPreview({ name, variant }: { name: string; variant?: string }) {
  const [checked, setChecked] = useState(false);
  const [tab, setTab] = useState("one");
  if (name === "Checkbox") return <label className="docs-preview-row docs-preview-centered"><Checkbox checked={checked} onCheckedChange={(value) => setChecked(value === true)} /><span>{checked ? "Selected" : "Not selected"}</span></label>;
  if (name === "Alert") return <Alert title={variant === "Destructive" ? "Action failed" : "Notice"}><AlertDescription>{variant === "Destructive" ? "Try the action again." : "The component is ready to use."}</AlertDescription></Alert>;
  if (name === "Avatar") return <div className="docs-preview-row docs-preview-centered"><Avatar><AvatarFallback>GP</AvatarFallback></Avatar></div>;
  if (name === "Progress") return <div className="docs-preview-form"><Progress value={variant === "Determinate" ? 64 : 32} /><span className="showcase-muted">{variant === "Determinate" ? "64% complete" : "32% complete"}</span></div>;
  if (name === "Skeleton") return <div className="docs-preview-form"><Skeleton className={variant === "Block" ? "h-20 w-full" : "h-4 w-40"} /></div>;
  if (name === "Separator") return <div className={variant === "Vertical" ? "flex h-10 items-center" : "w-full"}><Separator orientation={variant === "Vertical" ? "vertical" : "horizontal"} /></div>;
  if (name === "Tabs") return <Tabs value={tab} onValueChange={setTab}><TabsList><TabsTrigger value="one">Overview</TabsTrigger><TabsTrigger value="two">Details</TabsTrigger></TabsList><TabsContent value="one">Overview content</TabsContent><TabsContent value="two">Details content</TabsContent></Tabs>;
  if (name === "Tooltip") return <Tooltip content="Copy"><Button variant="outline">Hover or focus</Button></Tooltip>;
  if (name === "Popover") return <Popover trigger={<Button variant="outline">Open popover</Button>}>Interactive content</Popover>;
  if (name === "Slider") return <Slider value={64} onValueChange={() => undefined} aria-label="Volume" />;
  if (name === "Accordion") return <Accordion><AccordionItem value="item-1"><AccordionTrigger>What does it do?</AccordionTrigger><AccordionContent>It reveals related content.</AccordionContent></AccordionItem></Accordion>;
  if (name === "Collapsible") return <Collapsible><CollapsibleTrigger><Button variant="outline">Show details</Button></CollapsibleTrigger><CollapsibleContent>Additional details.</CollapsibleContent></Collapsible>;
  if (name === "Aspect Ratio") return <AspectRatio ratio={variant === "Square" ? 1 : 16 / 9}><div className="docs-preview-media">{variant === "Square" ? "1:1" : "16:9"}</div></AspectRatio>;
  if (name === "Scroll Area") return <ScrollArea className="docs-preview-scroll"><div className="docs-preview-form">{["First item", "Second item", "Third item", "Fourth item"].map((item) => <Item key={item}>{item}</Item>)}</div></ScrollArea>;
  if (name === "Spinner") return <div className="docs-preview-row docs-preview-centered"><Spinner aria-label="Loading" /><span className="showcase-muted">Loading results</span></div>;
  if (name === "Kbd") return <div className="docs-preview-row docs-preview-centered"><Kbd>{variant === "Shortcut" ? "⌘K" : "Esc"}</Kbd></div>;
  if (name === "Native Select") return <NativeSelect defaultValue="stable"><option value="stable">Stable</option><option value="canary">Canary</option></NativeSelect>;
  if (name === "Field") return <Field label="Email" description="Use your work address."><Input placeholder="name@example.com" /></Field>;
  if (name === "Input Group") return <InputGroup prefix="https://"><Input placeholder="example.com" /></InputGroup>;
  if (name === "Input OTP") return <InputOTP length={variant === "Four digits" ? 4 : 6} value="123" onChange={() => undefined} />;
  if (name === "Carousel") return <Carousel items={["First panel", "Second panel", "Third panel"]} />;
  if (name === "Combobox") return <Combobox options={[{ value: "button", label: "Button" }, { value: "card", label: "Card" }, { value: "input", label: "Input" }]} value="button" onValueChange={() => undefined} placeholder="Choose a component" />;
  if (name === "Dropdown Menu") return <DropdownMenu trigger={<Button variant="outline">Actions</Button>}><DropdownMenuItem onSelect={() => undefined}>Rename</DropdownMenuItem><DropdownMenuItem onSelect={() => undefined}>Archive</DropdownMenuItem></DropdownMenu>;
  if (name === "Context Menu") return <ContextMenu menu={<DropdownMenuItem onSelect={() => undefined}>Rename</DropdownMenuItem>}><Button variant="outline">Right click</Button></ContextMenu>;
  if (name === "Menubar") return <Menubar><MenubarItem onClick={() => undefined}>File</MenubarItem><MenubarItem onClick={() => undefined}>Edit</MenubarItem></Menubar>;
  if (name === "Navigation Menu") return <NavigationMenu><NavigationMenuLink href="#overview" active>Overview</NavigationMenuLink><NavigationMenuLink href="#docs">Docs</NavigationMenuLink></NavigationMenu>;
  if (name === "Direction") return <Direction dir={variant === "RTL" ? "rtl" : "ltr"}><div className="docs-preview-copy">{variant === "RTL" ? "محتوى" : "Content"}</div></Direction>;
  if (name === "Empty") return <Empty title="No results" description="Try another filter." action={<Button variant="outline">Reset</Button>} />;
  if (name === "Hover Card") return <HoverCard trigger={<Button variant="link">View details</Button>}>Supporting information.</HoverCard>;
  if (name === "Marker") return <div className="docs-preview-copy">Review the <Marker>important change</Marker> before publishing.</div>;
  if (name === "Message") return <Message variant={variant === "Error" ? "error" : variant === "Success" ? "success" : "default"} title={variant === "Error" ? "Could not save" : variant === "Success" ? "Saved" : "Notice"}>A consumer-owned message.</Message>;
  if (name === "Message Scroller") return <MessageScroller messages={["Connected", "Sync started", "Waiting for response"]} />;
  if (name === "Attachment") return <Attachment name="report.pdf" type="PDF" size="2 MB" action={<Button size="sm"><Download />Download</Button>} />;
  if (name === "Bubble") return <div className="docs-preview-form"><Bubble role={variant === "User" ? "user" : "assistant"}>{variant === "User" ? "Can you review this?" : "The review is ready."}</Bubble></div>;
  if (name === "Questionnaire") return <Questionnaire name="plan" question="Choose a plan" options={[{ value: "starter", label: "Starter", description: "For one project." }, { value: "team", label: "Team", description: "For shared work." }]} value="starter" onValueChange={() => undefined} />;
  if (name === "Typography") return <Typography as={variant === "Quote" ? "blockquote" : variant === "Code" ? "code" : "h2"}>{variant === "Quote" ? "A useful quote" : variant === "Code" ? "npm run build" : "Section title"}</Typography>;
  if (name === "Toast") return <Toast title="Saved" description="Changes are live." onDismiss={() => undefined} />;
  if (name === "Resizable") return <Resizable direction={variant === "Vertical" ? "vertical" : "horizontal"}>{[<div key="a" className="docs-preview-panel">Panel A</div>, <div key="b" className="docs-preview-panel">Panel B</div>]}</Resizable>;
  if (name === "Drawer" || name === "Sheet" || name === "Dialog" || name === "Alert Dialog") return <div className="docs-inline-dialog"><strong>{name}</strong><p>Open this surface from a consumer-owned trigger.</p><Button variant={name === "Alert Dialog" ? "destructive" : "outline"}>{name === "Alert Dialog" ? "Confirm" : "Open"}</Button></div>;
  return <div className="docs-placeholder"><strong>Contract preview</strong><p>This page shows the public contract for {name}. A live preview will be added when the producer wiring is available.</p></div>;
}

function Preview({ name, variant }: { name: string; variant?: string }) {
  const [enabled, setEnabled] = useState(true);
  if (name === "Button") return <ButtonPreview variant={variant} />;
  if (name === "Card") return <Card><CardHeader><CardTitle>Card title</CardTitle><CardDescription>A surface for related content.</CardDescription></CardHeader><CardContent><Button size="sm">Continue</Button></CardContent></Card>;
  if (name === "Input") return <div className="docs-preview-form"><Label htmlFor="docs-input">Component name</Label><Input id="docs-input" placeholder="Select" /></div>;
  if (name === "Select") return <div className="docs-preview-form"><Label htmlFor="docs-select">Release channel</Label><Select id="docs-select" defaultValue="stable"><option value="stable">Stable</option><option value="canary">Canary</option></Select></div>;
  if (name === "Switch") return <div className="docs-preview-row"><Switch checked={enabled} onCheckedChange={setEnabled} /><span className="showcase-muted">{enabled ? "Enabled" : "Disabled"}</span></div>;
  if (name === "Badge") return <div className="docs-preview-row docs-preview-centered"><Badge>Stable</Badge><Badge variant="secondary">Preview</Badge><Badge variant="outline">Optional</Badge><Badge variant="destructive">Deprecated</Badge></div>;
  return <ComponentPreview name={name} variant={variant} />;
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
    <section className="docs-section"><h2>Preview</h2><p>Try the public behavior before adding the component to a consumer.</p><div className="docs-demo-preview"><Preview name={page.name} /></div></section>
    <section className="docs-section"><h2>Installation</h2><p>Load the grouped module from the configured Remote UI channel.</p><CodeBlock>{`const remote = await loadRemote("${page.module}");`}</CodeBlock></section>
    <section className="docs-section"><h2>Usage</h2><p>The consumer owns data, callbacks, and persistence. Remote UI owns the presentation and local interaction state.</p><CodeBlock>{page.usage}</CodeBlock></section>
    {page.name === "Select" ? <SelectDocumentation /> : <section className="docs-section docs-component-sections"><div className="docs-section-intro"><h2>Examples</h2><p>{page.variants.length} named variation{page.variants.length === 1 ? "" : "s"} are documented separately so each behavior can be evaluated on its own.</p></div>{page.variants.map((variant) => <section className="docs-example-section" key={variant.name}><div><h3>{variant.name}</h3><p>{variant.description}</p></div><div className="docs-example-preview"><Preview name={page.name} variant={variant.name} /></div><CodeBlock>{variant.code}</CodeBlock></section>)}</section>}
    <ApiReference page={page} />
    <section className="docs-section docs-related"><div><h2>In this category</h2><div className="docs-related-list">{categoryPages.map((item) => <button type="button" key={item.path} className={item.path === page.path ? "is-current" : ""} onClick={() => navigate(item.path)}>{item.name}<span>{item.variants.length} variation{item.variants.length === 1 ? "" : "s"}</span></button>)}</div></div><div><h2>Next</h2><div className="docs-pager">{previous && <Button variant="outline" onClick={() => navigate(previous.path)}><ArrowLeft size={15} />{previous.name}</Button>}{next && <Button variant="outline" onClick={() => navigate(next.path)}>{next.name}<ArrowRight size={15} /></Button>}</div></div></section>
  </article>;
}

export function isDocsPath(path: string) { return path !== "/"; }

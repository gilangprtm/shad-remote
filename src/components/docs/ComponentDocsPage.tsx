import { useEffect, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, Check, CheckCircle2, CircleAlert, Copy, Download, Info, LockKeyhole, Mail, MoreHorizontal, Plus, Search, Settings } from "lucide-react";
import { Badge } from "../../core/badge/Badge";
import { Button } from "../../core/button/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../core/card/Card";
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
import { Spinner, Kbd, AspectRatio, ScrollArea, Field, NativeSelect } from "../../core/misc/Misc";
import { Direction, Empty, HoverCard, Marker, Message, MessageScroller, Typography, Calendar, Toast } from "../../core/foundation/Foundation";
import { Dialog } from "../../core/dialog/Dialog";
import { AlertDialog, Drawer, Sheet } from "../../core/overlay/Overlay";
import { Attachment, Bubble, Questionnaire } from "../../core/foundation/ExtendedFoundation";
import { InputGroup, InputOTP, Carousel, Resizable } from "../../core/advanced/Advanced";
import { DropdownMenu, DropdownMenuItem, ContextMenu, Menubar, MenubarItem, NavigationMenu, NavigationMenuLink, Combobox } from "../../core/menus/Menus";
import { ButtonGroup, ToggleGroup, ToggleGroupItem } from "../../core/controls/Controls";
import { Toggle } from "../../core/toggle/Toggle";
import { Command, CommandInput, CommandList, CommandGroup, CommandItem, CommandEmpty } from "../../core/command/Command";
import { Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption } from "../../core/table/Table";
import { Textarea } from "../../core/textarea/Textarea";
import { Breadcrumb } from "../../shell/breadcrumb/Breadcrumb";
import { Pagination } from "../../components/pagination/Pagination";
import { DataTable } from "../../components/data-table/DataTable";
import { Chart } from "../../components/chart/Chart";
import { DatePicker } from "../../components/date-picker/DatePicker";
import { DateRangePicker } from "../../components/date-picker/DateRangePicker";
import { RadioGroup, RadioGroupItem } from "../../core/radio-group/RadioGroup";
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarInset } from "../../shell/sidebar/Sidebar";
import { Item } from "../../core/misc/Misc";
import { EventCalendar } from "../../components/calendar/EventCalendar";
import { FilterBar } from "../../components/filter-bar/FilterBar";
import { StatCard } from "../../components/stat-card/StatCard";
import { EmptyState } from "../../components/empty-state/EmptyState";
import { CommandPalette } from "../../components/command-palette/CommandPalette";
import { FileUploader } from "../../components/file-uploader/FileUploader";
import type { CalendarEvent } from "../../contracts/calendar";
import type { UploadFile } from "../../contracts/files";
import type { CommandItem as CommandDefinition } from "../../contracts/command";
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
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [filterValue, setFilterValue] = useState("");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  if (name === "Checkbox") return <CheckboxPreview variant={variant} />;
  if (name === "Alert") return <AlertPreview variant={variant} />;
  if (name === "Input") return <InputPreview variant={variant} />;
  if (name === "Label") return <div className="docs-preview-form"><Label htmlFor="label-preview">Project name</Label><Input id="label-preview" placeholder="Remote UI" /></div>;
  if (name === "Breadcrumb") return <Breadcrumb items={[{ label: "Workspace", href: "#workspace" }, { label: "Projects", href: "#projects" }, { label: "Remote UI" }]} />;
  if (name === "Button Group") return <ButtonGroup><Button variant="outline">Previous</Button><Button variant="outline">Next</Button></ButtonGroup>;
  if (name === "Command") { const [query, setQuery] = useState(""); return <Command className="max-w-sm"><CommandInput value={query} onValueChange={setQuery} placeholder="Search commands..." /><CommandList><CommandGroup heading="Actions"><CommandItem value="new project" query={query}>New project</CommandItem><CommandItem value="open settings" query={query}>Open settings</CommandItem></CommandGroup><CommandEmpty>No matching commands.</CommandEmpty></CommandList></Command>; }
  if (name === "Calendar") return <Calendar value="2026-09-13" onChange={() => undefined} />;
  if (name === "Pagination") return <Pagination page={variant === "First page" ? 1 : 3} pageCount={10} onPageChange={() => undefined} />;
  if (name === "Textarea") return <div className="docs-preview-form"><Label htmlFor="docs-textarea">Message</Label><Textarea id="docs-textarea" placeholder="Describe the change" rows={4} /><span className="showcase-muted">Markdown is supported.</span></div>;
  if (name === "Toggle") return <Toggle pressed={variant === "On"} onPressedChange={() => undefined}>Bold</Toggle>;
  if (name === "Toggle Group") return <ToggleGroup defaultValue="week"><ToggleGroupItem value="day">Day</ToggleGroupItem><ToggleGroupItem value="week">Week</ToggleGroupItem><ToggleGroupItem value="month">Month</ToggleGroupItem></ToggleGroup>;
  if (name === "Table") return <Table><TableCaption>Recent workspace activity</TableCaption><TableHeader><TableRow><TableHead>Event</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell>Sync completed</TableCell><TableCell>Ready</TableCell></TableRow><TableRow><TableCell>Report queued</TableCell><TableCell>Waiting</TableCell></TableRow></TableBody><TableFooter><TableRow><TableCell colSpan={2}>2 events</TableCell></TableRow></TableFooter></Table>;
  if (name === "Data Table") return <DataTable data={[{ name: "Weekly report", status: "Ready" }, { name: "Workspace sync", status: "Running" }]} columns={[{ key: "name", header: "Job" }, { key: "status", header: "Status" }]} />;
  if (name === "Chart") { const kind: "line" | "bar" | "area" | "pie" | "donut" = variant === "Bar" ? "bar" : variant === "Area" ? "area" : variant === "Pie" ? "pie" : variant === "Donut" ? "donut" : "line"; const definition = { kind, series: [{ key: "desktop", label: "Desktop" }, { key: "mobile", label: "Mobile" }], title: "Visitors by device", description: "Last 3 months" }; return <Chart definition={definition} state={{ status: "ready", data: [{ desktop: 7324, mobile: 6250 }, { desktop: 8110, mobile: 7250 }, { desktop: 9020, mobile: 8250 }] }} />; }
  if (name === "Radio Group") return <RadioGroup defaultValue="pro" className="grid gap-3"><label className="flex items-start gap-3"><RadioGroupItem value="starter" /><span><strong>Starter</strong><small className="showcase-muted block">For individuals and small teams.</small></span></label><label className="flex items-start gap-3"><RadioGroupItem value="pro" /><span><strong>Pro</strong><small className="showcase-muted block">For growing businesses.</small></span></label><label className="flex items-start gap-3"><RadioGroupItem value="enterprise" disabled={variant === "Disabled"} /><span><strong>Enterprise</strong><small className="showcase-muted block">For large teams.</small></span></label></RadioGroup>;
  if (name === "Sidebar") return <SidebarProvider open={variant !== "Collapsed"}><div className="flex min-h-48 w-full"><Sidebar><SidebarHeader><strong>Workspace</strong></SidebarHeader><SidebarContent><nav className="grid gap-1 text-sm"><a href="#overview" className="rounded px-2 py-1 hover:bg-muted">Overview</a><a href="#projects" className="rounded px-2 py-1 hover:bg-muted">Projects</a></nav></SidebarContent><SidebarFooter><span className="text-xs">Account</span></SidebarFooter></Sidebar><SidebarInset><div className="p-4 text-sm">Main content area</div></SidebarInset></div></SidebarProvider>;
  if (name === "Date Picker") return variant === "Range" ? <DateRangePicker defaultValue={{ from: new Date("2026-01-20"), to: new Date("2026-02-09") }} onChange={() => undefined} /> : <DatePicker defaultValue={new Date("2026-09-15")} onChange={() => undefined} />;
  if (name === "Item") return <Item><Avatar><AvatarFallback>GP</AvatarFallback></Avatar><div><strong>Workspace sync</strong><small className="showcase-muted block">Your profile has been verified.</small></div><Button size="sm" variant="outline">Open</Button></Item>;
  if (name === "Stat Card") return <StatCard label="Published components" value="64" description="All documented and Federation-visible" />;
  if (name === "Empty State") return <EmptyState title="No projects yet" description="Create a project to start organizing your components." action={<Button>Create project</Button>} />;
  if (name === "Filter Bar") return <FilterBar value={filterValue} onValueChange={setFilterValue} onReset={() => setFilterValue("")} placeholder="Filter projects..." />;
  if (name === "Command Palette") { const commands: CommandDefinition[] = [{ id: "new", label: "Create project", group: "Project", onSelect: () => undefined }, { id: "settings", label: "Open settings", group: "Workspace", onSelect: () => undefined }]; return <><Button variant="outline" onClick={() => setPaletteOpen(true)}>Open command palette</Button><CommandPalette commands={commands} open={paletteOpen} onOpenChange={setPaletteOpen} /></>; }
  if (name === "File Uploader") { const addFiles = (selected: File[]) => setUploadFiles(selected.map((file, index) => ({ id: `${file.name}-${index}`, file, name: file.name, size: file.size, type: file.type, progress: 0, status: "queued" }))); return <FileUploader files={uploadFiles} multiple accept={["application/pdf", "image/png"]} onFilesSelected={addFiles} onRemove={(id) => setUploadFiles((items) => items.filter((item) => item.id !== id))} onRetry={() => undefined} onCancel={() => undefined} onUpload={() => undefined} />; }
  if (name === "Event Calendar") { const events: CalendarEvent[] = [{ id: "review", title: "Project review", start: new Date("2026-09-15T10:00:00"), end: new Date("2026-09-15T11:00:00") }, { id: "sync", title: "Workspace sync", start: new Date("2026-09-18T14:00:00"), end: new Date("2026-09-18T15:00:00") }]; return <EventCalendar events={events} view={variant === "Week" ? "week" : variant === "Day" ? "day" : "month"} date={new Date("2026-09-13")} onDateChange={() => undefined} onViewChange={() => undefined} onEventClick={() => undefined} onSlotClick={() => undefined} />; }
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
  if (name === "Dialog") return <><Button variant="outline" onClick={() => setOverlayOpen(true)}>Open dialog</Button><Dialog open={overlayOpen} onOpenChange={setOverlayOpen} title="Project details"><p className="text-sm">Review the project configuration before continuing.</p></Dialog></>;
  if (name === "Alert Dialog") return <><Button variant="destructive" onClick={() => setOverlayOpen(true)}>Delete project</Button><AlertDialog open={overlayOpen} onOpenChange={setOverlayOpen} title="Delete project" description="This action cannot be undone." confirmLabel="Delete" /></>;
  if (name === "Drawer") return <><Button variant="outline" onClick={() => setOverlayOpen(true)}>Open drawer</Button><Drawer open={overlayOpen} onOpenChange={setOverlayOpen} title="Filters"><div className="grid gap-3 text-sm"><strong>Filter projects</strong><label><input type="checkbox" /> Active only</label><Button onClick={() => setOverlayOpen(false)}>Apply filters</Button></div></Drawer></>;
  if (name === "Sheet") return <><Button variant="outline" onClick={() => setOverlayOpen(true)}>Open sheet</Button><Sheet open={overlayOpen} onOpenChange={setOverlayOpen} title="Settings"><div className="grid gap-3 text-sm"><strong>Workspace settings</strong><p>Manage notifications and access.</p><Button onClick={() => setOverlayOpen(false)}>Save changes</Button></div></Sheet></>;
  return <div className="docs-placeholder"><strong>Contract preview</strong><p>This page shows the public contract for {name}. A live preview will be added when the producer wiring is available.</p></div>;
}

function BadgePreview({ variant = "Default" }: { variant?: string }) {
  if (variant === "With icon") return <div className="docs-preview-row docs-preview-centered"><Badge><Check />Verified</Badge><Badge variant="outline"><Info />Documentation</Badge></div>;
  if (variant === "With spinner") return <div className="docs-preview-row docs-preview-centered"><Badge><span className="docs-spinner" aria-hidden="true" />Generating</Badge><Badge variant="destructive"><span className="docs-spinner" aria-hidden="true" />Deleting</Badge></div>;
  if (variant === "Link") return <div className="docs-preview-row docs-preview-centered"><Badge variant="link"><a href="#badge-api">Open badge API</a></Badge></div>;
  if (variant === "Custom colors") return <div className="docs-preview-row docs-preview-centered"><Badge className="docs-badge-blue">Blue</Badge><Badge className="docs-badge-green">Green</Badge><Badge className="docs-badge-purple">Purple</Badge><Badge className="docs-badge-red">Red</Badge></div>;
  if (variant === "RTL") return <div className="docs-preview-row docs-preview-centered" dir="rtl"><Badge>شارة</Badge><Badge variant="secondary">ثانوي</Badge><Badge variant="outline">مخطط</Badge></div>;
  return <div className="docs-preview-row docs-preview-centered"><Badge>Default</Badge><Badge variant="secondary">Secondary</Badge><Badge variant="destructive">Destructive</Badge><Badge variant="outline">Outline</Badge></div>;
}

function AlertPreview({ variant = "Basic" }: { variant?: string }) {
  if (variant === "Destructive") return <Alert variant="destructive" title="Payment failed"><AlertDescription>Your payment could not be processed. Try another card.</AlertDescription></Alert>;
  if (variant === "Action") return <Alert title="New feature available"><AlertDescription><span className="docs-alert-action-row">Scheduled reports are now available.<Button size="sm" variant="outline">Learn more</Button></span></AlertDescription></Alert>;
  if (variant === "RTL") return <Alert dir="rtl" title="تم الحفظ"><AlertDescription>تم حفظ التغييرات بنجاح.</AlertDescription></Alert>;
  return <Alert title="Payment successful"><AlertDescription>Your payment of $29.99 has been processed. A receipt has been sent to your email address.</AlertDescription></Alert>;
}

function InputPreview({ variant = "Basic" }: { variant?: string }) {
  if (variant === "Field") return <div className="docs-preview-form"><Label htmlFor="input-field">API key</Label><Input id="input-field" placeholder="sk_live_••••••••" /><span className="showcase-muted">Your API key is encrypted and stored securely.</span></div>;
  if (variant === "Disabled") return <div className="docs-preview-form"><Label htmlFor="input-disabled">Username</Label><Input id="input-disabled" disabled placeholder="Unavailable" /></div>;
  if (variant === "Invalid") return <div className="docs-preview-form"><Label htmlFor="input-invalid">Email</Label><Input id="input-invalid" aria-invalid="true" defaultValue="not-an-email" /><span className="docs-error" role="alert">Enter a valid email address.</span></div>;
  if (variant === "Input group") return <div className="docs-input-group-preview"><span>https://</span><Input aria-label="Website URL" placeholder="example.com" /></div>;
  if (variant === "Button group") return <div className="docs-input-group-preview"><Input aria-label="Search" placeholder="Search" /><Button size="sm"><Search />Search</Button></div>;
  if (variant === "Form") return <div className="docs-preview-form"><Label htmlFor="form-name">Name</Label><Input id="form-name" placeholder="Your name" /><Label htmlFor="form-email">Email</Label><Input id="form-email" type="email" placeholder="name@example.com" /><span className="showcase-muted">We&apos;ll never share your email.</span><Button>Submit</Button></div>;
  if (variant === "RTL") return <div className="docs-preview-form" dir="rtl"><Label htmlFor="input-rtl">مفتاح API</Label><Input id="input-rtl" placeholder="مفتاح API" /></div>;
  return <div className="docs-preview-form"><Label htmlFor="input-basic">Website URL</Label><Input id="input-basic" placeholder="https://example.com" /></div>;
}

function CheckboxPreview({ variant = "Basic" }: { variant?: string }) {
  if (variant === "Checked") return <label className="docs-check-row"><Checkbox checked onCheckedChange={() => undefined} /><span>Accept terms and conditions</span></label>;
  if (variant === "Invalid") return <label className="docs-check-row"><Checkbox aria-invalid="true" onCheckedChange={() => undefined} /><span><strong>Accept terms and conditions</strong><small className="docs-error">You must accept the terms.</small></span></label>;
  if (variant === "Description") return <label className="docs-check-row"><Checkbox onCheckedChange={() => undefined} /><span><strong>Enable notifications</strong><small className="showcase-muted">You can enable or disable notifications at any time.</small></span></label>;
  if (variant === "Disabled") return <label className="docs-check-row"><Checkbox disabled /><span>Unavailable option</span></label>;
  if (variant === "Group") return <div className="docs-check-list"><strong>Show these items on the desktop:</strong>{["Hard disks", "External disks", "Connected servers"].map((item) => <label className="docs-check-row" key={item}><Checkbox onCheckedChange={() => undefined} /><span>{item}</span></label>)}</div>;
  if (variant === "Table") return <div className="docs-check-list"><strong>Select the items you want to show:</strong>{["Sarah Chen · Admin", "Marcus Rodriguez · User", "Priya Patel · Editor"].map((item) => <label className="docs-check-row" key={item}><Checkbox onCheckedChange={() => undefined} /><span>{item}</span></label>)}</div>;
  if (variant === "RTL") return <label className="docs-check-row" dir="rtl"><Checkbox onCheckedChange={() => undefined} /><span>قبول الشروط والأحكام</span></label>;
  return <label className="docs-check-row"><Checkbox onCheckedChange={() => undefined} /><span>Accept terms and conditions</span></label>;
}

function CardPreview({ variant = "Content card" }: { variant?: string }) {
  if (variant === "Login form") return <Card className="docs-card-preview"><CardHeader><CardTitle>Login to your account</CardTitle><CardDescription>Enter your email below to login to your account.</CardDescription></CardHeader><CardContent><div className="docs-preview-form"><Label htmlFor="card-email">Email</Label><Input id="card-email" type="email" placeholder="name@example.com" /><Label htmlFor="card-password">Password</Label><Input id="card-password" type="password" placeholder="••••••••" /><Button>Login</Button></div></CardContent><CardFooter><Button variant="outline" className="w-full"><LockKeyhole />Login with Google</Button></CardFooter></Card>;
  if (variant === "Scheduled reports") return <Card className="docs-card-preview"><CardHeader><CardTitle>Scheduled reports</CardTitle><CardDescription>Weekly snapshots. No more manual exports.</CardDescription></CardHeader><CardContent><ul className="docs-card-list"><li><CheckCircle2 />Choose a schedule.</li><li><CheckCircle2 />Send to teammates.</li><li><CheckCircle2 />Include key metrics.</li></ul></CardContent><CardFooter><Button>Set up scheduled reports</Button><Button variant="link">See what&apos;s new</Button></CardFooter></Card>;
  if (variant === "Image") return <Card className="docs-card-preview docs-card-media"><div className="docs-card-image"><CalendarDays size={22} /><span>Q4 planning review</span></div><CardHeader><CardTitle>Project review</CardTitle><CardDescription>Updated today by the workspace team.</CardDescription></CardHeader><CardFooter><Button variant="outline">Open project</Button></CardFooter></Card>;
  if (variant === "RTL") return <Card dir="rtl" className="docs-card-preview"><CardHeader><CardTitle>تقرير الفريق</CardTitle><CardDescription>ملخص الأداء لهذا الأسبوع.</CardDescription></CardHeader><CardContent><p className="docs-card-rtl-copy">تم تحديث البيانات منذ ساعتين.</p></CardContent><CardFooter><Button>عرض التقرير</Button></CardFooter></Card>;
  if (variant === "Structured card") return <Card className="docs-card-preview"><CardHeader><CardTitle>Workspace settings</CardTitle><CardDescription>Manage access and notification preferences.</CardDescription></CardHeader><CardContent><div className="docs-card-setting"><span>Weekly digest</span><Switch checked onCheckedChange={() => undefined} /></div></CardContent><CardFooter><Button variant="outline">Cancel</Button><Button>Save changes</Button></CardFooter></Card>;
  return <Card className="docs-card-preview"><CardContent><p>Use a content card to group a related piece of information without adding actions.</p></CardContent></Card>;
}

function Preview({ name, variant }: { name: string; variant?: string }) {
  const [enabled, setEnabled] = useState(true);
  if (name === "Button") return <ButtonPreview variant={variant} />;
  if (name === "Card") return <CardPreview variant={variant} />;
  if (name === "Input") return <InputPreview variant={variant} />;
  if (name === "Select") return <div className="docs-preview-form"><Label htmlFor="docs-select">Release channel</Label><Select id="docs-select" defaultValue="stable"><option value="stable">Stable</option><option value="canary">Canary</option></Select></div>;
  if (name === "Switch") return <div className="docs-preview-row"><Switch checked={enabled} onCheckedChange={setEnabled} /><span className="showcase-muted">{enabled ? "Enabled" : "Disabled"}</span></div>;
  if (name === "Badge") return <BadgePreview variant={variant} />;
  if (name === "Alert") return <AlertPreview variant={variant} />;
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

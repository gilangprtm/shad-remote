import { useEffect, useState } from "react";
import { Badge } from "../../core/badge/Badge";
import { Chart } from "../chart/Chart";
import { DatePicker } from "../date-picker/DatePicker";
import { DateRangePicker } from "../date-picker/DateRangePicker";
import { EventCalendar } from "../calendar/EventCalendar";
import { FileUploader } from "../file-uploader/FileUploader";
import { CommandPalette } from "../command-palette/CommandPalette";
import type { UploadFile } from "../../contracts/files";
import { Button } from "../../core/button/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../core/card/Card";
import { Checkbox } from "../../core/checkbox/Checkbox";
import { Input } from "../../core/input/Input";
import { Label } from "../../core/label/Label";
import { Popover } from "../../core/popover/Popover";
import { Progress } from "../../core/progress/Progress";
import { RadioGroup, RadioGroupItem } from "../../core/radio-group/RadioGroup";
import { Select } from "../../core/select/Select";
import { Separator } from "../../core/separator/Separator";
import { Skeleton } from "../../core/skeleton/Skeleton";
import { Switch } from "../../core/switch/Switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../core/tabs/Tabs";
import { Textarea } from "../../core/textarea/Textarea";
import { Tooltip } from "../../core/tooltip/Tooltip";
import { componentCounts, componentRegistry } from "../docs/component-registry";

const rows = componentRegistry.slice(0, 8).map((item) => ({ component: item.name, category: item.group, status: "Documented" }));

export function ComponentShowcase() {
  const [checked, setChecked] = useState<boolean | "indeterminate">(true);
  const [enabled, setEnabled] = useState(true);
  const [tab, setTab] = useState("overview");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [commandOpen, setCommandOpen] = useState(false);
  const [calendarView, setCalendarView] = useState<"month" | "week" | "day">("month");
  useEffect(() => {
    const onNavigate = (event: Event) => {
      const url = (event as CustomEvent<string>).detail;
      const nextTab = url.includes("calendar") ? "calendar" : url.includes("charts") ? "visualization" : url.includes("files") ? "files" : url.includes("forms") ? "forms" : url.includes("data") ? "data" : "overview";
      setTab(nextTab);
    };
    window.addEventListener("edjavu:navigate", onNavigate);
    return () => window.removeEventListener("edjavu:navigate", onNavigate);
  }, []);
  const events = [{ id: "sample-1", title: "Catalog review", start: new Date(), end: new Date() }];
  const usageSnippet = 'const Button = await loadRemote("edjavu_ui/core");';
  const ownership = [
    { label: "Remote UI", value: "Rendering, accessibility, interaction state, and loading/error/empty presentation." },
    { label: "Consumer", value: "Data, routing, authentication, permissions, persistence, and API adapters." },
  ];
  const chartState = { status: "ready" as const, data: [{ label: "Mon", value: 24 }, { label: "Tue", value: 42 }, { label: "Wed", value: 31 }, { label: "Thu", value: 56 }, { label: "Fri", value: 48 }] };
  const commands = [{ id: "overview", label: "Open overview", group: "Navigation", onSelect: () => setTab("overview") }];
  const addFiles = (selected: File[]) => setFiles((current) => [...current, ...selected.map((file, index) => ({ id: `${file.name}-${file.lastModified}-${index}`, file, name: file.name, size: file.size, type: file.type, progress: 0, status: "queued" as const }))]);

  return (
    <div className="showcase-page">
      <div className="showcase-intro">
        <div>
          <Badge variant="secondary">Remote catalog · v1</Badge>
          <h2>Component workspace</h2>
          <p>Komponen generik dipusatkan di Remote UI dan dikonsumsi aplikasi melalui runtime.</p>
        </div>
        <div className="showcase-actions">
          <Tooltip content="Komponen tersedia melalui Module Federation">
            <Button variant="outline" onClick={() => setCommandOpen(true)}>Open command palette</Button>
          </Tooltip>
          <Popover trigger={<Button variant="secondary">Release info</Button>}>
            <strong>Stable channel</strong>
            <p className="showcase-muted">Perubahan breaking diarahkan ke channel versi baru.</p>
          </Popover>
        </div>
      </div>

      <div className="showcase-stat-grid">
        <Card><CardHeader><CardDescription>Documented components</CardDescription><CardTitle>{componentCounts.total}</CardTitle></CardHeader><CardContent><Progress value={100} /></CardContent></Card>
        <Card><CardHeader><CardDescription>Core primitives</CardDescription><CardTitle>{componentCounts.core}</CardTitle></CardHeader><CardContent><p className="showcase-muted">Primitive pages with API and variations</p></CardContent></Card>
        <Card><CardHeader><CardDescription>Composite and pattern pages</CardDescription><CardTitle>{componentCounts.composites}</CardTitle></CardHeader><CardContent><p className="showcase-muted">Consumer-owned data contracts</p></CardContent></Card>
      </div>

      <div className="showcase-feature-grid">
        <Chart definition={{ kind: "line", series: [{ key: "value", label: "Interactions" }], title: "Catalog interaction sample", description: "Sample data for validating the chart contract." }} state={chartState} />
        <Card><CardHeader><CardTitle>Date picker</CardTitle><CardDescription>Controlled date value from the host contract.</CardDescription></CardHeader><CardContent><DatePicker value={date} onChange={setDate} /></CardContent></Card>
      </div>

      <Card><CardHeader><CardTitle>File uploader</CardTitle><CardDescription>Remote UI mengelola presentasi; consumer menyediakan upload adapter dan persistence.</CardDescription></CardHeader><CardContent><FileUploader files={files} accept={["image/png", "image/jpeg", "application/pdf"]} onFilesSelected={addFiles} onRemove={(id) => setFiles((current) => current.filter((file) => file.id !== id))} onRetry={() => undefined} onCancel={() => undefined} /></CardContent></Card>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="forms">Forms</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="visualization">Charts</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="states">States</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card><CardHeader><CardTitle>Remote component registry</CardTitle><CardDescription>Daftar permukaan yang siap digunakan consumer.</CardDescription></CardHeader><CardContent><div className="showcase-table"><div className="showcase-table-row showcase-table-head"><span>Component</span><span>Category</span><span>Status</span></div>{rows.map((row) => <div className="showcase-table-row" key={row.component}><span>{row.component}</span><span>{row.category}</span><Badge>{row.status}</Badge></div>)}</div></CardContent></Card>
          <div className="showcase-feature-grid showcase-overview-guides">
            <Card><CardHeader><CardTitle>Usage</CardTitle><CardDescription>Consumer memuat module dari remote domain tanpa menyalin source component.</CardDescription></CardHeader><CardContent><code className="showcase-code">{usageSnippet}</code><p className="showcase-muted">Gunakan manifest atau remoteEntry channel yang sudah dipublish.</p></CardContent></Card>
            <Card><CardHeader><CardTitle>Ownership</CardTitle><CardDescription>Kontrak menjaga batas tanggung jawab tetap jelas.</CardDescription></CardHeader><CardContent><div className="showcase-ownership-list">{ownership.map((item) => <div key={item.label}><strong>{item.label}</strong><p className="showcase-muted">{item.value}</p></div>)}</div></CardContent></Card>
          </div>
        </TabsContent>
        <TabsContent value="forms">
          <Card><CardHeader><CardTitle>Accessible form primitives</CardTitle><CardDescription>Kontrol tetap dikelola consumer; Remote UI hanya menyediakan presentasi dan interaksi.</CardDescription></CardHeader><CardContent><div className="showcase-form-grid"><div className="showcase-field"><Label htmlFor="sample-input">Input</Label><Input id="sample-input" placeholder="Masukkan nilai" /></div><div className="showcase-field"><Label htmlFor="sample-select">Select</Label><Select id="sample-select" defaultValue="stable"><option value="stable">Stable</option><option value="canary">Canary</option></Select></div><div className="showcase-field"><Label htmlFor="sample-textarea">Textarea</Label><Textarea id="sample-textarea" placeholder="Catatan komponen" /></div><div className="showcase-field showcase-options"><label><Checkbox checked={checked} onCheckedChange={setChecked} /> Aktif</label><label><Switch checked={enabled} onCheckedChange={setEnabled} /> Enabled</label><RadioGroup defaultValue="remote"><label><RadioGroupItem value="remote" /> Remote</label><label><RadioGroupItem value="local" /> Local</label></RadioGroup></div></div></CardContent></Card>
        </TabsContent>
        <TabsContent value="data">
          <Card><CardHeader><CardTitle>Data patterns</CardTitle><CardDescription>Filtering dan pagination tetap menerima data dari consumer.</CardDescription></CardHeader><CardContent><div className="showcase-table">{rows.map((row) => <div className="showcase-table-row" key={row.component}><span>{row.component}</span><span>{row.category}</span><Badge>{row.status}</Badge></div>)}</div></CardContent></Card>
        </TabsContent>
        <TabsContent value="calendar">
          <Card><CardHeader><CardTitle>Calendar contract</CardTitle><CardDescription>Event calendar dengan month, week, dan day view.</CardDescription></CardHeader><CardContent><EventCalendar events={events} view={calendarView} date={date ?? new Date()} onDateChange={setDate} onViewChange={setCalendarView} onEventClick={() => setTab("overview")} /><div className="mt-4 grid gap-2"><DatePicker value={date} onChange={setDate} /><DateRangePicker value={dateRange} onChange={setDateRange} /></div></CardContent></Card>
        </TabsContent>
        <TabsContent value="visualization">
          <Chart definition={{ kind: "line", series: [{ key: "value", label: "Interactions" }], title: "Line chart", description: "Async state and visualization contract." }} state={chartState} />
        </TabsContent>
        <TabsContent value="files">
          <Card><CardHeader><CardTitle>File contract</CardTitle><CardDescription>Selection, validation, preview surface, dan lifecycle callback.</CardDescription></CardHeader><CardContent><FileUploader files={files} accept={["image/png", "image/jpeg", "application/pdf"]} onFilesSelected={addFiles} onRemove={(id) => setFiles((current) => current.filter((file) => file.id !== id))} onRetry={() => undefined} onCancel={() => undefined} /></CardContent></Card>
        </TabsContent>
        <TabsContent value="states">
          <Card><CardHeader><CardTitle>Loading and empty states</CardTitle><CardDescription>State harus menjelaskan kondisi dan aksi berikutnya.</CardDescription></CardHeader><CardContent><div className="showcase-state-grid"><div><p className="showcase-label">Loading</p><Skeleton className="h-4 w-40" /><Skeleton className="mt-2 h-4 w-56" /></div><div><p className="showcase-label">Empty</p><p className="showcase-muted">Belum ada komponen yang difilter.</p><Button size="sm">Reset filter</Button></div></div></CardContent></Card>
        </TabsContent>
      </Tabs>
      <CommandPalette commands={commands} open={commandOpen} onOpenChange={setCommandOpen} />
      <Separator />
      <p className="showcase-footnote">Channel: <strong>v1</strong> · Source: Edjavu Remote UI · Consumer memberikan route, data, auth, dan permission.</p>
    </div>
  );
}

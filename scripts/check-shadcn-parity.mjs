import { readFile, readdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const upstream = [
  "Accordion", "Alert", "Alert Dialog", "Aspect Ratio", "Attachment", "Avatar", "Badge", "Breadcrumb", "Bubble", "Button", "Button Group", "Calendar", "Card", "Carousel", "Chart", "Checkbox", "Collapsible", "Combobox", "Command", "Context Menu", "Data Table", "Date Picker", "Dialog", "Direction", "Drawer", "Dropdown Menu", "Empty", "Field", "Hover Card", "Input", "Input Group", "Input OTP", "Item", "Kbd", "Label", "Marker", "Menubar", "Message", "Message Scroller", "Native Select", "Navigation Menu", "Pagination", "Popover", "Progress", "Questionnaire", "Radio Group", "Resizable", "Scroll Area", "Select", "Separator", "Sheet", "Sidebar", "Skeleton", "Slider", "Spinner", "Switch", "Table", "Tabs", "Textarea", "Toast", "Toggle", "Toggle Group", "Tooltip", "Typography",
];
const toKey = (name) => name.replace(/[^a-z0-9]/gi, "").toLowerCase();
const walk = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name === "dist" || entry.name === ".git") continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else if (/\.(tsx?|md)$/.test(entry.name)) files.push(path);
  }
  return files;
};
const sourceFiles = await walk(join(root, "src"));
const sourceText = (await Promise.all(sourceFiles.map((file) => readFile(file, "utf8")))).join("\n");
const exposeText = await readFile(join(root, "src/exposes/core.ts"), "utf8") + await readFile(join(root, "src/exposes/composites.ts"), "utf8") + await readFile(join(root, "src/exposes/shell.ts"), "utf8");
const registryText = await readFile(join(root, "src/components/docs/component-registry.ts"), "utf8");
const documented = new Set([...registryText.matchAll(/doc\(\{[\s\S]*?name:\s*"([^"]+)"/g)].map((match) => match[1]).filter((name) => upstream.some((item) => toKey(item) === toKey(name))));
const exposedNames = new Set([...exposeText.matchAll(/\b(?:export\s+\{\s*|,\s*)([A-Z][A-Za-z0-9]*)\b/g)].map((match) => match[1]));
const exposedAliases = new Set(["DataTable", "DatePicker", "Dialog", "Button", "AppShell", "Sidebar"]);
const rows = upstream.map((name) => {
  const exportName = name.replace(/\s+/g, "");
  const sourcePattern = new RegExp(`export\\s+(?:(?:function|const|class)\\s+|\\{[^}]*\\b)${exportName}\\b`, "m");
  const source = sourcePattern.test(sourceText);
  const federation = exposedNames.has(exportName) || exposedAliases.has(exportName);
  const docs = documented.has(name);
  return { name, source, federation, docs, status: source && federation && docs ? "documented" : source && federation ? "runtime-only" : source ? "source-only" : "missing" };
});
const counts = rows.reduce((acc, row) => { acc[row.status] += 1; return acc; }, { documented: 0, "runtime-only": 0, "source-only": 0, missing: 0 });
const report = { generatedAt: new Date().toISOString(), upstreamCount: upstream.length, counts, rows };
const output = process.argv.includes("--write") ? join(root, "docs/shadcn-parity-report.json") : null;
if (output) await writeFile(output, JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify(report, null, 2));
if (process.argv.includes("--check") && (counts.missing || counts["source-only"] || counts["runtime-only"])) process.exitCode = 1;

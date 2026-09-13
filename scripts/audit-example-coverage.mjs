import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const inventory = JSON.parse(fs.readFileSync(path.join(root, "docs/shadcn-example-inventory.json"), "utf8"));
const registrySource = fs.readFileSync(path.join(root, "src/components/docs/component-registry.ts"), "utf8");
const rendererSource = fs.readFileSync(path.join(root, "src/components/docs/ComponentDocsPage.tsx"), "utf8");

const nonPreviewSections = new Set([
  "Installation", "Usage", "Composition", "API Reference", "Changelog", "About", "Component", "API",
  "Accessibility", "Features", "Theming", "Updating to Recharts v3", "Introduction", "Table of Contents",
  "Prerequisites", "Project Structure", "Set up Table Features", "Core Concepts", "Performance",
  "Virtualization", "Unstyled", "What Makes a Great Streaming Chat Experience", "Prior Art",
  "Principles", "Building Your Typeset", "Custom Typesets", "Custom Themes", "Accessibility and Dark Mode",
  "Responsive Table", "Overrides", "Opting Out", "Streaming", "Migrating from Vaul", "ButtonGroup vs ToggleGroup",
  "Item vs Field", "Native Select vs Select", "useDirection", "Server Rendering", "Resume", "Navigation State",
  "Custom Progress", "Animated Items", "Responsive Layout", "Validation and Errors", "Anatomy", "Structure",
  "SidebarProvider", "Sidebar", "useSidebar", "SidebarHeader", "SidebarFooter", "SidebarContent", "SidebarGroup",
  "SidebarMenu", "SidebarMenuButton", "SidebarMenuAction", "SidebarMenuSub", "SidebarMenuBadge", "SidebarMenuSkeleton",
  "SidebarTrigger", "SidebarRail", "Controlled Sidebar", "Styling", "Set up Table Features", "Reusable Components",
]);

const aliases = new Map([
  ["Basic", new Set(["Basic", "Default"])],
  ["Default", new Set(["Default", "Basic"])],
  ["Range Picker", new Set(["Range", "Range Picker"])],
  ["Range Calendar", new Set(["Range", "Range Calendar"])],
  ["Single selection", new Set(["Basic", "Single selection"])],
  ["Single date", new Set(["Basic", "Single date"])],
  ["Controlled", new Set(["Controlled", "On", "Off"])],
]);

function componentLine(name) {
  return registrySource.split("\n").find((line) => line.includes(`, name: "${name}", description:`)) ?? "";
}
function localVariants(name) {
  return [...componentLine(name).matchAll(/\{ name: "([^"]+)"/g)].map((match) => match[1]);
}
function isCovered(official, local) {
  if (local.some((value) => value.toLowerCase() === official.toLowerCase())) return true;
  const mapped = aliases.get(official);
  return mapped ? local.some((value) => mapped.has(value)) : false;
}
function isRendered(name) {
  return rendererSource.includes(`name === "${name}"`);
}

const rows = inventory.components.map((component) => {
  const official = component.sections.map((section) => section.replace(/#$/, "")).filter((section) => !nonPreviewSections.has(section));
  const local = localVariants(component.name);
  const missing = official.filter((section) => !isCovered(section, local));
  return {
    name: component.name,
    officialPreviewSections: official,
    localExamples: local,
    missingSections: missing,
    renderer: isRendered(component.name),
    status: missing.length === 0 && isRendered(component.name) ? "covered" : missing.length === 0 ? "renderer-missing" : "incomplete",
  };
});

const summary = {
  generatedAt: new Date().toISOString(),
  scope: inventory.upstreamCount,
  covered: rows.filter((row) => row.status === "covered").length,
  incomplete: rows.filter((row) => row.status === "incomplete").length,
  rendererMissing: rows.filter((row) => row.status === "renderer-missing").length,
  officialPreviewSections: rows.reduce((total, row) => total + row.officialPreviewSections.length, 0),
  missingPreviewSections: rows.reduce((total, row) => total + row.missingSections.length, 0),
  rows,
};

fs.writeFileSync(path.join(root, "docs/shadcn-example-coverage.json"), `${JSON.stringify(summary, null, 2)}\n`);
const markdown = [
  "# shadcn Example Coverage Audit",
  "",
  `Generated: ${summary.generatedAt}`,
  "",
  "This audit is stricter than source/runtime/Federation parity. Conceptual, API, installation, and migration sections are excluded from preview obligations; implementative example sections must have a matching local registry example.",
  "",
  `- Scope: **${summary.scope}** components` ,
  `- Fully covered example sets: **${summary.covered}**`,
  `- Incomplete example sets: **${summary.incomplete}**`,
  `- Renderer missing: **${summary.rendererMissing}**`,
  `- Official preview sections: **${summary.officialPreviewSections}**`,
  `- Missing preview sections: **${summary.missingPreviewSections}**`,
  "",
  "## Incomplete components",
  "",
  ...rows.filter((row) => row.status !== "covered").map((row) => [
    `### ${row.name}`,
    `- Status: **${row.status}**`,
    `- Renderer: ${row.renderer ? "present" : "missing"}`,
    `- Local examples: ${row.localExamples.length ? row.localExamples.join(", ") : "none"}`,
    `- Missing official example sections: ${row.missingSections.length ? row.missingSections.join(", ") : "none"}`,
    "",
  ].join("\n")),
].join("\n");
fs.writeFileSync(path.join(root, "docs/SHADCN_EXAMPLE_COVERAGE_AUDIT.md"), `${markdown}\n`);

console.log(JSON.stringify({ ...summary, rows: undefined }, null, 2));
if (process.argv.includes("--check") && (summary.incomplete > 0 || summary.rendererMissing > 0)) process.exitCode = 1;

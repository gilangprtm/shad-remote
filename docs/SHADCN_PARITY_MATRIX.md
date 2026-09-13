# shadcn parity matrix

Status matrix ini dibangun dari daftar resmi `https://ui.shadcn.com/docs/components` dan inspeksi source Remote UI pada 2026-09-13.

## Cara membaca status

- **Runtime source**: implementasi lokal ditemukan di source.
- **Federation**: symbol tersedia melalui expose remote yang relevan.
- **Docs**: halaman dokumentasi terdaftar di `component-registry.ts`.
- **Parity**: bukan sekadar nama tersedia. Status `Partial` berarti API, behavior, compound exports, state, atau examples belum setara dengan referensi shadcn.
- **Priority**: urutan pengerjaan. P0 adalah fondasi dan komponen yang paling sering menjadi dependency komponen lain.

## Baseline

- Upstream base component pages observed: 59.
- Remote UI documented component pages observed: 29.
- Remote UI memakai shadcn-aligned conventions, tetapi belum boleh disebut shadcn parity penuh.
- Existing local source is not evidence of API parity. Setiap row harus divalidasi dengan runtime, expose, docs, dan acceptance test.

## Matrix

| Component | Runtime source | Federation | Docs | Parity | Priority | Notes |
|---|---:|---:|---:|---|---|---|
| Accordion | Yes | Yes | Yes | Partial | P0 | Compound behavior and examples need comparison. |
| Alert | Yes | Yes | Yes | Partial | P0 | Basic alert exists; states and composition need audit. |
| Alert Dialog | Yes | Yes | No | Partial | P0 | Must verify focus trap, Escape, destructive confirmation, and compound API. |
| Aspect Ratio | Yes | Yes | No | Partial | P1 | Source exists in misc bundle; needs named docs examples. |
| Attachment | No | No | No | Missing | P2 | Add only with real file contract and states. |
| Avatar | Yes | Yes | Yes | Partial | P1 | Image/fallback behavior needs explicit docs. |
| Badge | Yes | Yes | Yes | Partial | P1 | Variants exist; compare names and semantics. |
| Breadcrumb | Yes | Shell | Yes | Partial | P1 | Shell export and base docs need one canonical contract. |
| Bubble | No | No | No | Missing | P3 | Not present in local source. |
| Button | Yes | Yes | Yes | Partial | P0 | Variants exist; align API and examples with upstream. |
| Button Group | Yes | Yes | No | Partial | P1 | Source exists; needs standalone docs and composition examples. |
| Calendar | Partial | Composite | No | Partial | P0 | EventCalendar exists, but base Calendar parity is not established. |
| Card | Yes | Yes | Yes | Partial | P1 | Compound exports exist; needs fuller examples. |
| Carousel | Yes | Yes | No | Partial | P1 | Source exists in advanced bundle; needs keyboard and responsive audit. |
| Chart | Yes | Composite | Yes | Partial | P2 | Local chart contract differs from shadcn chart examples. |
| Checkbox | Yes | Yes | Yes | Partial | P0 | Controlled state and indeterminate behavior need audit. |
| Collapsible | Yes | Yes | No | Partial | P1 | Source exists; needs docs and keyboard acceptance. |
| Combobox | Yes | Yes | No | Partial | P0 | Source exists; behavior and search semantics need audit. |
| Command | Yes | Yes | Yes | Partial | P0 | Compare keyboard navigation, groups, empty state, and filtering. |
| Context Menu | Yes | Yes | No | Partial | P1 | Source exists; needs pointer and keyboard context behavior. |
| Data Table | Yes | Composite | Yes | Partial | P0 | Consumer contract exists; compare feature scope and examples. |
| Date Picker | Yes | Composite | Yes | Partial | P0 | Local contract exists; compare composition and calendar behavior. |
| Dialog | Yes | Direct | No | Partial | P0 | Direct expose exists; docs currently represent Overlay instead. |
| Direction | No | No | No | Missing | P2 | Add direction provider or explicit consumer boundary. |
| Drawer | Yes | Yes | Yes via Overlay | Partial | P0 | Needs standalone page and interaction acceptance. |
| Dropdown Menu | Yes | Yes | No | Partial | P0 | Source exists; focus management and item states need audit. |
| Empty | Partial | Composite | Yes as Empty State | Partial | P1 | Local name differs; decide canonical shadcn-aligned API. |
| Field | Yes | Yes | No | Partial | P0 | Source exists; needs label, description, error, and invalid composition. |
| Hover Card | No | No | No | Missing | P2 | Add only with pointer, focus, and dismissal behavior. |
| Input | Yes | Yes | Yes | Partial | P0 | Compare addons, invalid state, and field composition. |
| Input Group | Yes | Yes | No | Partial | P1 | Source exists; needs compound docs and responsive behavior. |
| Input OTP | Yes | Yes | No | Partial | P0 | Source exists; needs focus, paste, and validation audit. |
| Item | Yes | Yes | No | Partial | P1 | Source exists in misc bundle; needs variants and semantics. |
| Kbd | Yes | Yes | No | Partial | P2 | Source exists; needs docs and shortcut usage examples. |
| Label | Yes | Yes | Yes | Partial | P0 | Basic label exists; field composition needs standardization. |
| Marker | No | No | No | Missing | P3 | Not present in local source. |
| Menubar | Yes | Yes | No | Partial | P1 | Source exists; needs keyboard roving behavior audit. |
| Message | No | No | No | Missing | P3 | Not present in local source. |
| Message Scroller | No | No | No | Missing | P3 | Not present in local source. |
| Native Select | Yes | Yes | No | Partial | P0 | Exists in misc bundle; must be distinguished from Select. |
| Navigation Menu | Yes | Yes | No | Partial | P1 | Source exists; needs responsive and keyboard audit. |
| Pagination | Yes | Composite | No | Partial | P0 | Runtime exists but docs are missing. |
| Popover | Yes | Yes | Yes | Partial | P0 | Trigger behavior exists; dismissal and focus need audit. |
| Progress | Yes | Yes | Yes | Partial | P1 | Basic progress exists; indeterminate and accessibility need audit. |
| Questionnaire | No | No | No | Missing | P3 | Upstream page exists; no local implementation. |
| Radio Group | Yes | Yes | No | Partial | P0 | Runtime exists; docs and keyboard behavior need audit. |
| Resizable | Yes | Yes | No | Partial | P1 | Source exists; pointer and keyboard resize need audit. |
| Scroll Area | Yes | Yes | No | Partial | P1 | Source exists; needs scrollbar and accessibility examples. |
| Select | Yes | Yes | Yes | Partial | P0 | Native select currently; docs now have named patterns but API differs. |
| Separator | Yes | Yes | Yes | Partial | P1 | Compare orientation and decorative semantics. |
| Sheet | Yes | Yes | Yes via Overlay | Partial | P0 | Needs standalone page and focus/dismissal acceptance. |
| Sidebar | Yes | Shell | Yes | Partial | P0 | Shell implementation differs from shadcn sidebar API. |
| Skeleton | Yes | Yes | Yes | Partial | P1 | Basic shape exists; docs need loading composition examples. |
| Slider | Yes | Yes | No | Partial | P0 | Source exists; keyboard, range, and orientation need audit. |
| Spinner | Yes | Yes | No | Partial | P1 | Source exists; needs loading semantics and docs. |
| Switch | Yes | Yes | Yes | Partial | P0 | Compare checked, disabled, and keyboard behavior. |
| Table | Yes | Yes | No | Partial | P0 | Compound exports exist; docs page and states are missing. |
| Tabs | Yes | Yes | Yes | Partial | P0 | Compare keyboard, activation mode, and disabled tabs. |
| Textarea | Yes | Yes | Yes | Partial | P1 | Compare field composition and invalid state. |
| Toast | Partial | Composite | No | Partial | P0 | Notification provider exists; canonical Toast API/page missing. |
| Toggle | Yes | Yes | No | Partial | P1 | Source exists; docs and pressed state need audit. |
| Toggle Group | Yes | Yes | Yes | Partial | P1 | Single/multiple docs exist; compare keyboard semantics. |
| Tooltip | Yes | Yes | Yes | Partial | P1 | Trigger exists; focus, delay, and dismissal need audit. |
| Typography | No | No | No | Missing | P2 | Add documentation primitives only if API is deliberate. |

## Current implementation decisions

1. Do not add a registry row for a component that has no runtime export.
2. Do not call a component parity-complete because a file or export has the same name as an upstream component.
3. Keep Remote UI ownership boundaries. Consumer data, routing, auth, persistence, and backend adapters remain outside the component library.
4. Prefer shadcn-aligned compound exports and examples where the behavior is actually implemented.
5. Use a dedicated documentation section for each named pattern. Do not collapse unrelated usage patterns into one generic variants card.

## Batch order

### Batch 0: contract and inventory

- Keep this matrix under version control.
- Add a runtime export manifest generated from the actual expose files.
- Add a docs coverage check that compares registry entries with the intended inventory.
- Define parity acceptance fields for API, keyboard behavior, states, composition, and responsive behavior.

### Batch 1: existing P0 primitives

Audit and align existing implementations before adding new files:

```text
Button, Input, Label, Checkbox, Radio Group, Switch, Select,
Tabs, Accordion, Dialog, Alert Dialog, Popover, Dropdown Menu,
Combobox, Command, Field, Input OTP, Slider, Table, Pagination,
Toast, Calendar, Date Picker, Data Table
```

### Batch 2: existing P1 source components

```text
Alert, Aspect Ratio, Avatar, Badge, Breadcrumb, Button Group, Card,
Carousel, Collapsible, Context Menu, Drawer, Input Group, Item, Kbd,
Menubar, Navigation Menu, Resizable, Scroll Area, Separator, Sheet,
Sidebar, Skeleton, Spinner, Textarea, Toggle, Toggle Group, Tooltip
```

### Batch 3: missing components

```text
Attachment, Bubble, Direction, Hover Card, Marker, Message,
Message Scroller, Questionnaire, Typography
```

Missing components remain excluded from the registry until their runtime contract, expose, docs, and acceptance tests exist.

## Evidence

- Upstream inventory: `https://ui.shadcn.com/docs/components` retrieved during audit.
- Local source map: `find src -type f | sort`.
- Local exports: `src/exposes/core.ts`, `src/exposes/composites.ts`, and source component files.
- Local docs source: `src/components/docs/component-registry.ts`.
- Build status at baseline: not re-run in this audit-only inventory step.

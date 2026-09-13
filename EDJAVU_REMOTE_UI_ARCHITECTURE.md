# EDJAVU Remote UI Platform — Architecture Specification

## 1. Purpose

Membangun platform UI remote terpusat berbasis React + TypeScript yang dapat digunakan ulang oleh banyak aplikasi berbasis React seperti:

- Laravel + Inertia React
- Vite + React
- TanStack Start / TanStack Router
- Next.js melalui adapter/runtime integration yang kompatibel
- React SPA lain

Tujuan utama:

> Build once, deploy once, consume everywhere.

Perbaikan bug pada komponen generik harus dapat dilakukan di satu tempat dan digunakan oleh banyak aplikasi tanpa menyalin source component ke tiap repository.

---

## 2. Core Principles

1. Remote-first.
2. Runtime consumed, bukan copy-paste component.
3. React + TypeScript sebagai core.
4. UI Core tidak boleh bergantung pada framework host.
5. Perbedaan framework ditangani melalui adapter.
6. Generic UI dimiliki Edjavu Remote UI.
7. Business-specific UI tetap berada di aplikasi masing-masing.
8. Shared backend capability bukan tanggung jawab UI platform.
9. Semua remote harus versioned.
10. Breaking changes tidak boleh merusak consumer versi lama.

---

## 3. Target Repository

Buat repository/project baru:

```text
edjavu-remote-ui
```

Jangan mengubah repository Laravel lama menjadi remote host secara langsung.

Repository berikut hanya digunakan sebagai sumber awal komponen:

```text
https://github.com/gilangprtm/laravel-shadcn-admin-dashboard
```

Ekstrak komponen reusable dari repo tersebut dan refactor dependency yang terikat Laravel/Inertia.

---

## 4. Target Deployment

Production remote:

```text
https://ui.edjavu.cloud
```

Versioning:

```text
https://ui.edjavu.cloud/canary/
https://ui.edjavu.cloud/v1/
https://ui.edjavu.cloud/v2/
```

Stable consumer tidak boleh menggunakan `/latest`.

---

## 5. Technology Direction

Remote UI producer:

- React
- TypeScript
- Vite
- Module Federation runtime/manifest approach
- shadcn/ui
- Radix UI
- Tailwind-compatible design tokens / CSS variables

Shared dependencies yang wajib singleton:

- react
- react-dom

Hindari dependency framework-specific di core.

---

## 6. Repository Structure

```text
edjavu-remote-ui/
├── src/
│   ├── core/
│   │   ├── button/
│   │   ├── input/
│   │   ├── textarea/
│   │   ├── select/
│   │   ├── checkbox/
│   │   ├── dialog/
│   │   ├── card/
│   │   ├── badge/
│   │   ├── tabs/
│   │   ├── tooltip/
│   │   ├── popover/
│   │   └── table/
│   │
│   ├── components/
│   │   ├── data-table/
│   │   ├── data-form/
│   │   ├── date-picker/
│   │   ├── file-uploader/
│   │   ├── search-box/
│   │   ├── confirm-dialog/
│   │   ├── filter-bar/
│   │   ├── pagination/
│   │   ├── stat-card/
│   │   └── empty-state/
│   │
│   ├── shell/
│   │   ├── app-shell/
│   │   ├── sidebar/
│   │   ├── header/
│   │   ├── breadcrumb/
│   │   ├── user-menu/
│   │   └── command-palette/
│   │
│   ├── contracts/
│   │   ├── navigation.ts
│   │   ├── auth.ts
│   │   ├── files.ts
│   │   └── notifications.ts
│   │
│   ├── providers/
│   │   ├── platform-provider.tsx
│   │   └── theme-provider.tsx
│   │
│   ├── adapters/
│   │   ├── inertia/
│   │   ├── tanstack/
│   │   └── next/
│   │
│   ├── exposes/
│   │   ├── core.ts
│   │   ├── components.ts
│   │   ├── shell.ts
│   │   └── index.ts
│   │
│   └── styles/
│       ├── tokens.css
│       └── globals.css
│
├── docs/
│   ├── COMPONENT_REGISTRY.md
│   ├── ADAPTER_CONTRACT.md
│   └── VERSIONING.md
│
├── module-federation.config.ts
├── vite.config.ts
├── package.json
└── README.md
```

---

## 7. Component Ownership

### Core UI

Harus framework-agnostic.

Contoh:

- Button
- Input
- Select
- Dialog
- Card
- Badge
- Checkbox
- Radio
- Tabs
- Tooltip
- Popover
- Table
- Skeleton

Core UI dilarang mengimpor:

```text
@inertiajs/*
next/*
@tanstack/react-router
Laravel Wayfinder
Laravel-specific helpers
application-specific API
```

---

## 8. Composite Components

Reusable tetapi lebih tinggi levelnya.

Contoh:

- DataTable
- DataForm
- DatePicker
- FileUploader
- ConfirmDialog
- FilterBar
- Pagination
- StatCard
- EmptyState
- SearchCommand

Komponen harus menerima data dan callback melalui props/contracts.

Contoh yang benar:

```tsx
<DataTable
  data={users}
  columns={columns}
  onRowClick={handleRowClick}
/>
```

Contoh yang dilarang:

```tsx
<DataTable
  inertiaRouter={router}
  laravelRoute="/users"
/>
```

---

## 9. Application Shell

Remote UI harus menyediakan shell generik:

- AppShell
- Sidebar
- Header
- Breadcrumb
- UserMenu
- CommandPalette

Shell tidak boleh mengimpor router host.

Navigasi dilakukan melalui contract.

---

## 10. Adapter Architecture

Remote UI tidak boleh mengetahui framework host.

Gunakan contract seperti:

```ts
export interface NavigationAdapter {
  navigate(url: string): void
  isActive(url: string): boolean
}
```

Platform Provider:

```tsx
<EdjavuPlatformProvider
  navigation={navigationAdapter}
  auth={authAdapter}
  files={fileAdapter}
  notifications={notificationAdapter}
>
  <App />
</EdjavuPlatformProvider>
```

Adapter yang disiapkan:

### Inertia Adapter

Boleh menggunakan:

```text
@inertiajs/react
Laravel Wayfinder
```

### TanStack Adapter

Boleh menggunakan:

```text
@tanstack/react-router
```

### Next Adapter

Boleh menggunakan host-specific navigation/runtime integration.

Jangan membuat core bergantung pada Next.js.

---

## 11. Styling Rules

Remote UI harus membawa styling dasarnya sendiri.

Gunakan CSS variables/design tokens:

```css
--background
--foreground
--primary
--secondary
--muted
--accent
--destructive
--border
--radius
```

Consumer boleh override token untuk branding.

Consumer tidak boleh diwajibkan memiliki konfigurasi Tailwind identik hanya agar komponen dapat dirender.

---

## 12. Module Federation Rules

Remote UI harus:

1. menghasilkan remote manifest;
2. mengekspos component modules;
3. menggunakan React dan React DOM sebagai shared singleton;
4. mendukung lazy loading;
5. menyediakan error boundary/fallback;
6. tidak mengikat core ke bundler/framework consumer.

Expected stable manifest:

```text
https://ui.edjavu.cloud/v1/mf-manifest.json
```

---

## 13. Versioning

Gunakan major remote channels:

```text
/canary
/v1
/v2
```

Aturan:

- bug fix kompatibel boleh masuk ke versi aktif;
- breaking change masuk major version baru;
- consumer tidak dipaksa upgrade;
- v1 tetap tersedia saat v2 dirilis selama masih digunakan.

Contoh:

```text
Inventory -> v1
Library   -> v1
School    -> v1
New App   -> v2
```

---

## 14. Failure Handling

Karena remote UI adalah runtime dependency, consumer harus aman jika remote gagal.

Minimal:

- lazy loading;
- timeout;
- retry yang wajar;
- React ErrorBoundary;
- fallback component;
- health endpoint/status.

Remote failure tidak boleh menyebabkan blank page tanpa pesan.

---

## 15. Component Registry

Buat:

```text
docs/COMPONENT_REGISTRY.md
```

Format minimal:

```text
COMPONENT: DataTable
REMOTE: edjavu-ui/DataTable
STATUS: stable
VERSION: v1

PURPOSE:
Reusable table with sorting, filtering and pagination.

USE WHEN:
- displaying tabular data
- reusable admin CRUD pages

DO NOT:
- create another generic DataTable inside consumer apps
```

Registry harus diperbarui setiap ada generic component baru.

---

## 16. Remote-First Development Policy

Aturan wajib:

1. Check component registry before creating UI.
2. Never recreate an existing generic remote component.
3. Generic reusable component belongs to Edjavu Remote UI.
4. Business-specific component belongs to the application.
5. Framework-specific behavior belongs to adapters.
6. UI Core must remain framework-agnostic.
7. New generic components should be contributed upstream to Remote UI.
8. Do not duplicate generic fixes across consumer repositories.
9. Prefer contract/callback injection over framework imports.
10. Protect stable consumers with versioning.

---

## 17. Migration Source

Source repository:

```text
gilangprtm/laravel-shadcn-admin-dashboard
```

Migration order:

### Phase 1 — Primitive UI

Audit:

```text
resources/js/components/ui/*
```

Classify components:

- generic;
- framework-coupled;
- app-specific.

Move generic components to `src/core`.

### Phase 2 — Composite UI

Extract:

- DataTable
- forms
- charts
- calendar
- dialogs
- reusable filters
- reusable display components

Remove Laravel/Inertia-specific imports.

### Phase 3 — Shell

Extract:

- Sidebar
- Header
- AppShell
- Breadcrumb
- UserMenu

Replace navigation coupling with contracts.

### Phase 4 — Adapters

Implement:

- Inertia adapter
- TanStack adapter
- Next adapter only to the extent compatible with the chosen runtime strategy

### Phase 5 — Remote Runtime

Expose selected modules via Module Federation.

Deploy canary first.

### Phase 6 — Consumer Proof

Build at least two proof consumers:

1. Laravel + Inertia consumer
2. Vite/TanStack consumer

Both must consume the same remote component at runtime.

Required MVP proof:

- Button
- Dialog
- DataTable
- AppShell

A bug/change to a remote component must be demonstrably reflected in both consumers after remote deployment without copying source into either consumer.

---

## 18. Explicit Non-Goals for MVP

Do not build yet:

- centralized Auth backend;
- centralized notification backend;
- centralized file service;
- full microservice platform;
- multi-tenant platform;
- large admin builder;
- drag-and-drop page builder;
- dozens of adapters.

Focus only on proving Remote UI architecture.

---

## 19. Definition of Done — MVP

MVP is complete only when:

- `edjavu-remote-ui` exists as independent project;
- core components are framework-agnostic;
- runtime remote manifest is available;
- React/ReactDOM are shared singleton;
- Inertia adapter exists;
- TanStack/Vite consumer works;
- Button, Dialog, DataTable, AppShell are remote;
- at least two different host stacks consume them;
- stable `/v1` remote deployment exists;
- component registry exists;
- changing a remote component updates both consumers without copying code;
- documentation explains how to add a component and how a consumer uses it.

---

## 20. Decision Rule

When uncertain where code belongs:

```text
Is it generic React UI?
-> Remote UI Core/Components

Does it integrate router/auth/framework?
-> Adapter

Is it business-specific?
-> Consumer application

Is it backend/shared capability?
-> Separate shared service, not Remote UI
```

---

## 21. Guiding Statement

> Business logic belongs to the application.
> Generic UI belongs to Edjavu Remote UI.
> Framework differences belong to adapters.
> Shared backend capabilities belong to separate services.
> Build once, deploy once, consume everywhere.

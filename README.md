# Edjavu Remote UI

A React and TypeScript component remote built with Vite and Module Federation.

The project separates shared UI from application behavior. The remote owns rendering, interaction states, accessibility, and layout. Each consumer supplies its own data, routing, authentication, permissions, persistence, and API adapters.

## What is included

- Core primitives such as Button, Card, Input, Table, Dialog, Tabs, Select, and Command.
- Composite components for tables, filters, pagination, dates, calendars, charts, files, notifications, and command palettes.
- A dashboard shell with a responsive sidebar, grouped component navigation, breadcrumbs, theme switching, and workspace preferences.
- Consumer-facing contracts for async state, navigation, permissions, notifications, calendar events, charts, files, and commands.
- Stable and canary deployment folders with Module Federation manifests.
- Inertia and TanStack consumer examples under `consumer-template/`.

## Repository layout

```text
src/core/                 Primitive UI components
src/components/           Composite components and showcase surfaces
src/contracts/            Consumer-facing TypeScript contracts
src/shell/                Dashboard shell, sidebar, header, breadcrumb
src/exposes/              Module Federation entry points
src/adapters/             Framework integration boundaries
src/styles/               Design tokens and Tailwind CSS v4 styles
deploy/v1/                Published stable channel
deploy/canary/            Published canary channel
consumer-template/        Consumer examples
docs/                     Architecture and migration notes
scripts/                  Build, publish, serve, and acceptance scripts
```

## Module Federation exposes

The remote keeps the original compatibility modules and adds grouped entry points.

```text
edjavu_ui/core
edjavu_ui/composites
edjavu_ui/shell
edjavu_ui/Button
edjavu_ui/Dialog
edjavu_ui/DataTable
edjavu_ui/AppShell
edjavu_ui/platform
```

Use the grouped entries for new integrations. Keep the compatibility entries when an existing consumer already imports them.

## Local development

Requirements:

- Node.js compatible with the project toolchain
- npm

Install dependencies and start the development server:

```bash
npm install
npm run dev -- --host 0.0.0.0
```

The local producer runs on the Vite port configured in `vite.config.ts`.

## Validate changes

Run the checks before publishing:

```bash
npm run typecheck
npm run build
npm run publish:local
```

`publish:local` builds both channels and writes the generated files to `deploy/v1` and `deploy/canary`.

## Serve a published channel

The deployment server serves the generated channel folders:

```bash
npm run serve:deploy
```

The default server listens on port `3000`. The stable remote entry is available at:

```text
/v1/assets/remoteEntry.js
```

The manifest is available at:

```text
/v1/mf-manifest.json
```

Use a reverse proxy or static hosting service in a deployed environment. The repository does not configure DNS, TLS, Cloudflare, or production infrastructure.

## Consumer integration

A consumer loads the remote entry from its own runtime configuration. The remote must not assume the consumer's router, API client, authentication system, database, or permission implementation.

A consumer owns:

- API calls and data transformation
- Routing and navigation adapters
- Authentication and authorization
- Tenant and permission decisions
- Persistence and mutations
- Upload endpoints and retry protocols

The remote owns:

- Rendering and composition
- Accessible keyboard interaction
- Local interaction state
- Loading, empty, and error presentation
- Progress presentation
- Generic layout and styling

See `docs/ADAPTER_CONTRACT.md` and `docs/COMPONENT_REGISTRY.md` for the current boundaries and implementation status.

## Version channels

`v1` is the stable channel. `canary` is for testing a published change before promoting it to the stable channel.

Consumers should configure the channel explicitly rather than relying on an unversioned asset path.

## Design direction

The dashboard uses the existing Edjavu UI token system and takes structural cues from the local `invoicegen` reference. It does not copy application-specific routes, invoice behavior, authentication screens, or business data from that project.

The layout gives the component catalog a real navigation model:

- Overview
- Components, grouped by category
- Patterns for calendar, charts, and files
- Resources for usage and contracts
- Preferences for theme and sidebar behavior

The showcase uses sample values only to exercise component contracts. It does not present them as production metrics.

## Scope boundaries

This repository intentionally excludes application-specific features such as login, registration, passkeys, two-factor authentication, user deletion, invoice workflows, chat or mail business screens, database access, API implementations, route-specific pages, tenant logic, and permission policies.

Those concerns belong in the consuming application.

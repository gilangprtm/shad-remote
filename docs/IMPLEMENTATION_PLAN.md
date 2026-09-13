# Implementation Plan and Audit

## Source audit

Audited commit `52b2062` of `gilangprtm/laravel-shadcn-admin-dashboard`.

- Generic and directly extractable: `components/ui/button.tsx`, `dialog.tsx`, `table.tsx`, and token concepts from `app.css`.
- Generic but coupled and requiring refactor: `components/app-shell.tsx`, `app-sidebar.tsx`, `app-header.tsx`, `breadcrumbs.tsx`, navigation components, and `lib/utils.ts`.
- Business/application-specific: auth forms, passkeys, two-factor flows, delete-user, settings management, dashboard navigation data, chat/mail screens, and Laravel page layouts.

Observed coupling includes `@inertiajs/react`, `@laravel/passkeys/react`, `@inertiajs/core`, `next-themes`, Wayfinder/Laravel helpers, and Inertia-specific `InertiaLinkProps` in `lib/utils.ts`. The source `components/ui/*` folder itself had no forbidden host imports in the audit.

## MVP sequence

1. Extract the four proof components into framework-free modules.
2. Add platform/navigation contracts and Inertia/TanStack adapters.
3. Expose modules through Vite Module Federation with React singletons.
4. Build canary and v1 channels with manifests.
5. Run two hosts against the same runtime remote.
6. Change a visible remote label, rebuild only the remote, and verify both hosts receive it.

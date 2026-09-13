# Migration Matrix

Referensi styling dan komponen:

- `invoicegen`: referensi utama untuk Tailwind v4, shadcn `base-nova`, CSS variables, dark mode, dan primitive API.
- `laravel-shadcn-admin-dashboard`: referensi utama untuk dashboard shell dan visual composition.

## Batch 1 — selesai

| Area | Remote module | Source reference | Status |
|---|---|---|---|
| Button | `edjavu_ui/core` dan `edjavu_ui/Button` | invoicegen + existing proof | migrated |
| Card | `edjavu_ui/core` | invoicegen | migrated |
| Badge | `edjavu_ui/core` | invoicegen | migrated |
| Input | `edjavu_ui/core` | invoicegen | migrated |
| Label | `edjavu_ui/core` | invoicegen | migrated |
| Table primitives | `edjavu_ui/core` | invoicegen | migrated |
| CSS foundation | remote stylesheet | invoicegen | migrated |

## Batch berikutnya

1. Textarea, Separator, Skeleton, Progress.
2. Checkbox, Switch, RadioGroup.
3. Select, Popover, Tooltip, Tabs.
4. Dialog refactor ke token/primitive style baru.
5. DataTable refactor menggunakan Table primitives.
6. Sidebar foundation dan provider.
7. Dashboard shell contracts.
8. Header, Breadcrumb, UserMenu, CommandPalette.

## Coupling rule

Core tidak boleh mengimpor `@inertiajs/*`, Next.js, TanStack Router, Laravel helpers, Wayfinder, atau application API. Semua navigation, auth, files, notifications, dan business data harus masuk melalui props/contracts/adapters.

## Verification rule

Setiap batch wajib melewati `npm run typecheck` dan `npm run build`. Jangan publish remote channel atau menyatakan batch selesai jika salah satu gagal.

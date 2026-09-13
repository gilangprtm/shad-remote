# Component Registry

Remote contract: `edjavu_ui`, version `v1`.

## Implemented and runtime exposed

| Group | Remote module | Status | Contents |
|---|---|---|---|
| Core | `edjavu_ui/core` | implemented | Button, Card, Badge, Input, Label, Textarea, Checkbox, Switch, RadioGroup, Select, Tabs, Tooltip, Popover, Separator, Skeleton, Progress, Table, Alert, Avatar, Toggle, Accordion, Collapsible, Spinner, Kbd, AspectRatio, ScrollArea, Item, Field, NativeSelect, ButtonGroup, ToggleGroup, Slider, AlertDialog, Drawer, Sheet, Command, DropdownMenu, ContextMenu, Menubar, NavigationMenu, Combobox |
| Composites | `edjavu_ui/composites` | implemented MVP | DataTable, ResourceTable, FilterBar, Pagination, EmptyState, StatCard, DatePicker, DateRangePicker, EventCalendar, Chart, FileUploader, CommandPalette, NotificationProvider, Toaster |
| Shell | `edjavu_ui/shell` | implemented foundation | AppShell, SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarInset, Header, Breadcrumb |
| Compatibility | `edjavu_ui/Button`, `edjavu_ui/Dialog`, `edjavu_ui/DataTable`, `edjavu_ui/AppShell`, `edjavu_ui/platform` | stable compatibility | Existing modules retained for consumer compatibility |

## Implemented MVP limitations

These components are available at runtime but still have a defined MVP scope:

- EventCalendar: month, week, and day views, selected date, event placement, previous/next/today, view contract, and keyboard date navigation are implemented.
- Chart: line, area, bar, pie, and donut renderers, native SVG titles, legend, async states, and accessible data table are implemented.
- FileUploader: selection, validation, drag/drop, preview surface, lifecycle presentation, progress, retry/cancel/remove callbacks, upload adapter contract, and upload queue hook are implemented.
- CommandPalette: search, grouping, keywords, Escape, global Mod+K shortcut, active item, ArrowUp/ArrowDown, and Enter selection are implemented.
- AlertDialog/Drawer/Sheet: portal, Escape, focus trap, focus restoration, overlay click policy, close button, and scroll lock are implemented; animations and nested overlay manager are pending.

## Intentionally excluded

These reference components remain in the consumer because they contain application or domain behavior:

- login/register, Google auth, passkey, and two-factor flows;
- user settings, delete-user, account persistence, and authorization policy;
- chat/mail/message screens and backend-backed notifications;
- invoice/business queries, API calls, database state, and route-specific pages.

## Pending generic components

These remain to be implemented in later batches:

- chart tooltip and nested overlay manager;
- upload adapter execution and resumable upload;
- Sonner compatibility layer.

## Ownership rule

Remote UI owns presentation, accessibility, and interaction primitives. Consumers own routes, data, authentication, authorization, persistence, and business actions.

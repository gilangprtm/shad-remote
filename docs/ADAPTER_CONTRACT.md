# Adapter Contract

Core modules do not import Inertia, TanStack Router, Next.js, Laravel, or host APIs.

```ts
export interface NavigationAdapter {
  navigate(url: string): void;
  isActive(url: string): boolean;
}
```

A host creates an adapter and injects it through `EdjavuPlatformProvider`:

```tsx
<EdjavuPlatformProvider navigation={navigationAdapter}>
  <AppShell title="Inventory" nav={items} />
</EdjavuPlatformProvider>
```

The Inertia adapter wraps `router.visit` and `router.current`. The TanStack adapter wraps `router.navigate` and the current pathname. A future Next adapter must implement the same contract without changing Core UI.

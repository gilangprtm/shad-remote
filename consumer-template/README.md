# Runtime proof consumers

The two consumers under this directory load `edjavu_ui` from `VITE_REMOTE_URL` at runtime through Module Federation. They do not contain copies of the remote component source.

- `inertia-consumer`: Inertia-compatible navigation adapter boundary.
- `tanstack-consumer`: TanStack-compatible navigation adapter boundary.

Run the producer first, then each consumer with `VITE_REMOTE_URL=http://localhost:4173/v1/assets/remoteEntry.js`.

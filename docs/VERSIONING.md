# Versioning

Build channels are independent deployment directories:

- `/canary/` for acceptance and pre-release testing.
- `/v1/` for stable consumers.
- `/v2/` for future breaking changes.

Stable consumers must pin a channel and must not use `/latest`. Compatible fixes may update the selected major channel. Breaking changes require a new major channel while the old channel remains available.

The runtime entry is `assets/remoteEntry.js`. The channel manifest is `mf-manifest.json`. The generated artifact must be published atomically so consumers never observe a partial channel.

## Technical deviation

The MVP uses `@originjs/vite-plugin-federation` because it produces a working Vite remote entry and runtime-compatible exposes in this environment. The repository keeps federation configuration isolated so it can be replaced by another Module Federation runtime without changing Core UI contracts.

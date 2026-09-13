# Edjavu UI design direction

Design Read: component documentation workspace for technical consumers, with a restrained catalog language, a readable information hierarchy, and interaction-first surfaces.

Dials: ENERGY 1 / RHYTHM 2 / MOTION 1.

## Decisions

- **Color:** semantic neutral tokens with one primary accent. The palette keeps code, API details, and component previews readable in light and dark mode.
- **Layout:** a persistent catalog sidebar and a content-first documentation column. The sidebar solves component discovery; the documentation column solves evaluation and adoption.
- **Typography:** system sans for UI copy and monospace only for code. This keeps prose readable and makes code boundaries clear.
- **Cards:** cards group previews, API data, and resource sections. They are not used as decorative feature tiles.
- **Spacing:** larger gaps separate documentation sections, while smaller gaps group a heading with its description or code sample.
- **Motion:** hover and focus feedback only. The catalog is a reference surface, so motion must not compete with reading or keyboard navigation.
- **Reference boundary:** `invoicegen` informs sidebar and preference structure only. Its routes, business data, authentication, and application behavior are not part of this UI.

## Compatibility CSS boundary

`src/styles/styles.css` is the primary token and layout layer. `src/styles/global.css` and `src/styles/tokens.css` remain imported for legacy compatibility surfaces such as the older `edjavu-table` and `edjavu-dialog` classes. New components should use semantic tokens and the primary layer. The legacy layer should be removed only after its consumers have migrated and runtime acceptance confirms no compatibility regression.

## Honest content rule

Showcase numbers, dates, events, and chart series are fixture data used to exercise contracts. They must be labeled as fixtures and must not be presented as product metrics.

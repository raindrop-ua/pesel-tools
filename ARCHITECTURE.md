# Architecture

## Overview

`pesel-tools` is an Angular 22 application that validates, parses, and generates PESEL numbers.

Core characteristics:

- Standalone Angular components (no NgModules)
- Lazy-loaded feature routes
- SSR support via Angular SSR + Express
- PWA service worker in production mode
- Zoneless change detection (`provideZonelessChangeDetection`)

## High-Level Structure

Main source tree lives in `src/app`:

- `core/`: shared services, PESEL validation and test data, route config, preloading strategies
- `layout/`: application shell, header, footer and section layout
- `shared/`: reusable UI components, directives, pipes, validators
- `features/`: domain features (`home`, `parser`, `generator`, `batch`, `test-data`, `static/not-found`)

Entry points:

- Browser: `src/main.ts`
- Server bootstrap: `src/main.server.ts`
- Node server: `src/server.ts`

## Routing

Routing is defined in `src/app/app.routes.ts`.

- Root route renders `LayoutComponent`
- Child routes are lazy-loaded with `loadComponent`
- Route metadata includes SEO data (`title`, `description`, `keywords`)
- Custom preloading strategy is configured in app config

Configured routes:

- `/` -> Home feature
- `/parser` -> Parser feature
- `/generator` -> Generator feature
- `/batch` -> Batch validator (lazy loaded without preloading)
- `/test-data` -> Deterministic tester fixtures (lazy loaded without preloading)
- `**` -> Not Found feature

## Application Configuration

Global providers are defined in `src/app/app.config.ts`:

- Router with component input binding and custom preloading
- Client hydration with event replay
- Environment providers
- Service worker registration (`ngsw-worker.js`, production only)
- Environment initializer that wires update and SEO services

## Core Domain Services

Key PESEL logic is placed under `src/app/core/services`:

- `pesel-parser.service.ts`: parses and validates PESEL content
- `pesel-generator.service.ts`: asynchronous Worker client with cancellation, timeout, and cleanup
- `pesel-utils.ts`: low-level PESEL helpers (e.g. checksum/date logic)

Additional platform services include clipboard, download, storage, theme, SEO, and service-worker update handling.

### PWA Update Notice

`SwUpdateService` exposes a signal when Angular emits `VERSION_READY`. The root-level `UpdateNoticeComponent` shows a non-modal notice on every route, styled for light/dark themes, safe areas and reduced motion. It announces availability without moving keyboard focus. **Update now** reloads the full page to activate the new version and clears in-memory input/results; no `activateUpdate()` is used, avoiding mixed versions of lazy-loaded chunks. **Later** dismisses that version for the current page session; repeated events for the same hash do not reopen it, while a different ready version can show a new notice. There is no automatic reload or dismissal timer.

Update polling starts once the application is stable, checks once a minute, skips overlapping requests and tolerates offline failures. Subscriptions and timers are released when the service is destroyed. Development and SSR do not show the notice when service workers are disabled.

## Inspection, Batch Checking and Test Data

- `core/validation/pesel-inspection.ts` checks format, date and checksum independently and exposes the checksum contributions used by the parser's interactive digit breakdown. It shares `decodePeselDate`, calendar validation and checksum weights with the existing parser/generator utilities. A wrong checksum does not hide a separate invalid date.
- `core/validation/pesel-batch.ts` reads plain lists or quoted CSV (comma/semicolon/tab, BOM, CRLF, escaped quotes and embedded newlines). Multi-column files must have exactly one `PESEL` header. CSV empty values are invalid records; physically blank lines are ignored. Input is capped at 5 million characters / 100,000 values; files are capped at 5 MB.
- Batch validation yields every 250 rows and accepts an AbortSignal. The component aborts on cancellation, clear and destruction, and guards against stale validation/file-read results. No partial results are committed. It keeps only compact validation records, filters in memory and renders 50 records per page. CSV/JSON exports cover the whole filtered result. Spreadsheet formula prefixes are neutralized in CSV; raw PESEL strings are preserved in JSON.
- To bound native textarea editing/layout work, inputs over 20,000 characters show a read-only 5,000-character preview while retaining the full input for validation. Large paste events are intercepted before native insertion and preserve the selected-range replacement. Clear returns the field to editable mode.
- `core/testing/pesel-test-sets.ts` contains deterministic date/century, checksum, malformed-input and mixed/duplicate fixtures with expected validity and issue codes. Invalid-date fixtures have correct control digits, isolating the date failure. Tests verify all expectations against both inspection and the existing parser.
- `BatchInputService` is a one-time in-memory transfer from the test-data page to the batch page. User input and imported files are not put in URLs or browser storage, and no validation API is called. Reloading/leaving the batch page discards its state.
- Validity is structural; registry assignment is never checked. Synthetic fixtures are not claimed to be unassigned. Future dates in 1800–2299 remain structurally valid, matching the existing parser.

## Generation

The flow is `SimpleGeneratorComponent → GeneratorStateService → PeselGeneratorService → pesel.worker.ts → generatePeselBatch`.

- `core/generation/pesel-generation.ts` is a pure TypeScript algorithm, independent of Angular and browser APIs. It validates requests and samples without replacement from the valid date/serial space using a sparse Fisher–Yates shuffle. Existing values are mapped to excluded indices before sampling, so a nearly exhausted space does not cause collision retries or false failures.
- For a fixed date there are 5,000 combinations per sex, or 10,000 without a sex restriction. Oversized requests fail before returning any results. Uniqueness covers the requested batch and any explicitly supplied exclusions, not an official PESEL registry.
- Random dates range from January 1 of the current year minus 100 through today (local calendar), within 1800–2299. Explicit dates support the full PESEL range, including future dates.
- `pesel-worker.protocol.ts` defines the request/response contract. A job owns one Worker, which is terminated on success, error, cancellation, or a 60-second timeout. Consumers are independent. The home page also uses this asynchronous API and skips overlapping refreshes.
- Workers are created lazily. SSR renders without generating numbers. Browsers without Worker support show an error; there is no synchronous bulk fallback that could freeze the UI.
- The component-scoped `GeneratorStateService` owns pending/error state, cancellation and the current in-memory result. Each accepted generation clears the previous result immediately, and success replaces it with the new batch. Uniqueness is scoped to one batch. Clearing the list or destroying the view cancels the job and prevents stale results from being saved. Overlapping submissions are ignored.
- Results are never saved to localStorage and disappear on reload or when leaving the generator. The legacy `pesel-list:v1` key is removed when opening the generator.
- Sequential serial mode requires an explicit birthdate and selects the lowest available serials in ascending order: Female starts at 0000 with step 2, Male at 0001 with step 2, and Random at 0000 with step 1. Each batch restarts from the beginning. Explicit API exclusions are skipped. The UI disables Generate Random in this mode. The checksum is still calculated separately for every number.
- The sex control offers Male, Female, and Random. Random omits the sex restriction while retaining the selected date.
- The UI and batch API allow 1–100,000 numbers per request, with no accumulated list. Only the first 100 rows render; text/JSON copy and download include the entire list.

The Worker removes generation from the main thread, but structured cloning, JSON serialization, and exports still use the main thread. For substantially larger datasets, use chunked transfer plus streamed export/IndexedDB instead of raising the current limit.

## Styling

### Component Files

Every Angular component must have separate `.ts`, `.html`, and `.css` files with the same base name (for example, `example.component.ts`, `example.component.html`, and `example.component.css`). The `.ts` file contains component logic and metadata, references the template through `templateUrl`, and references the stylesheet through `styleUrl` (or `styleUrls`). Inline `template` and `styles` in component `.ts` files are not allowed. Keep the external `.css` file even if it is initially empty. Follow this rule when creating or modifying components.

### Shared Styles and Utilities

Styles use Tailwind CSS 4 via `@tailwindcss/postcss` in `.postcssrc.json`:

- `src/styles.css` imports Tailwind and holds minimal document-wide base styles.
- Component templates and Angular host classes own layout, typography, responsive states, and interactions.
- `src/app/styles/theme.css` defines a shared `--brand-*` palette for the masthead, navigation, cards, controls, and actions, and exposes semantic color utilities through `@theme inline`. Colors use `light-dark()` with the existing `data-theme` selection and system preference fallback.
- `src/app/styles/fonts.css` loads the self-hosted Quicksand and JetBrains Mono fonts.
- `src/app/styles/animations.css` provides shared entrance, exit, and success-feedback keyframes plus the loader's Tailwind animation utilities. Component styles add route entrances, staged masthead content, result reveals, button feedback, and mobile menu enter/leave animations. The generator staggers only the first eight preview rows. Motion is enabled only with `prefers-reduced-motion: no-preference`; the home-page digit counter also skips rolling when reduced motion is requested. Mobile menu exits use Angular's `animate.leave`, with leaving controls made inert until removal.

Use complete class names for conditional variants (see the button component), so Tailwind can discover them. New components default to CSS; Sass and component SCSS are no longer used.

## Imports and Aliases

Path aliases are configured in `tsconfig.json`, for example:

- `@core/*`
- `@layout/*` (also configured in Vitest)
- `@shared/*`
- `@features/*`
- `@services/*`

These aliases are used throughout the app to keep imports stable and readable.

## Testing and Quality

- Unit/integration tests: Vitest
- Vite and Vitest are explicit dev dependencies; keep `vitest`, `@vitest/ui`, and `@vitest/coverage-v8` on matching versions. The targeted `@angular/build>vite` override in `pnpm-workspace.yaml` also patches Angular's exactly pinned dev-server dependency. Review the override when updating Angular's builder.
- Linting: Angular ESLint + Stylelint
- Formatting: Prettier
- E2E: Cypress
- Worker types: `pnpm typecheck:worker` (checked separately because the Angular application builder does not type-check Worker code)
- CI workflow (`.github/workflows/ci.yml`) runs lint, Worker type checking, production build, style lint, and Vitest coverage on Node 24

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

- `core/`: application-level layout, shared services, route config, preloading strategies
- `shared/`: reusable UI components, directives, pipes, validators
- `features/`: domain features (`home`, `parser`, `generator`, `static/not-found`)

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

## Generation

The flow is `SimpleGeneratorComponent → GeneratorStateService → PeselGeneratorService → pesel.worker.ts → generatePeselBatch`.

- `core/generation/pesel-generation.ts` is a pure TypeScript algorithm, independent of Angular and browser APIs. It validates requests and samples without replacement from the valid date/serial space using a sparse Fisher–Yates shuffle. Existing values are mapped to excluded indices before sampling, so a nearly exhausted space does not cause collision retries or false failures.
- For a fixed date there are 5,000 combinations per sex, or 10,000 without a sex restriction. Oversized requests fail before returning any results. Uniqueness covers the requested batch and any explicitly supplied exclusions, not an official PESEL registry.
- Random dates range from January 1 of the current year minus 100 through today (local calendar), within 1800–2299. Explicit dates support the full PESEL range, including future dates.
- `pesel-worker.protocol.ts` defines the request/response contract. A job owns one Worker, which is terminated on success, error, cancellation, or a 60-second timeout. Consumers are independent. The home page also uses this asynchronous API and skips overlapping refreshes.
- Workers are created lazily. SSR renders without generating numbers. Browsers without Worker support show an error; there is no synchronous bulk fallback that could freeze the UI.
- The component-scoped `GeneratorStateService` owns pending/error state, cancellation and the current in-memory result. Each accepted generation clears the previous result immediately, and success replaces it with the new batch. Uniqueness is scoped to one batch. Clearing the list or destroying the view cancels the job and prevents stale results from being saved. Overlapping submissions are ignored.
- Results are never saved to localStorage and disappear on reload or when leaving the generator. The legacy `pesel-list:v1` key is removed when opening the generator.
- The sex control offers Male, Female, and Random. Random omits the sex restriction while retaining the selected date.
- The UI and batch API allow 1–100,000 numbers per request, with no accumulated list. Only the first 100 rows render; text/JSON copy and download include the entire list.

The Worker removes generation from the main thread, but structured cloning, JSON serialization, and exports still use the main thread. For substantially larger datasets, use chunked transfer plus streamed export/IndexedDB instead of raising the current limit.

## Styling

Styles use Tailwind CSS 4 via `@tailwindcss/postcss` in `.postcssrc.json`:

- `src/styles.css` imports Tailwind and holds minimal document-wide base styles.
- Component templates and Angular host classes own layout, typography, responsive states, and interactions.
- `src/app/styles/theme.css` defines a shared `--brand-*` palette for the masthead, navigation, cards, controls, and actions, and exposes semantic color utilities through `@theme inline`. Colors use `light-dark()` with the existing `data-theme` selection and system preference fallback.
- `src/app/styles/fonts.css` loads the self-hosted Quicksand and JetBrains Mono fonts.
- `src/app/styles/animations.css` registers the hero and loader keyframes as Tailwind animation utilities, used with `motion-safe:`.

Use complete class names for conditional variants (see the button component), so Tailwind can discover them. New components default to CSS; Sass and component SCSS are no longer used.

## Imports and Aliases

Path aliases are configured in `tsconfig.json`, for example:

- `@core/*`
- `@shared/*`
- `@features/*`
- `@services/*`

These aliases are used throughout the app to keep imports stable and readable.

## Testing and Quality

- Unit/integration tests: Vitest
- Linting: Angular ESLint + Stylelint
- Formatting: Prettier
- E2E: Cypress
- Worker types: `npm run typecheck:worker` (checked separately because the Angular application builder does not type-check Worker code)
- CI workflow (`.github/workflows/ci.yml`) runs lint, Worker type checking, production build, style lint, and Vitest coverage on Node 24

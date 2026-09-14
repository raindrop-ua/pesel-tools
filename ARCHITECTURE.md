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
- `pesel-generator.service.ts`: creates valid PESEL values
- `pesel-utils.ts`: low-level PESEL helpers (e.g. checksum/date logic)
- `pesel-store.service.ts`: state and data flow support for PESEL-related UI

Additional platform services include clipboard, download, storage, theme, SEO, and service-worker update handling.

## Styling

Styles use Tailwind CSS 4 via `@tailwindcss/postcss` in `.postcssrc.json`:

- `src/styles.css` imports Tailwind and holds minimal document-wide base styles.
- Component templates and Angular host classes own layout, typography, responsive states, and interactions.
- `src/app/styles/theme.css` defines a shared `--brand-*` palette for the masthead, navigation, cards, controls, and actions, and exposes semantic color utilities through `@theme inline`. Colors use `light-dark()` with the existing `data-theme` selection and system preference fallback.
- `src/app/styles/fonts.css` loads the self-hosted Quicksand and JetBrains Mono fonts.
- `src/app/styles/animations.css` registers the hero and loader keyframes as Tailwind animation utilities, used with `motion-safe:`.

Use complete class names for conditional variants (see the button component), so Tailwind can discover them. New components default to CSS; Sass and component SCSS are no longer used.

## Imports and Aliases

Path aliases are configured in `tsconfig.json` (`baseUrl: "src"`), for example:

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
- CI workflow (`.github/workflows/ci.yml`) runs lint, tests, and coverage on Node 24

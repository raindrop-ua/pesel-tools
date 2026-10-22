# AGENTS.md

## Scope

These instructions apply to the entire repository unless a deeper `AGENTS.md` overrides them.

## Project Summary

- App: Angular 22 application for validating and parsing Polish PESEL numbers.
- Tooling: Angular CLI, TypeScript, Vitest, ESLint, Stylelint, Prettier, Cypress.
- Package manager: `pnpm`.

## Working Rules

- Keep changes focused and minimal; do not refactor unrelated code.
- Preserve the existing Angular and TypeScript style used in `src/`.
- Always keep each Angular component in separate `.ts`, `.html`, and `.css` files. Reference the external template and stylesheet with `templateUrl` and `styleUrl` (or `styleUrls`); never put inline `template` or `styles` in the component `.ts` file. Keep the separate `.css` file even when it is initially empty.
- Prefer fixing issues at the root cause instead of adding superficial workarounds.
- Update docs when behavior, commands, or architecture meaningfully change.
- Do not commit, tag, or release unless explicitly asked.

## Key Commands

- Install deps: `pnpm install`
- Dev server: `pnpm start`
- Build: `pnpm build`
- Unit tests: `pnpm test`
- Coverage: `pnpm test:coverage`
- Lint TS/JS: `pnpm lint`
- Lint styles: `pnpm lint:css`
- E2E: `pnpm e2e` or `pnpm cypress:run`

## Repository Map

- `src/`: application source code.
- `public/`: static public assets.
- `docs/`: documentation and project images.
- `cypress/`: end-to-end tests.
- `dist/`: build output; do not edit manually.

## Notes For Agents

- Check for nested `AGENTS.md` files before editing files in subdirectories.
- Since `dist/` is generated output, make source changes under `src/` and rebuild only when needed.
- `pnpm start` runs without opening a browser; `pnpm start:open` opens one.

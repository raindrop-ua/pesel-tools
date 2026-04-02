# AGENTS.md

## Scope
These instructions apply to the entire repository unless a deeper `AGENTS.md` overrides them.

## Project Summary
- App: Angular 21 application for validating and parsing Polish PESEL numbers.
- Tooling: Angular CLI, TypeScript, Vitest, ESLint, Stylelint, Prettier, Cypress.
- Package manager: `npm`.

## Working Rules
- Keep changes focused and minimal; do not refactor unrelated code.
- Preserve the existing Angular and TypeScript style used in `src/`.
- Prefer fixing issues at the root cause instead of adding superficial workarounds.
- Update docs when behavior, commands, or architecture meaningfully change.
- Do not commit, tag, or release unless explicitly asked.

## Key Commands
- Install deps: `npm install`
- Dev server: `npm start`
- Build: `npm run build`
- Unit tests: `npm test`
- Coverage: `npm run test:coverage`
- Lint TS/JS: `npm run lint`
- Lint styles: `npm run lint:scss`
- E2E: `npm run e2e` or `npm run cypress:run`

## Repository Map
- `src/`: application source code.
- `public/`: static public assets.
- `docs/`: documentation and project images.
- `cypress/`: end-to-end tests.
- `dist/`: build output; do not edit manually.

## Notes For Agents
- Check for nested `AGENTS.md` files before editing files in subdirectories.
- Since `dist/` is generated output, make source changes under `src/` and rebuild only when needed.
- `npm start` currently opens a browser via `ng serve -o`; prefer a non-opening variant when running automation.

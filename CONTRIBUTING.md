# Contributing

Thank you for contributing to `pesel-tools`.

## Prerequisites

- Node.js 24.x (CI uses Node 24)
- npm

## Local Setup

```bash
npm install
```

Run app locally:

```bash
npm start
```

## Development Workflow

1. Create a branch from `main` or `develop`.
2. Make focused changes (avoid unrelated refactors).
3. Run checks locally before opening a PR.
4. Open a pull request to `main` or `develop`.

## Quality Checks

Run the same checks used in CI:

```bash
npm run lint
npm test
npm run test:coverage
```

Additional useful checks:

```bash
npm run lint:scss
npm run cypress:run
```

## Commit Convention

This project uses Conventional Commits (`@commitlint/config-conventional`).

Examples:

- `feat(parser): add stricter input formatting`
- `fix(generator): handle invalid day values`
- `docs: update architecture notes`

## Pre-commit Hooks

Husky + lint-staged run automatically on commit:

- ESLint autofix for `*.ts,*.js`
- Stylelint autofix for `*.scss,*.css`
- Prettier for `*.ts,*.js,*.scss,*.json,*.html,*.md`

## Pull Request Notes

- Keep PRs small and reviewable.
- Include tests when behavior changes.
- Update docs (`README.md`, `ARCHITECTURE.md`, etc.) when needed.

# PESEL Tools

![CI](https://github.com/raindrop-ua/pesel-tools/actions/workflows/ci.yml/badge.svg)
![Commits](https://img.shields.io/badge/commits-conventional-brightgreen)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
![Angular](https://img.shields.io/badge/angular-22-brightgreen)
![Build](https://img.shields.io/github/actions/workflow/status/raindrop-ua/pesel-tools/ci.yml?branch=main)

A lightweight app that parses and validates Polish PESEL numbers with full birthdate, sex extraction, and checksum verification.

![Preview](docs/og-source.png)

## Features

- Unique PESEL generation in a Web Worker, with cancellable batches up to 100,000
- PESEL validation (format, checksum, and birthdate)
- Batch validation for up to 100,000 PESELs from lists or CSV/TXT files, with duplicate detection, filters and CSV/JSON export
- Interactive digit breakdown and step-by-step checksum calculation in the parser
- Deterministic test datasets for century boundaries, leap dates, invalid formats, wrong checksums and duplicates, with expected outcomes
- Extracts birthdate
- Detects biological sex from PESEL
- Friendly UI with real-time feedback
- Tailwind CSS 4 styling with light, dark, and system themes
- Clean, documented TypeScript architecture

### More tools

- `/batch`: paste a list or choose a UTF-8 CSV/TXT file up to 5 MB. Plain lists accept whitespace, comma and semicolon separators. CSV supports comma, semicolon and tab delimiters, escaped quotes and multiline quoted fields. Multi-column CSV requires one column named `PESEL` (case-insensitive). A single CSV column can omit its header. Empty CSV fields are validated as invalid values; blank lines are skipped. Values stay as strings, preserving leading zeros.
- `/parser`: enter 11 digits to explore the date, century offset, serial, encoded sex and control digit. The checksum explanation also works for invalid numbers.
- `/test-data`: select a reproducible dataset, copy JSON or download CSV/JSON with scenario descriptions and expected validity/error codes. **Check this set** transfers the dataset into the batch checker in memory.

Batch checking runs locally in cancellable chunks, renders 50 matching rows per page and exports every matching row. Inputs over 20,000 characters use a read-only preview of the first 5,000 characters; the complete input is checked. Large clipboard pastes are intercepted before native editing to avoid expensive textarea layout. Clear the input to replace a large list. Input and results are not stored or sent to an API. Duplicate counts include repeated rows, independently of their validity. CSV exports neutralize spreadsheet formula prefixes; import PESEL columns as text in spreadsheets to preserve leading zeros. JSON always preserves PESEL strings.

Validation checks structure, calendar date and checksum; it does not query the official registry. Synthetic test values are not guaranteed to be unassigned. Future dates within the supported 1800–2299 range pass structural date validation. Encoding follows the [Polish government PESEL guide](https://www.gov.pl/web/gov/czym-jest-numer-pesel).

### What is PESEL?

PESEL (Powszechny Elektroniczny System Ewidencji Ludności) is Poland’s national identification number assigned to every resident. It’s an 11-digit number that encodes basic personal data and is widely used across public and private sectors for identification purposes.

### Why is it needed?

PESEL is used by government agencies, hospitals, banks, schools, and employers to uniquely identify individuals. It simplifies data management, helps prevent identity duplication, and allows easy retrieval of essential information like date of birth and gender.

## Live Demo

[🔗 Try it on pesel.dev](https://pesel.dev)

## Documentation

- [Contributing Guide](CONTRIBUTING.md)
- [Architecture Overview](ARCHITECTURE.md)

## License

The application source code is available under the [MIT License](LICENSE).

The self-hosted fonts are licensed under the SIL Open Font License 1.1 (OFL):

- [Quicksand](src/assets/fonts/quicksand/OFL.txt)
- [JetBrains Mono](src/assets/fonts/jetbrains/OFL.txt)

## Run locally

Use Node.js 24.x and pnpm 12.14.0 (pinned in `package.json`).

```bash
git clone https://github.com/raindrop-ua/pesel-tools.git
cd pesel-tools
corepack enable pnpm
pnpm install
pnpm start
```

## Docker

```bash
docker build -t pesel-tools .
docker run --rm -p 4200:4200 pesel-tools
```

Open `http://localhost:4200`. The image runs as the `node` user and checks the homepage every 30 seconds. Only the bundled application is copied to the runtime image; dependencies are installed in the build stage with the frozen pnpm lockfile and a cached store.

---

Made with ❤️ by [Anton Sizov](https://antonsizov.com)

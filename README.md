# PESEL Tools

![CI](https://github.com/raindrop-ua/pesel-tools/actions/workflows/ci.yml/badge.svg)
![Commits](https://img.shields.io/badge/commits-conventional-brightgreen)
![MIT License](https://img.shields.io/badge/license-MIT-green)
![Angular](https://img.shields.io/badge/angular-20-brightgreen)
![Build](https://img.shields.io/github/actions/workflow/status/raindrop-ua/pesel-tools/ci.yml?branch=main)
[![Netlify Status](https://api.netlify.com/api/v1/badges/67eb1dd8-75ce-4061-b75a-c5707b8e9a33/deploy-status)](https://app.netlify.com/projects/pesel-tools/deploys)

A lightweight Angular app that parses and validates Polish PESEL numbers with full birthdate, sex extraction and checksum verification.

![Preview](docs/splash.png)

## ✨ Features

- PESEL validation (format, checksum, and birthdate)
- Extracts birthdate
- Detects biological sex from PESEL
- Friendly UI with real-time feedback
- Clean, documented TypeScript architecture

### What is PESEL?

PESEL (Powszechny Elektroniczny System Ewidencji Ludności) is Poland’s national identification number assigned to every resident. It’s an 11-digit number that encodes basic personal data and is widely used across public and private sectors for identification purposes.

### Why is it needed?

PESEL is used by government agencies, hospitals, banks, schools, and employers to uniquely identify individuals. It simplifies data management, helps prevent identity duplication, and allows easy retrieval of essential information like date of birth and gender.

## 🚀 Live Demo

[🔗 Try it on pesel.dev](https://pesel.dev)

## 📦 Run locally

```bash
git clone https://github.com/raindrop-ua/pesel-tools.git
cd pesel-tools
npm install
ng serve
```

---

👨‍💻 Made with ❤️ by [Anton Sizov](https://antonsizov.com)

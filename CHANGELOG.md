# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [0.12.5](https://github.com/raindrop-ua/pesel-tools/compare/v0.12.2...v0.12.5) (2025-08-12)

### Features

- **core:** add `DownloadService` for handling file downloads ([aa23be3](https://github.com/raindrop-ua/pesel-tools/commit/aa23be3fc5ddf0b673c22d37af6bf9be747e1f91))
- **core:** add ClipboardService and enhance CopyButton functionality ([62fac49](https://github.com/raindrop-ua/pesel-tools/commit/62fac497a01e8d06115efd2d613d95bd6c8ad3ad))
- **generator:** add autofocus and more friendly inputs behavior ([3f33257](https://github.com/raindrop-ua/pesel-tools/commit/3f332579fdf283afe6d4cd3cf48ac89c62b23da7))
- **generator:** add PeselItem component with toolbar functionality ([848a384](https://github.com/raindrop-ua/pesel-tools/commit/848a384fe328c70df222515b1e3e5c5f02ff7859))
- **generator:** ensure unique PESEL generation and storage logic ([87840b9](https://github.com/raindrop-ua/pesel-tools/commit/87840b9a130cf8c4b49cc2004d3ddd3606e156fc))
- **generator:** handle submit in simple generator ([2b7993a](https://github.com/raindrop-ua/pesel-tools/commit/2b7993a44bcd1e19a5396f26cdd4287c19840b85))
- **moment-pesel:** implement PESEL of the moment ([cab62ee](https://github.com/raindrop-ua/pesel-tools/commit/cab62eed61a0512c9bd3094d542657b3d640608b))
- **parser:** add `name` attribute to PESEL input for improved form handling ([918c00f](https://github.com/raindrop-ua/pesel-tools/commit/918c00f1aa9283325ce657b5a057dba1fc1cb4e5))
- **pesel-input:** add paste button ([0712b40](https://github.com/raindrop-ua/pesel-tools/commit/0712b40d35817e94545e35f920ba4109fdaa845e))
- **pesel-item:** integrate `GotoParseButton` and update PESEL number styling ([c8bbe14](https://github.com/raindrop-ua/pesel-tools/commit/c8bbe140d7bc7af193b4cb4563a953e35d1be302))
- **pesel-of-the-moment:** counter animation ([b9c7514](https://github.com/raindrop-ua/pesel-tools/commit/b9c7514c28a1ab557be59bf5856952f3f7abb642))
- **pesel-output:** integrate GotoParseButton when a single PESEL is present ([1c73984](https://github.com/raindrop-ua/pesel-tools/commit/1c73984cfa9eec85665a73e3898b950883f65257))
- **styles:** light theme ([537b831](https://github.com/raindrop-ua/pesel-tools/commit/537b831d492c03ad63e3a24f2d0cb9b9442bc54e))
- **toolbar:** add GotoParseButton component with navigation functionality ([1d2ce0d](https://github.com/raindrop-ua/pesel-tools/commit/1d2ce0d84d0a8c65bf005b476fc3c9941a20bd6e))
- **ui:** add auto-reset for SaveButton state and handle cleanup on destroy ([c40e592](https://github.com/raindrop-ua/pesel-tools/commit/c40e5927cf1dec65879d54f1ca692a01f8a6eed5))
- **ui:** add braces icon to SVG sprite ([724d398](https://github.com/raindrop-ua/pesel-tools/commit/724d398ccd657338272ca91a11413c2b834b9b09))
- **ui:** add CopyJsonButton component with clipboard functionality and styling ([27faf9c](https://github.com/raindrop-ua/pesel-tools/commit/27faf9c88d31504ef0fbb84aca46378f7544dbd6))
- **ui:** add SaveButton component for saving JSON files ([aca3697](https://github.com/raindrop-ua/pesel-tools/commit/aca36971cdd9bdc5a308bb598d3d62de77421025))
- **ui:** add a ToolbarButton component with dynamic state handling and accessibility features ([52e5fa9](https://github.com/raindrop-ua/pesel-tools/commit/52e5fa9fb146acd5cca88c1fa92d47bbb088c32d))
- **ui:** integrate CopyJsonButton into a PESEL output component and adjust styling ([285c085](https://github.com/raindrop-ua/pesel-tools/commit/285c08526f71b69b859ff42a371c81627e3c9a88))
- **value-input:** add generic value input component ([7c57ace](https://github.com/raindrop-ua/pesel-tools/commit/7c57ace7906066d8b49c58e74b8e7b549a8e07b7))

### Bug Fixes

- copy and paste buttons z-index ([b86ccdb](https://github.com/raindrop-ua/pesel-tools/commit/b86ccdbd4bb21cff16af93de42d249ffaf4924eb))
- date format pipe parameter in result output component ([be38e81](https://github.com/raindrop-ua/pesel-tools/commit/be38e81dcdbfa97aa35148d2dea33da15e6e602e))
- **generator:** set button types ([d5826f7](https://github.com/raindrop-ua/pesel-tools/commit/d5826f790ddf972f9f927d777e0bf45b8cd60216))
- **parser:** unify string quoting style in error checks on a PESEL parser component ([93dfacc](https://github.com/raindrop-ua/pesel-tools/commit/93dfacce7d7aaae70cab2016bc18f2b3ccd23d05))
- **pesel-of-the-moment:** make new number available for copying before animation ([b5c7ca4](https://github.com/raindrop-ua/pesel-tools/commit/b5c7ca4f74d95ba01f3cb9d0d266282d9a43b275))
- **styles:** improve input appearance consistency and responsive toolbar layout ([94f5709](https://github.com/raindrop-ua/pesel-tools/commit/94f5709845eb46b0af4386990d80e0c140e51b3b))
- **styles:** mobile menu overlay ([2f25f94](https://github.com/raindrop-ua/pesel-tools/commit/2f25f94a1e83e3c5516bfa56385b1a0d3d4b3e15))
- **styles:** mobile version gaps in birthdate input ([cebdf74](https://github.com/raindrop-ua/pesel-tools/commit/cebdf74d82fc4a63e53652b513efc98190b2ec2a))
- **styles:** pesel of the moment color ([ac9666f](https://github.com/raindrop-ua/pesel-tools/commit/ac9666f64247a755270806ded0be852e6f32a242))
- valid-date validator ([41bb1d9](https://github.com/raindrop-ua/pesel-tools/commit/41bb1d91b4a3d6b531cf97bd1253f090d281e385))

### [0.12.4](https://github.com/raindrop-ua/pesel-tools/compare/v0.12.3...v0.12.4) (2025-08-11)

### Features

- **core:** add `DownloadService` for handling file downloads ([aa23be3](https://github.com/raindrop-ua/pesel-tools/commit/aa23be3fc5ddf0b673c22d37af6bf9be747e1f91))
- **core:** add ClipboardService and enhance CopyButton functionality ([62fac49](https://github.com/raindrop-ua/pesel-tools/commit/62fac497a01e8d06115efd2d613d95bd6c8ad3ad))
- **ui:** add SaveButton component for saving JSON files ([aca3697](https://github.com/raindrop-ua/pesel-tools/commit/aca36971cdd9bdc5a308bb598d3d62de77421025))

### Bug Fixes

- **styles:** mobile version gaps in birthdate input ([cebdf74](https://github.com/raindrop-ua/pesel-tools/commit/cebdf74d82fc4a63e53652b513efc98190b2ec2a))

### 0.12.3 (2025-08-06)

### Features

- add paste button component ([7a312b5](https://github.com/raindrop-ua/pesel-tools/commit/7a312b58479fc53e5840df4f61c70a19ef6ed886))
- **directive:** external link ([852f4a7](https://github.com/raindrop-ua/pesel-tools/commit/852f4a712b86c93cf6d7dc0298742bb0ff4c7026))
- **generator:** add autofocus and more friendly inputs behavior ([3f33257](https://github.com/raindrop-ua/pesel-tools/commit/3f332579fdf283afe6d4cd3cf48ac89c62b23da7))
- **generator:** handle form submit in simple generator ([2b7993a](https://github.com/raindrop-ua/pesel-tools/commit/2b7993a44bcd1e19a5396f26cdd4287c19840b85))
- **moment-pesel:** implement PESEL of the moment ([cab62ee](https://github.com/raindrop-ua/pesel-tools/commit/cab62eed61a0512c9bd3094d542657b3d640608b))
- **paste-button:** update paste icon ([93e95fd](https://github.com/raindrop-ua/pesel-tools/commit/93e95fd9999eb61299ac48314cce7f1162d981d4))
- **pesel-input:** add paste button ([0712b40](https://github.com/raindrop-ua/pesel-tools/commit/0712b40d35817e94545e35f920ba4109fdaa845e))
- **pesel-of-the-moment:** counter animation ([b9c7514](https://github.com/raindrop-ua/pesel-tools/commit/b9c7514c28a1ab557be59bf5856952f3f7abb642))
- **styles:** light theme ([537b831](https://github.com/raindrop-ua/pesel-tools/commit/537b831d492c03ad63e3a24f2d0cb9b9442bc54e))
- **value-input:** add generic value input component ([7c57ace](https://github.com/raindrop-ua/pesel-tools/commit/7c57ace7906066d8b49c58e74b8e7b549a8e07b7))

### Bug Fixes

- copy and paste buttons z-index ([b86ccdb](https://github.com/raindrop-ua/pesel-tools/commit/b86ccdbd4bb21cff16af93de42d249ffaf4924eb))
- date format pipe parameter in result output component ([be38e81](https://github.com/raindrop-ua/pesel-tools/commit/be38e81dcdbfa97aa35148d2dea33da15e6e602e))
- **generator:** set button types ([d5826f7](https://github.com/raindrop-ua/pesel-tools/commit/d5826f790ddf972f9f927d777e0bf45b8cd60216))
- **header:** revert change detection strategy to default ([5a2b5e5](https://github.com/raindrop-ua/pesel-tools/commit/5a2b5e533a3decc1d009e36a2328659a561e3451))
- **pesel-input:** pesel input wrapper style ([082cfa5](https://github.com/raindrop-ua/pesel-tools/commit/082cfa536f231b742bdc77158330fbf1bebd40aa))
- **pesel-of-the-moment:** make new number available for copying before animation ([b5c7ca4](https://github.com/raindrop-ua/pesel-tools/commit/b5c7ca4f74d95ba01f3cb9d0d266282d9a43b275))
- **styles:** mobile menu overlay ([2f25f94](https://github.com/raindrop-ua/pesel-tools/commit/2f25f94a1e83e3c5516bfa56385b1a0d3d4b3e15))
- **styles:** pesel of the moment color ([ac9666f](https://github.com/raindrop-ua/pesel-tools/commit/ac9666f64247a755270806ded0be852e6f32a242))
- valid-date validator ([41bb1d9](https://github.com/raindrop-ua/pesel-tools/commit/41bb1d91b4a3d6b531cf97bd1253f090d281e385))

### 0.12.1 (2025-07-28)

### Features

- squashed initial public release ([c2b514a](https://github.com/raindrop-ua/pesel-tools/commit/c2b514aee15790d8e1e5652e924b8e94b74eb974))

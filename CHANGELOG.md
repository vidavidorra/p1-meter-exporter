## [2.0.0-beta.4](https://github.com/vidavidorra/p1-meter-exporter/compare/v2.0.0-beta.3...v2.0.0-beta.4) (2023-04-07)

### Bug Fixes

- report InfluxDB errors to Rollbar ([8857f33](https://github.com/vidavidorra/p1-meter-exporter/commit/8857f335a17605413cc5b0df4a5bdc41e714b2ff))
- **Rollbar:** add details to error context ([e10b350](https://github.com/vidavidorra/p1-meter-exporter/commit/e10b35073b88a96057b58ae31958fe89af40d692))

## [2.0.0-beta.3](https://github.com/vidavidorra/p1-meter-exporter/compare/v2.0.0-beta.2...v2.0.0-beta.3) (2023-04-06)

### Features

- add environment `production` or `development` to Rollbar ([f1a92ef](https://github.com/vidavidorra/p1-meter-exporter/commit/f1a92ef32467e3300ea1cabfd7ec96d67287793e))
- add package version to Rollbar errors ([21fc701](https://github.com/vidavidorra/p1-meter-exporter/commit/21fc7015b4f2fb95f2492a2ca3439db53cee36cf))

### Bug Fixes

- exit gracefully on both terminate and interrupt signals ([b449513](https://github.com/vidavidorra/p1-meter-exporter/commit/b449513d0ae84a26c539471c076eac399810bc4a))
- **p1-meter:** add data to telegram parser errors ([b1ba15d](https://github.com/vidavidorra/p1-meter-exporter/commit/b1ba15d955832a366ec9f7d33930ceb15f6e3f8c))

## [2.0.0-beta.2](https://github.com/vidavidorra/p1-meter-exporter/compare/v2.0.0-beta.1...v2.0.0-beta.2) (2023-04-04)

### Features

- report errors using Rollbar ([68f38b4](https://github.com/vidavidorra/p1-meter-exporter/commit/68f38b4360d3991cb57e00a630ec9e6443fbaa92))

### Code Refactoring

- **config:** use logger `levels` from dependency @vidavidorra/bunyan-pretty-stream ([569fa2c](https://github.com/vidavidorra/p1-meter-exporter/commit/569fa2cb910afcf81c3e004bc3a044eb5f66e69a))

### Documentation

- add usage to readme ([e004571](https://github.com/vidavidorra/p1-meter-exporter/commit/e004571670f53daf967d5b0c82b3b2306b4b2812))

## [2.0.0-beta.1](https://github.com/vidavidorra/p1-meter-exporter/compare/v1.1.2...v2.0.0-beta.1) (2023-03-24)

### ⚠ BREAKING CHANGES

- use low/high for tariff related measurements instead of 1/2

### Features

- use low/high for tariff related measurements instead of 1/2 ([b8059d5](https://github.com/vidavidorra/p1-meter-exporter/commit/b8059d51089ac0c0d195110b3ee08d5f198b315c))

### Continuous Integration

- add prerelease Docker tags ([02eafd8](https://github.com/vidavidorra/p1-meter-exporter/commit/02eafd887a07beb273e911019691c62762f51e52))

## [1.1.2](https://github.com/vidavidorra/p1-meter-exporter/compare/v1.1.1...v1.1.2) (2023-03-24)

### Bug Fixes

- log P1 meter errors and keep running the exporter ([347f3a8](https://github.com/vidavidorra/p1-meter-exporter/commit/347f3a8693094bfe594e2eefd070872cb68024df))

## [1.1.1](https://github.com/vidavidorra/p1-meter-exporter/compare/v1.1.0...v1.1.1) (2023-03-21)

### Bug Fixes

- **exporter:** remove unused log with single parsed value ([365e46b](https://github.com/vidavidorra/p1-meter-exporter/commit/365e46beee125eb2a1f25a5b78a5e360dc91789f))
- **p1-meter:** add trace log with the telegram to be parsed ([c89acb2](https://github.com/vidavidorra/p1-meter-exporter/commit/c89acb2c27d3c9c930403ceff5f767cf500cb19d))

## [1.1.0](https://github.com/vidavidorra/p1-meter-exporter/compare/v1.0.0...v1.1.0) (2023-03-20)

### Features

- **config:** allow enviornment variables without `P1E_` prefix ([4d0da19](https://github.com/vidavidorra/p1-meter-exporter/commit/4d0da19607d630b425a6adfa6d095702334356a4))

### Bug Fixes

- correct rounding to N decimal places, incorrectly was N-1 ([dc62974](https://github.com/vidavidorra/p1-meter-exporter/commit/dc629747a13d3cebc81222b5ccb9e7fd4267a8b4))

### Continuous Integration

- remove `GITHUB_TOKEN` docker arg ([a14643c](https://github.com/vidavidorra/p1-meter-exporter/commit/a14643c0f30c4bf3ef3d137f73051197536d00d0))

## 1.0.0 (2023-03-20)

### Features

- add initial P1 meter exporter code ([b933b8f](https://github.com/vidavidorra/p1-meter-exporter/commit/b933b8f06f6c12c8142de7794acd0f30dc7b08f1))

### Continuous Integration

- configure Docker registry user ([530db55](https://github.com/vidavidorra/p1-meter-exporter/commit/530db55cee8d35104df46868286253daacacc8e0))
- push to GitHub packages using PAT ([99f4c3c](https://github.com/vidavidorra/p1-meter-exporter/commit/99f4c3c5e4f8be717ba56ffdce7fc709f53a6838))
- set Docker registry to `ghcr.io`, without `https://` ([4419297](https://github.com/vidavidorra/p1-meter-exporter/commit/44192973729c9961a0477609f5df032581a5fa62))
- use GitHub App token in release ([9990f7e](https://github.com/vidavidorra/p1-meter-exporter/commit/9990f7e0b35491172a1dbeca9795a7a77b64ade3))

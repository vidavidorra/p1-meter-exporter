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

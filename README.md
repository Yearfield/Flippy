# Solicitor App Monorepo

This repository contains the early scaffolding for the Solicitor desktop application suite. The
monorepo is organized around Electron desktop, web UI, and a local Python conversion service along
with shared packages and test data.

Product context, competitive positioning, and roadmap themes are tracked in
[docs/COMPETITIVE_LANDSCAPE.md](docs/COMPETITIVE_LANDSCAPE.md). The shared architecture and workflow
map linking the renderer, Electron main process, conversion service, and binaries lives in
[docs/WORKFLOW_MAP.md](docs/WORKFLOW_MAP.md). Runtime dependencies and installer footprint planning
are documented in [docs/DEPENDENCIES.md](docs/DEPENDENCIES.md). A consolidated product brief covering
target users, architecture, technology choices, security posture, and the seeded backlog lives in
[docs/PRODUCT_BRIEF.md](docs/PRODUCT_BRIEF.md).

## Repository Structure

```
apps/
  desktop/        # Electron shell and native integrations
  web-ui/         # React-based renderer application
  convsvc/        # Python conversion service (stdio/HTTP)
packages/
  common/         # Shared utilities and types
  pdf-tools/      # PDF-specific helpers
  docx-tools/     # DOCX-specific helpers
testdata/         # Sample assets used for golden tests
e2e/              # End-to-end and golden test harnesses
.github/          # Workflows, issue/PR templates, CODEOWNERS
```

## Getting Started

Install JavaScript tooling and run linting or formatting checks:

```bash
npm install
npm run lint
npm run format
```

Python tooling for the conversion service lives under `apps/convsvc`:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r apps/convsvc/requirements.txt
pytest apps/convsvc
```

## License

This project is licensed under the Apache License 2.0. See [LICENSE](LICENSE) for details.

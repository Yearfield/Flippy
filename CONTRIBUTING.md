# Contributing

Thanks for your interest in contributing to the Solicitor app! This project is still in its early stages, so we appreciate every bug report, doc update, and code change.

## Getting Started

1. Install Node.js 20 and Python 3.11.
2. Run `npm install` from the repository root.
3. For the Python conversion service, create a virtual environment and install requirements with `pip install -r apps/convsvc/requirements.txt`.
4. Run `npm run lint`, `npm run format`, `npm run typecheck:ts`, and `pytest apps/convsvc` before opening a pull request.

## Branching & Pull Requests

- Create feature branches from `main`.
- Keep pull requests focused and add tests or documentation updates alongside code changes.
- Ensure the CI workflow passes before requesting a review.

## Code Style

- TypeScript/JavaScript: ESLint and Prettier are enforced via CI.
- Python: Use Black for formatting and Ruff for linting. Run `black apps/convsvc` and `ruff check apps/convsvc` locally.
- Editors: `.editorconfig` keeps indentation consistent.

## Reporting Security Issues

Please do not open public issues for security vulnerabilities. Instead, follow the guidance in [SECURITY.md](SECURITY.md).

## Community Expectations

Be respectful, inclusive, and constructive. See our [Code of Conduct](CODE_OF_CONDUCT.md) for more details.

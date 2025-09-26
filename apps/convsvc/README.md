# Conversion Service (convsvc)

This directory holds the Python-based conversion service that powers PDF and DOCX operations in the
Solicitor desktop app. The service will eventually orchestrate system binaries and expose a local
API for the Electron shell.

## Development

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
pytest
```

## Roadmap

- Bundle OCR, PDF, and document conversion binaries.
- Expose HTTP endpoints for conversion requests and health checks.
- Integrate with the Electron shell using stdio or localhost communication.

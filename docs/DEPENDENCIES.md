# Offline MVP Dependency Footprint

This document tracks the core runtime dependencies that ship with the offline-first Solicitor
application, along with approximate installer impact and licensing considerations. The goal is to
make clear what we bundle on Windows and macOS for the MVP so that engineering, product, and
compliance stakeholders can plan packaging and governance work.

## Dependency Table

| Dependency                         | Purpose                                         | Approx. Size (Win/mac)                | License                 | Notes                                                 |
| ---------------------------------- | ----------------------------------------------- | ------------------------------------- | ----------------------- | ----------------------------------------------------- |
| Electron (with Node.js + Chromium) | App shell, UI, printing integration             | ~120 MB                               | MIT                     | Base runtime, required.                               |
| Tesseract OCR                      | OCR for scanned images & PDFs                   | 40–60 MB + 10–20 MB per language pack | Apache 2.0              | Ship at least `eng`; allow user to add more packs.    |
| Ghostscript                        | PDF processing backend (needed by ocrmypdf)     | 25–30 MB                              | AGPL (can redistribute) | Used for OCR embedding, PDF cleanup, rasterization.   |
| ocrmypdf (Python wrapper)          | Automates OCR with Tesseract + Ghostscript      | <5 MB (Python package)                | MPL 2.0                 | Key pipeline for searchable PDFs.                     |
| pdf2docx (Python)                  | PDF → Word/DOCX conversion                      | <5 MB (Python package)                | MIT                     | Decent accuracy for most PDFs.                        |
| LibreOffice (headless)             | Advanced PDF → DOCX (layout preservation)       | 250–300 MB                            | MPL 2.0                 | Optional toggle; heavy but powerful.                  |
| ImageMagick                        | Image preprocessing (resize, clean, rotate)     | 30–40 MB                              | Apache 2.0              | Improves OCR accuracy; assists image→PDF conversions. |
| python-docx                        | Create/manipulate DOCX (OCR → Word output)      | <5 MB                                 | MIT                     | Pure Python.                                          |
| pdf-lib (JS)                       | PDF annotation, merge/split, redaction overlays | <1 MB (npm)                           | MIT                     | Runs in Electron directly.                            |
| mammoth.js (JS)                    | Import DOCX → HTML for in-app editing           | <1 MB (npm)                           | MIT                     | Good for structured legal documents.                  |
| dolanmiu/docx (JS)                 | Export edited HTML → DOCX                       | <1 MB (npm)                           | MIT                     | Completes DOCX editing workflow.                      |
| Pillow (Python)                    | Image manipulation for OCR prep                 | ~3 MB                                 | PSF License             | Lightweight helper; complements ImageMagick.          |
| OpenSSL (bundled in Node/Electron) | Encryption for local storage                    | Already bundled                       | Apache-style            | No extra size impact.                                 |

## Installer Footprint Estimate

| Bundle Scenario                      | Estimated Size |
| ------------------------------------ | -------------- |
| Base Electron app                    | ~120 MB        |
| + Tesseract (with 2–3 languages)     | ~70 MB         |
| + Ghostscript                        | ~30 MB         |
| + ocrmypdf/pdf2docx/python-docx/etc. | ~15 MB         |
| + LibreOffice (headless)             | ~300 MB        |
| + ImageMagick                        | ~40 MB         |
| Other npm/Python libraries           | negligible     |

Total with LibreOffice: **~575–600 MB**  
Total without LibreOffice: **~275 MB**

These numbers keep the offline installer in the same footprint range as Microsoft Office or Adobe
Acrobat, which is acceptable for solicitor desktops that expect rich document tooling.

## Key Points

- Everything runs offline and ships with permissive OSS licenses. Ghostscript’s AGPL allows
  redistribution as long as we ship source notices, which are captured in
  [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md).
- LibreOffice drives the size spike; treat it as an optional download during first-run setup if we
  need a leaner default image.
- When we apply updates, ensure patch installers can skip unmodified large binaries to reduce
  download size for existing users.

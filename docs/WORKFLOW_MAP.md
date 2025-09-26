# Master Workflow Map

This document captures how the Solicitor application coordinates its renderer UI, Electron
infrastructure, Python conversion service, and bundled binaries to deliver the four foundational
workflow families: Image→PDF, Image→Word, PDF→Word, and direct PDF editing.

## End-to-end architecture

```
React Renderer (Electron) ─┐
                           │ user actions + previews
Electron Main Process ─────┤ workspace routing, config, feature flags
                           ▼
Python Conversion Service (convsvc) ──┬─ OCR & conversions (Tesseract, Ghostscript, LibreOffice, ImageMagick)
                                      ├─ PDF/DOCX utilities (pdf-lib, PyMuPDF, mammoth.js)
                                      ▼
Local Workspace on Disk ⇆ Editors (PDF/DOCX)
```

- **UI (React / Electron renderer)** – Entry point where users import evidence, pick conversion
  options, review previews, and interact with editing surfaces.
- **Electron Main (Node.js)** – Owns the secure workspace lifecycle, dispatches operations to the
  conversion service, and manages configuration toggles (e.g., optional binaries, OCR languages).
- **Python Conversion Service** – Runs heavyweight conversions (OCR, image pre-processing,
  PDF↔DOCX transformations) and orchestrates external binaries. Communicates with the main process via
  local IPC (stdio/HTTP).
- **External binaries** – Tesseract, Ghostscript, LibreOffice, and ImageMagick are invoked by the
  conversion service for specialized processing steps.
- **Local file system** – Stores source files, intermediate outputs, audit logs, and final exports
  within per-project workspaces.
- **Editors** – In-app PDF and DOCX layers consume outputs from the workspace for annotation,
  redaction, and formatting before re-export.

## Workflow threads

All core workflows follow the same coordination pattern and reuse the shared workspace and
conversion components:

1. **Image→PDF**
   - Renderer collects selected images and desired preprocessing (deskew, grayscale, etc.).
   - Electron Main queues a conversion job and hands file paths plus options to the conversion
     service.
   - Conversion service applies ImageMagick/Pillow preprocessing, merges to PDF, optionally runs
     OCRmyPDF/Tesseract, and writes the bundle back to the workspace.
   - Renderer reloads the updated PDF in the viewer/editor layer.

2. **Image→Word**
   - Follows the Image→PDF steps, then chains a PDF→DOCX conversion via pdf2docx or LibreOffice.
   - DOCX output is stored in the workspace and opened inside the DOCX editor surface.

3. **PDF→Word**
   - Renderer submits the source PDF and conversion settings (standard vs. LibreOffice, OCR toggle).
   - Conversion service ensures the PDF is searchable (OCR pass if requested) and exports to DOCX
     using the configured engine.
   - Resulting DOCX is returned for editing or export.

4. **PDF editing & redaction**
   - Renderer drives pdf.js/pdf-lib powered annotations, page management, and redaction markups.
   - When applying redactions or other heavy edits, Electron Main delegates to the conversion service
     (PyMuPDF, pikepdf, qpdf) to permanently mutate the PDF.
   - Post-processing verification (rendering pages, text extraction) runs in the service before the
     sanitized file replaces the prior version in the workspace.

## Shared guarantees

- **No duplicate pipelines** – Each task reuses the same secure workspace, conversion orchestration,
  and binary invocation patterns.
- **Offline-first** – All operations execute locally with no dependency on external services.
- **Auditability** – Every conversion or edit leaves artifacts and logs within the workspace for
  later export alongside court bundles or QA reports.

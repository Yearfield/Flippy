# Product Brief: Solicitor Desktop Suite

## 1. Target Users and Core Jobs

**Primary user**: High-street solicitors, solo practitioners, and small firm legal staff who require offline-first tooling to prepare evidence bundles and editable documents.

**Core jobs to be done**

- Convert client-supplied images into PDF and/or DOCX with optional OCR to create searchable records.
- Convert PDFs into DOCX for further editing, redaction, or reuse in word processors.
- Edit and manage PDFs locally, including annotations, true redaction, combining/splitting, page reordering, and form filling.
- Edit Word documents with essential formatting capabilities (track changes is a later enhancement).
- Export, download, and print documents across multiple formats while preserving privacy and an audit trail.

**Constraints**: Strong privacy expectations (no default cloud transfer), reliable outputs admissible in legal workflows, offline availability, and workspace-level auditability.

## 2. Platform Recommendation

Phase 1 ships as an Electron desktop application (Windows/macOS) that wraps a local React UI. The Electron shell gives direct access to the OS file system, printing, and local cache storage while running the conversion workloads on-device for privacy. A pure web deployment remains an alternative fallback but sacrifices offline support. Optional connectors to cloud storage can be layered in later behind explicit user opt-ins.

## 3. Architecture Overview (Electron-first)

- **Electron Shell**: Boots a local React UI, manages window lifecycle, and exposes secure file system utilities. Invokes local services (Python conversion engine) via child processes/IPC and controls feature flags (e.g., optional updates).
- **Local Conversion Services**: Python-based conversion service orchestrates CLI tools (Tesseract, Ghostscript, LibreOffice, ImageMagick) for OCR, PDF↔DOCX, and preprocessing. JavaScript packages (`pdf-lib`, editors) supply in-app PDF/DOCX operations.
- **Key Data Flows**:
  1. Images → Conversion → PDF/DOCX (+OCR) → Editor → Export/Print.
  2. PDF → Conversion → DOCX → Editor → Export/Print.
  3. PDF → Editor → Export/Print.
- **Workspace Storage**: Each project uses an encrypted workspace folder. Keys are stored via the OS keychain. Temporary files auto-expire per workspace policy.

## 4. Technology Choices (Open-source First)

- **PDF Viewing & Editing**: `pdf.js` for viewing, `pdf-lib` for annotations, merge/split, and layout edits. Rasterization-based redaction is avoided; PyMuPDF/pikepdf/qpdf perform content removal.
- **OCR & Conversions**: Tesseract and OCRmyPDF handle OCR and searchable PDF generation. `img2pdf` and Pillow manage image-to-PDF pipelines. `pdf2docx` and headless LibreOffice handle PDF→DOCX. Advanced/commercial fallbacks include Apryse (PDFTron), PSPDFKit, ABBYY, Adobe PDF Services.
- **DOCX Editing**: Import DOCX to HTML with `mammoth.js`; edit via rich-text framework (TipTap/ProseMirror) and export back with `dolanmiu/docx`. OnlyOffice/Collabora (AGPL) remain future options for near-Word parity. CKEditor 5 plus export plugins is the commercial path.
- **Printing**: Use `webContents.print()` with native dialogs. Print-to-PDF supported where the OS exposes it.
- **Packaging**: Electron Builder signs and packages installers (.exe/.msi, .dmg/.pkg). Embedded binaries downloaded during packaging or on first run.

## 5. Security and Compliance

- Default to fully local processing; no data leaves the device without explicit configuration.
- Encrypt per-project workspaces and purge temporary data automatically (on project close or after 24 hours by default).
- Implement verifiable redaction: content removal via PyMuPDF/qpdf plus a verification pipeline that renders affected pages and runs text extraction to confirm success.
- Maintain an audit log per document capturing actions, timestamps, tool versions, and hashes for export alongside bundles.

## 6. UX Flow Summaries (MVP)

A. **Images → PDF**

1. Drag/drop or select images; auto-sort by timestamp/name and auto-rotate via EXIF.
2. Configure page size, margins, DPI, grayscale, OCR options, and ordering.
3. Generate PDF, optionally run OCR, preview in viewer, annotate, and export/print.

B. **Images → Word**

1. Import images, run OCR to reconstruct text.
2. Export to DOCX using python-docx and open within DOCX editor for final tweaks.

C. **PDF → Word**

1. Import PDF, select conversion engine (pdf2docx default, LibreOffice advanced) and OCR toggle for scanned PDFs.
2. Convert and load resulting DOCX into editor for review and export.

D. **PDF Editing**

1. Open PDF in viewer with annotation tools, page management, split/merge, and redaction markups.
2. Apply redactions via conversion service, verify sanitized output, and save/export.

E. **Word Editing**

1. Import DOCX, render in HTML editor with headings, basic formatting, lists, tables, and images.
2. Export to DOCX or PDF as required.

F. **Export & Print**

- Export options: PDF, DOCX, RTF, TXT, per-page PNG/JPG.
- Print via system dialog with support for ranges, duplex, and N-up when supported by OS drivers.

## 7. Quality Targets & Metrics

- PDF→DOCX structural error rate ≤ 5% on representative legal samples.
- OCR word error rate tracked per language; baseline with Tesseract plus optional dictionaries.
- Redaction safety automated tests must have zero failures (no text remains after apply).
- Performance targets: 500-page PDFs open in viewer < 3 seconds; 100-image batches processed within acceptable desktop limits.
- Reliability: >99.5% crash-free session rate.

## 8. Repository Structure (GitHub)

```
solicitor-app/
  apps/
    desktop/      # Electron shell (TS)
    web-ui/       # React renderer
    convsvc/      # Python conversion service
  packages/
    pdf-tools/    # PDF utilities
    docx-tools/   # DOCX helpers
    common/       # Shared code
  installers/    # Packaging configs
  testdata/      # Sample assets
  e2e/           # Playwright/golden tests
  .github/       # Workflows, templates, CODEOWNERS
```

## 9. Build Tooling and CI

- IDE baseline: Cursor/VSCode with TypeScript and Python extensions.
- GitHub Actions CI to run linting, unit tests, and e2e/regression suites.
- Cross-platform binary fetch handled via packaging scripts to stage Tesseract, OCRmyPDF, LibreOffice, etc.
- Feature flags gate optional commercial integrations for experimentation.

## 10. Licensing Notes

- Keep core stack under permissive licenses (Apache/MIT/MPL).
- Ghostscript (AGPL) redistribution is allowed with source offer compliance.
- OnlyOffice/Collabora (AGPL) require deployment considerations if bundled.
- For commercial SDKs (Apryse, PSPDFKit), isolate adapters to preserve swap-ability.

## 11. Test Strategy

- Golden file tests capturing expected outputs for conversions with hashes/heuristics.
- OCR quality harness measuring word error rate against ground truth samples.
- Redaction regression suite ensuring sanitized outputs contain no residual sensitive text.
- Load testing with large PDFs and high-resolution image batches.
- User acceptance sessions with solicitors verifying pagination, margins, Bates numbering, and readability.

## 12. Risk Register & Mitigations

| Risk                         | Mitigation                                                                                                 |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------- |
| PDF→DOCX fidelity gaps       | Combine pdf2docx + LibreOffice; evaluate Apryse/ABBYY if quality is insufficient.                          |
| Redaction correctness        | Invest early in PyMuPDF/qpdf workflows and verification harness; provide rasterization fallback if needed. |
| Bundling heavy dependencies  | Offer optional install (LibreOffice) and smaller default footprint.                                        |
| OCR quality across languages | Ship core language packs and allow user-managed installs.                                                  |

## 13. MVP Scope

- Import PDFs, DOCX, JPG/PNG/TIFF.
- Conversions: images → PDF (with OCR), PDF → DOCX (pdf2docx default, LibreOffice optional).
- PDF editing: annotations, merge/split, reorder, redaction with verification.
- DOCX editing: basic formatting (headings, bold/italic, lists, tables, images).
- Exports: PDF, DOCX, TXT; print via OS dialogs.
- Privacy features: local-only processing, manual temp data purge, audit logs.

## 14. Phase 2 Candidates

- Bates numbering, headers/footers, watermarks.
- Advanced forms (AcroForm), digital signatures, and certificate workflows.
- DOCX track changes.
- Template libraries for standard legal filings.
- Cloud storage connectors (SharePoint/OneDrive) with retention policies.
- Role-based access control and batch processing CLI.

## 15. Initial Backlog (Issue Seeds)

1. Scaffold Electron shell with updates disabled by default.
2. Create React renderer with file explorer and preview stubs.
3. Establish Python conversion service and IPC command bus between Electron and Python.
4. Integrate `pdf.js` viewer with annotation primitives.
5. Implement image→PDF pipeline with settings UI.
6. Wire OCR via OCRmyPDF with language pack management.
7. Implement PDF→DOCX conversions using pdf2docx and LibreOffice (feature flag).
8. Enable DOCX import/export loop (mammoth.js + dolanmiu/docx).
9. Deliver redaction v1 with verification flow.
10. Implement export/print pipelines.
11. Add workspace encryption and auto-purge policy.
12. Configure CI with sample datasets and golden tests.
13. Implement opt-in telemetry/error reporting respecting privacy.

## Cross-references

- Milestone plan and Definition of Done live in [`docs/DEFINITION_OF_DONE.md`](DEFINITION_OF_DONE.md).
- Competitive landscape and differentiators are detailed in [`docs/COMPETITIVE_LANDSCAPE.md`](COMPETITIVE_LANDSCAPE.md).
- Dependency footprint and binary planning are covered in [`docs/DEPENDENCIES.md`](DEPENDENCIES.md).
- Workflow architecture overview is maintained in [`docs/WORKFLOW_MAP.md`](WORKFLOW_MAP.md).

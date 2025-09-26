export interface ConversionOption {
  id: string;
  label: string;
}

export const DOCX_CONVERSION_OPTIONS: ConversionOption[] = [
  { id: 'standard', label: 'Standard (pdf2docx)' },
  { id: 'advanced', label: 'Advanced (LibreOffice)' },
];

export type BinaryCheck = {
  name: string;
  available: boolean;
};

export function summarizeBinaries(checks: BinaryCheck[]): string {
  const available = checks.filter((check) => check.available).map((check) => check.name);
  return available.length > 0
    ? `Detected binaries: ${available.join(', ')}`
    : 'No PDF tooling detected yet.';
}

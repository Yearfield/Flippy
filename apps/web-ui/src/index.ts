export interface WorkspaceSummary {
  name: string;
  documentCount: number;
}

export function describeWorkspace(summary: WorkspaceSummary): string {
  return `${summary.name} workspace contains ${summary.documentCount} documents.`;
}

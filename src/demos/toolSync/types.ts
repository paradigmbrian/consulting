export type AiStep = "map" | "reconcile";

export interface Business {
  name: string;
  service: string;
  context: string;
}

export interface SourceJob {
  customer: string;
  address: string;
  service: string;
  price: string;
  date: string;
  phone: string;
}

export interface ToolTarget {
  name: string;
  kind: string;
}

export interface MappedField {
  label: string;
  value: string;
}

export interface ToolMapping {
  toolName: string;
  kind: string;
  fields: MappedField[];
}

export interface Conflict {
  field: string;
  incoming: string;
  existing: string;
  resolution: string;
}

export interface Reconciliation {
  duplicateFound: boolean;
  existingLabel: string;
  matchReason: string;
  conflicts: Conflict[];
  note: string;
}

export interface SyncRow {
  toolName: string;
  detail: string;
}

export interface SyncSummary {
  headline: string;
  rows: SyncRow[];
  note: string;
}

export interface ResultsSummary {
  toolsSynced: number;
  fieldsMapped: string;
  duplicatesPrevented: string;
  timeSaved: string;
  takeaway: string;
}

export interface AiReasoning {
  step: AiStep;
  title: string;
  lines: string[];
}

export interface WorkflowProvider {
  getBusiness(): Business;
  getJob(): SourceJob;
  getTools(): ToolTarget[];
  getMappings(): ToolMapping[];
  getReconciliation(): Reconciliation;
  getSyncResult(): SyncSummary;
  getResults(): ResultsSummary;
  getAiReasoning(step: AiStep): AiReasoning;
}

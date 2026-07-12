export interface Business {
  name: string;
  service: string;
  context: string;
}

export interface Intake {
  customerName: string;
  channel: string;
  rawText: string;
  receivedLabel: string;
}

export interface ScopeField {
  label: string;
  value: string;
}

export interface LineItem {
  label: string;
  detail: string;
  amount: string;
}

export interface Quote {
  lineItems: LineItem[];
  total: string;
  validityNote: string;
}

export interface Approval {
  summary: string;
  ownerAction: string;
}

export interface Acceptance {
  customerName: string;
  replyBody: string;
  bookedDate: string;
  jobValue: string;
}

export interface ResultsSummary {
  requests: number;
  quotesSent: number;
  avgTurnaround: string;
  jobsBooked: number;
  winRate: string;
  revenueQuoted: string;
  takeaway: string;
}

export type AiStep = "understand" | "build";

export interface AiReasoning {
  step: AiStep;
  title: string;
  lines: string[];
}

export interface WorkflowProvider {
  getBusiness(): Business;
  getIntake(): Intake;
  getScope(): ScopeField[];
  getQuote(): Quote;
  getApproval(): Approval;
  getAcceptance(): Acceptance;
  getResults(): ResultsSummary;
  getAiReasoning(step: AiStep): AiReasoning;
}

export interface Business {
  name: string;
  service: string;
  context: string;
}

export interface Invoice {
  customerName: string;
  jobDescription: string;
  invoiceNo: string;
  amount: string;
  issuedLabel: string;
  dueLabel: string;
  daysOverdue: number;
}

export interface CadenceRung {
  label: string;
  timing: string;
  tone: string;
  channel: string;
  isOwnerFlag?: boolean;
}

export interface ReminderDraft {
  rungLabel: string;
  tone: string;
  body: string;
}

export interface Payment {
  customerName: string;
  method: string;
  amount: string;
  paidLabel: string;
  daysToPay: string;
}

export interface OwnerFlag {
  summary: string;
  note: string;
}

export interface ResultsSummary {
  invoicesTracked: number;
  collected: string;
  avgDaysBefore: string;
  avgDaysAfter: string;
  hoursSaved: string;
  flaggedForCall: number;
  takeaway: string;
}

export type AiStep = "plan" | "draft";

export interface AiReasoning {
  step: AiStep;
  title: string;
  lines: string[];
}

export interface WorkflowProvider {
  getBusiness(): Business;
  getInvoice(): Invoice;
  getCadence(): CadenceRung[];
  getReminders(): ReminderDraft[];
  getPayment(): Payment;
  getOwnerFlag(): OwnerFlag;
  getResults(): ResultsSummary;
  getAiReasoning(step: AiStep): AiReasoning;
}

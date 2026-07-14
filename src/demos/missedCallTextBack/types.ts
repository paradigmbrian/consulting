export interface Business {
  name: string;
  trades: string[];
  phone: string;
  context: string;
}

export interface MissedCall {
  callerName: string;
  number: string;
  timeLabel: string;
  ringNote: string;
}

export interface AutoText {
  body: string;
  responseSeconds: number;
}

export interface SmsTurn {
  id: string;
  from: "business" | "caller";
  body: string;
  timeLabel: string;
}

export interface QualifiedLead {
  problem: string;
  urgency: string;
  address: string;
  homeowner: boolean;
}

export interface Booking {
  service: string;
  when: string;
  tech: string;
  value: string;
}

export interface OwnerAlert {
  title: string;
  lines: string[];
}

export interface ResultsSummary {
  missedCalls: number;
  recovered: number;
  booked: number;
  revenueRecovered: string;
  takeaway: string;
}

export type AiStep = "conversation" | "book";

export interface AiReasoning {
  step: AiStep;
  title: string;
  lines: string[];
}

export interface WorkflowProvider {
  getBusiness(): Business;
  getMissedCall(): MissedCall;
  getAutoText(): AutoText;
  getConversation(): SmsTurn[];
  getQualified(): QualifiedLead;
  getBooking(): Booking;
  getOwnerAlert(): OwnerAlert;
  getResults(): ResultsSummary;
  getAiReasoning(step: AiStep): AiReasoning;
}

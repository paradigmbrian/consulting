export type AiStep = "compose" | "packet";
export type PacketStatus = "ready" | "collected" | "requested";

export interface Business {
  name: string;
  service: string;
  context: string;
}

export interface Signup {
  customerName: string;
  address: string;
  serviceBooked: string;
  bookedVia: string;
  intakeFacts: string[];
}

export interface Welcome {
  greeting: string;
  body: string[];
  whatToExpect: string[];
}

export interface PacketItem {
  label: string;
  detail: string;
  status: PacketStatus;
}

export interface Delivery {
  recipientName: string;
  channel: string;
  sentLabel: string;
}

export interface FirstVisit {
  slotLabel: string;
  tech: string;
  confirmation: string;
  detail: string;
}

export interface ResultsSummary {
  customersOnboarded: number;
  avgTimeToFirstVisit: string;
  agreementsSigned: string;
  hoursSaved: string;
  takeaway: string;
}

export interface AiReasoning {
  step: AiStep;
  title: string;
  lines: string[];
}

export interface WorkflowProvider {
  getBusiness(): Business;
  getSignup(): Signup;
  getWelcome(): Welcome;
  getPacket(): PacketItem[];
  getDelivery(): Delivery;
  getFirstVisit(): FirstVisit;
  getResults(): ResultsSummary;
  getAiReasoning(step: AiStep): AiReasoning;
}

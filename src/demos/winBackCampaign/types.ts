export interface Practice {
  name: string;
  services: string[];
  winBackWindow: string;
  listSource: string;
  listSize: number;
}

export interface PatientRecord {
  id: string;
  name: string;
  lastVisitLabel: string;
  lastService: string;
  contact: string;
}

export interface Segment {
  id: string;
  label: string;
  criteria: string;
  count: number;
  winnable: boolean;
}

export interface DroppedSummary {
  dropped: number;
  reasons: string[];
}

export interface Offer {
  headline: string;
  detail: string;
  channel: string;
}

export interface DraftMessage {
  patientId: string;
  channel: string;
  body: string;
}

export interface Reply {
  patientId: string;
  fromName: string;
  channel: string;
  body: string;
  receivedLabel: string;
}

export interface Booking {
  patientId: string;
  service: string;
  when: string;
  value: string;
}

export interface ResultsSummary {
  contacted: number;
  delivered: number;
  replied: number;
  booked: number;
  revenueRecovered: string;
  takeaway: string;
}

export type AiStep = "segment" | "offer";

export interface AiReasoning {
  step: AiStep;
  title: string;
  lines: string[];
}

export interface WorkflowProvider {
  getPractice(): Practice;
  getPatients(): PatientRecord[];
  getSegments(): Segment[];
  getDroppedSummary(): DroppedSummary;
  getOffer(): Offer;
  getMessage(patientId: string): DraftMessage;
  getReply(patientId: string): Reply;
  getBooking(patientId: string): Booking;
  getResults(): ResultsSummary;
  getFeaturedPatientId(): string;
  getAiReasoning(step: AiStep): AiReasoning;
}

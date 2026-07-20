export interface Icp {
  facilityTypes: string[];
  serviceRadiusMiles: number;
  serviceAreaLabel: string;
}

export interface Company {
  name: string;
  tagline: string;
  services: string[];
  serviceArea: string;
  icp: Icp;
}

/** A candidate surfaced during discovery (pre-enrichment). */
export interface Prospect {
  id: string;
  name: string;
  facilityType: string;
  address: string;
  website: string;
  /** Buy-signal / match reasons shown in the Discover step. */
  matchSignals: string[];
}

/** Enrichment + qualify result for a single prospect. */
export interface Enrichment {
  prospectId: string;
  contactName: string;
  contactTitle: string;
  email: string;
  phone: string;
  employeeEstimate: string;
  facilityDetail: string;
  qualified: boolean;
  /** Present only when `qualified` is false. */
  dropReason?: string;
}

export interface DraftEmail {
  prospectId: string;
  subject: string;
  body: string;
  footer: string;
}

export interface SendResult {
  ok: boolean;
  messageId: string;
}

export interface Reply {
  prospectId: string;
  fromName: string;
  subject: string;
  body: string;
  receivedLabel: string;
}

export interface ResultsSummary {
  sent: number;
  opened: number;
  replied: number;
  takeaway: string;
}

export type AiStep = "discover" | "enrich" | "personalize";

export interface AiReasoning {
  step: AiStep;
  /** Panel header, e.g. "AI — matching buy-signals". */
  title: string;
  /** Short reasoning lines, revealed in sequence. */
  lines: string[];
}

export interface WorkflowProvider {
  getCompany(): Company;
  getICP(): Icp;
  getTargets(): Prospect[];
  getEnrichment(prospectId: string): Enrichment;
  getEmail(prospectId: string): DraftEmail;
  send(email: DraftEmail): Promise<SendResult>;
  getReply(prospectId: string): Reply;
  getResults(): ResultsSummary;
  /** First qualified prospect — the one Personalize/Send/Results focus on. */
  getFeaturedProspectId(): string;
  getAiReasoning(step: AiStep): AiReasoning;
}

export interface Business {
  name: string;
  category: string;
  ratingContext: string;
}

export interface Appointment {
  client: string;
  service: string;
  provider: string;
  timeLabel: string;
}

export interface ReviewRequest {
  body: string;
  delayLabel: string;
}

export type Sentiment = "positive" | "negative";
export type ReplyKind = "happy" | "unhappy";

export interface ClientReply {
  kind: ReplyKind;
  name: string;
  service: string;
  body: string;
  sentiment: Sentiment;
  receivedLabel: string;
}

export interface Routing {
  kind: ReplyKind;
  sentiment: Sentiment;
  decision: string;
  destination: string;
}

export interface GoogleReview {
  clientName: string;
  stars: number;
  suggestedBody: string;
}

export interface PrivateCatch {
  clientName: string;
  concern: string;
  ownerAction: string;
  alertLines: string[];
}

export interface ResultsSummary {
  requestsSent: number;
  reviewsGained: number;
  ratingBefore: string;
  ratingAfter: string;
  intercepted: number;
  takeaway: string;
}

export type AiStep = "route" | "draft";

export interface AiReasoning {
  step: AiStep;
  title: string;
  lines: string[];
}

export interface WorkflowProvider {
  getBusiness(): Business;
  getAppointment(): Appointment;
  getRequest(): ReviewRequest;
  getReply(kind: ReplyKind): ClientReply;
  getRouting(kind: ReplyKind): Routing;
  getGoogleReview(): GoogleReview;
  getPrivateCatch(): PrivateCatch;
  getResults(): ResultsSummary;
  getAiReasoning(step: AiStep): AiReasoning;
}

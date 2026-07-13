export type AiStep = "analyze" | "write";
export type Trend = "good" | "watch" | "flat";

export interface Business {
  name: string;
  service: string;
  context: string;
}

export interface RawMetric {
  source: string;
  label: string;
  value: string;
}

export interface Finding {
  label: string;
  value: string;
  delta: string;
  trend: Trend;
}

export interface RecommendedAction {
  summary: string;
  actionLabel: string;
}

export interface Digest {
  headline: string;
  highlights: string[];
  watchOut: string;
  recommendedAction: RecommendedAction;
}

export interface Delivery {
  recipientName: string;
  channel: string;
  sentLabel: string;
}

export interface ActionResult {
  confirmation: string;
  detail: string;
}

export interface ResultsSummary {
  reportsDelivered: number;
  avgReadTime: string;
  actionsTaken: number;
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
  getRawData(): RawMetric[];
  getFindings(): Finding[];
  getDigest(): Digest;
  getDelivery(): Delivery;
  getActionResult(): ActionResult;
  getResults(): ResultsSummary;
  getAiReasoning(step: AiStep): AiReasoning;
}

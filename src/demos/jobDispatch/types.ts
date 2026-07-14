export type AiStep = "assign" | "route";
export type Priority = "emergency" | "standard";

export interface Business {
  name: string;
  service: string;
  context: string;
}

export interface Tech {
  name: string;
  specialty: string;
  zone: string;
}

export interface Job {
  customer: string;
  location: string;
  type: string;
  window: string;
  priority: Priority;
}

export interface Assignment {
  jobLabel: string;
  customer: string;
  techName: string;
  reason: string;
}

export interface TechRoute {
  techName: string;
  stops: string[];
  driveNote: string;
}

export interface DispatchCrew {
  techName: string;
  stops: string;
}

export interface DispatchSummary {
  headline: string;
  crew: DispatchCrew[];
  note: string;
}

export interface Notification {
  recipientName: string;
  channel: string;
  sentLabel: string;
  message: string;
}

export interface ResultsSummary {
  jobsPlaced: number;
  driveTimeSaved: string;
  onTimeRate: string;
  dispatchTime: string;
  takeaway: string;
}

export interface AiReasoning {
  step: AiStep;
  title: string;
  lines: string[];
}

export interface WorkflowProvider {
  getBusiness(): Business;
  getTechs(): Tech[];
  getJobs(): Job[];
  getAssignments(): Assignment[];
  getRoutes(): TechRoute[];
  getDispatch(): DispatchSummary;
  getNotify(): Notification;
  getResults(): ResultsSummary;
  getAiReasoning(step: AiStep): AiReasoning;
}

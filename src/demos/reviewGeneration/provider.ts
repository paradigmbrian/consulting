import type {
  Business,
  Appointment,
  ReviewRequest,
  ClientReply,
  Routing,
  GoogleReview,
  PrivateCatch,
  ResultsSummary,
  ReplyKind,
  AiStep,
  AiReasoning,
  WorkflowProvider,
} from "./types";
import {
  business,
  appointment,
  request,
  replies,
  routing,
  googleReview,
  privateCatch,
  results,
  aiReasoning,
} from "./script";

class ScriptedWorkflowProvider implements WorkflowProvider {
  getBusiness(): Business {
    return business;
  }

  getAppointment(): Appointment {
    return appointment;
  }

  getRequest(): ReviewRequest {
    return request;
  }

  getReply(kind: ReplyKind): ClientReply {
    return replies[kind];
  }

  getRouting(kind: ReplyKind): Routing {
    return routing[kind];
  }

  getGoogleReview(): GoogleReview {
    return googleReview;
  }

  getPrivateCatch(): PrivateCatch {
    return privateCatch;
  }

  getResults(): ResultsSummary {
    return results;
  }

  getAiReasoning(step: AiStep): AiReasoning {
    return aiReasoning[step];
  }
}

export const scriptedWorkflowProvider: WorkflowProvider =
  new ScriptedWorkflowProvider();

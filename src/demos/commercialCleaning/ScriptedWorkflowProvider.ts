import type {
  Company,
  Prospect,
  Enrichment,
  DraftEmail,
  SendResult,
  Reply,
  ResultsSummary,
  WorkflowProvider,
  AiStep,
  AiReasoning,
} from "./types";
import {
  company,
  prospects,
  enrichments,
  emails,
  reply,
  results,
  featuredProspectId,
  aiReasoning,
} from "./script";

class ScriptedWorkflowProvider implements WorkflowProvider {
  getCompany(): Company {
    return company;
  }

  getICP() {
    return company.icp;
  }

  getTargets(): Prospect[] {
    return prospects;
  }

  getEnrichment(prospectId: string): Enrichment {
    const found = enrichments.find((e) => e.prospectId === prospectId);
    if (!found) {
      throw new Error(`No enrichment for prospect ${prospectId}`);
    }
    return found;
  }

  getEmail(prospectId: string): DraftEmail {
    const found = emails.find((e) => e.prospectId === prospectId);
    if (!found) {
      throw new Error(`No email for prospect ${prospectId}`);
    }
    return found;
  }

  send(email: DraftEmail): Promise<SendResult> {
    return Promise.resolve({ ok: true, messageId: `mock-${email.prospectId}` });
  }

  getReply(prospectId: string): Reply {
    if (reply.prospectId !== prospectId) {
      throw new Error(`No reply for prospect ${prospectId}`);
    }
    return reply;
  }

  getResults(): ResultsSummary {
    return results;
  }

  getFeaturedProspectId(): string {
    return featuredProspectId;
  }

  getAiReasoning(step: AiStep): AiReasoning {
    return aiReasoning[step];
  }
}

export const scriptedWorkflowProvider: WorkflowProvider =
  new ScriptedWorkflowProvider();

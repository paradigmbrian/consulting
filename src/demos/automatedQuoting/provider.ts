import type {
  Business,
  Intake,
  ScopeField,
  Quote,
  Approval,
  Acceptance,
  ResultsSummary,
  AiStep,
  AiReasoning,
  WorkflowProvider,
} from "./types";
import {
  business,
  intake,
  scope,
  quote,
  approval,
  acceptance,
  results,
  aiReasoning,
} from "./script";

class ScriptedWorkflowProvider implements WorkflowProvider {
  getBusiness(): Business {
    return business;
  }

  getIntake(): Intake {
    return intake;
  }

  getScope(): ScopeField[] {
    return scope;
  }

  getQuote(): Quote {
    return quote;
  }

  getApproval(): Approval {
    return approval;
  }

  getAcceptance(): Acceptance {
    return acceptance;
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

import type {
  Business,
  RawMetric,
  Finding,
  Digest,
  Delivery,
  ActionResult,
  ResultsSummary,
  AiStep,
  AiReasoning,
  WorkflowProvider,
} from "./types";
import {
  business,
  rawData,
  findings,
  digest,
  delivery,
  actionResult,
  results,
  aiReasoning,
} from "./script";

class ScriptedWorkflowProvider implements WorkflowProvider {
  getBusiness(): Business {
    return business;
  }

  getRawData(): RawMetric[] {
    return rawData;
  }

  getFindings(): Finding[] {
    return findings;
  }

  getDigest(): Digest {
    return digest;
  }

  getDelivery(): Delivery {
    return delivery;
  }

  getActionResult(): ActionResult {
    return actionResult;
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

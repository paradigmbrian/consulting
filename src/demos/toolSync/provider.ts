import type {
  Business,
  SourceJob,
  ToolTarget,
  ToolMapping,
  Reconciliation,
  SyncSummary,
  ResultsSummary,
  AiStep,
  AiReasoning,
  WorkflowProvider,
} from "./types";
import {
  business,
  job,
  tools,
  mappings,
  reconciliation,
  syncResult,
  results,
  aiReasoning,
} from "./script";

class ScriptedWorkflowProvider implements WorkflowProvider {
  getBusiness(): Business {
    return business;
  }

  getJob(): SourceJob {
    return job;
  }

  getTools(): ToolTarget[] {
    return tools;
  }

  getMappings(): ToolMapping[] {
    return mappings;
  }

  getReconciliation(): Reconciliation {
    return reconciliation;
  }

  getSyncResult(): SyncSummary {
    return syncResult;
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

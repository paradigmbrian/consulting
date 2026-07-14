import type {
  Business,
  Tech,
  Job,
  Assignment,
  TechRoute,
  DispatchSummary,
  Notification,
  ResultsSummary,
  AiStep,
  AiReasoning,
  WorkflowProvider,
} from "./types";
import {
  business,
  techs,
  jobs,
  assignments,
  routes,
  dispatch,
  notify,
  results,
  aiReasoning,
} from "./script";

class ScriptedWorkflowProvider implements WorkflowProvider {
  getBusiness(): Business {
    return business;
  }

  getTechs(): Tech[] {
    return techs;
  }

  getJobs(): Job[] {
    return jobs;
  }

  getAssignments(): Assignment[] {
    return assignments;
  }

  getRoutes(): TechRoute[] {
    return routes;
  }

  getDispatch(): DispatchSummary {
    return dispatch;
  }

  getNotify(): Notification {
    return notify;
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

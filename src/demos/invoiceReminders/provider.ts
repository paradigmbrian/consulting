import type {
  Business,
  Invoice,
  CadenceRung,
  ReminderDraft,
  Payment,
  OwnerFlag,
  ResultsSummary,
  AiStep,
  AiReasoning,
  WorkflowProvider,
} from "./types";
import {
  business,
  invoice,
  cadence,
  reminders,
  payment,
  ownerFlag,
  results,
  aiReasoning,
} from "./script";

class ScriptedWorkflowProvider implements WorkflowProvider {
  getBusiness(): Business {
    return business;
  }

  getInvoice(): Invoice {
    return invoice;
  }

  getCadence(): CadenceRung[] {
    return cadence;
  }

  getReminders(): ReminderDraft[] {
    return reminders;
  }

  getPayment(): Payment {
    return payment;
  }

  getOwnerFlag(): OwnerFlag {
    return ownerFlag;
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

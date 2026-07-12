import type {
  Business,
  MissedCall,
  AutoText,
  SmsTurn,
  QualifiedLead,
  Booking,
  OwnerAlert,
  ResultsSummary,
  AiStep,
  AiReasoning,
  WorkflowProvider,
} from "./types";
import {
  business,
  missedCall,
  autoText,
  conversation,
  qualified,
  booking,
  ownerAlert,
  results,
  aiReasoning,
} from "./script";

class ScriptedWorkflowProvider implements WorkflowProvider {
  getBusiness(): Business {
    return business;
  }

  getMissedCall(): MissedCall {
    return missedCall;
  }

  getAutoText(): AutoText {
    return autoText;
  }

  getConversation(): SmsTurn[] {
    return conversation;
  }

  getQualified(): QualifiedLead {
    return qualified;
  }

  getBooking(): Booking {
    return booking;
  }

  getOwnerAlert(): OwnerAlert {
    return ownerAlert;
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

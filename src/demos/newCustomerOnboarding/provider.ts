import type {
  Business,
  Signup,
  Welcome,
  PacketItem,
  Delivery,
  FirstVisit,
  ResultsSummary,
  AiStep,
  AiReasoning,
  WorkflowProvider,
} from "./types";
import {
  business,
  signup,
  welcome,
  packet,
  delivery,
  firstVisit,
  results,
  aiReasoning,
} from "./script";

class ScriptedWorkflowProvider implements WorkflowProvider {
  getBusiness(): Business {
    return business;
  }

  getSignup(): Signup {
    return signup;
  }

  getWelcome(): Welcome {
    return welcome;
  }

  getPacket(): PacketItem[] {
    return packet;
  }

  getDelivery(): Delivery {
    return delivery;
  }

  getFirstVisit(): FirstVisit {
    return firstVisit;
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

import type {
  Practice,
  PatientRecord,
  Segment,
  DroppedSummary,
  Offer,
  DraftMessage,
  Reply,
  Booking,
  ResultsSummary,
  AiStep,
  AiReasoning,
  WorkflowProvider,
} from "./types";
import {
  practice,
  patients,
  segments,
  droppedSummary,
  offer,
  messages,
  reply,
  booking,
  results,
  featuredPatientId,
  aiReasoning,
} from "./script";

class ScriptedWorkflowProvider implements WorkflowProvider {
  getPractice(): Practice {
    return practice;
  }

  getPatients(): PatientRecord[] {
    return patients;
  }

  getSegments(): Segment[] {
    return segments;
  }

  getDroppedSummary(): DroppedSummary {
    return droppedSummary;
  }

  getOffer(): Offer {
    return offer;
  }

  getMessage(patientId: string): DraftMessage {
    const found = messages.find((m) => m.patientId === patientId);
    if (!found) {
      throw new Error(`No message for patient ${patientId}`);
    }
    return found;
  }

  getReply(patientId: string): Reply {
    if (reply.patientId !== patientId) {
      throw new Error(`No reply for patient ${patientId}`);
    }
    return reply;
  }

  getBooking(patientId: string): Booking {
    if (booking.patientId !== patientId) {
      throw new Error(`No booking for patient ${patientId}`);
    }
    return booking;
  }

  getResults(): ResultsSummary {
    return results;
  }

  getFeaturedPatientId(): string {
    return featuredPatientId;
  }

  getAiReasoning(step: AiStep): AiReasoning {
    return aiReasoning[step];
  }
}

export const scriptedWorkflowProvider: WorkflowProvider =
  new ScriptedWorkflowProvider();

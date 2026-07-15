import type { ReactNode } from "react";
import { DemoProvider } from "../shared/DemoController";
import { SendLifecycleProvider } from "../shared/SendLifecycleProvider";
import DemoShell from "../shared/DemoShell";
import { workflowPath } from "../../data/workflows";
import { steps } from "./steps";
import { scriptedWorkflowProvider } from "./provider";
import MissedCallStep from "./steps/MissedCallStep";
import TextBackStep from "./steps/TextBackStep";
import ConversationStep from "./steps/ConversationStep";
import BookStep from "./steps/BookStep";
import OwnerAlertStep from "./steps/OwnerAlertStep";
import ResultsStep from "./steps/ResultsStep";
import "./missedcall.css";

const provider = scriptedWorkflowProvider;

function renderStage(stepId: string): ReactNode {
  switch (stepId) {
    case "missed-call":
      return <MissedCallStep provider={provider} />;
    case "text-back":
      return <TextBackStep provider={provider} />;
    case "conversation":
      return <ConversationStep provider={provider} />;
    case "book":
      return <BookStep provider={provider} />;
    case "owner-alert":
      return <OwnerAlertStep provider={provider} />;
    case "results":
      return <ResultsStep provider={provider} />;
    default:
      return null;
  }
}

const MissedCallTextBackDemo = () => {
  const business = provider.getBusiness();
  return (
    <DemoProvider steps={steps}>
      <SendLifecycleProvider>
        <DemoShell
          eyebrow="Paradigm Shift — Automation Demo"
          title={`Missed-call text-back for ${business.name}`}
          lede="A click-through of how one missed call becomes a booked job — instant text-back, an AI-qualified SMS thread, and a dispatched tech, all hands-off."
          backTo={workflowPath("missed-call-text-back")}
          renderStage={renderStage}
        />
      </SendLifecycleProvider>
    </DemoProvider>
  );
};

export default MissedCallTextBackDemo;

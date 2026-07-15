import type { ReactNode } from "react";
import { DemoProvider } from "../shared/DemoController";
import { SendLifecycleProvider } from "../shared/SendLifecycleProvider";
import DemoShell from "../shared/DemoShell";
import { workflowPath } from "../../data/workflows";
import { steps } from "./steps";
import { scriptedWorkflowProvider } from "./provider";
import ImportListStep from "./steps/ImportListStep";
import SegmentStep from "./steps/SegmentStep";
import CraftOfferStep from "./steps/CraftOfferStep";
import SendStep from "./steps/SendStep";
import RepliesStep from "./steps/RepliesStep";
import ResultsStep from "./steps/ResultsStep";
import "./winback.css";

const provider = scriptedWorkflowProvider;

function renderStage(stepId: string): ReactNode {
  switch (stepId) {
    case "import":
      return <ImportListStep provider={provider} />;
    case "segment":
      return <SegmentStep provider={provider} />;
    case "offer":
      return <CraftOfferStep provider={provider} />;
    case "send":
      return <SendStep provider={provider} />;
    case "replies":
      return <RepliesStep provider={provider} />;
    case "results":
      return <ResultsStep provider={provider} />;
    default:
      return null;
  }
}

const WinBackDemo = () => {
  const practice = provider.getPractice();
  return (
    <DemoProvider steps={steps}>
      <SendLifecycleProvider>
        <DemoShell
          eyebrow="Paradigm Shift — Automation Demo"
          title={`Win-back campaign for ${practice.name}`}
          lede="A click-through of how the automation wakes up a practice's lapsed patients — import, segment, offer, send, and book — end to end."
          backTo={workflowPath("win-back-campaigns")}
          renderStage={renderStage}
        />
      </SendLifecycleProvider>
    </DemoProvider>
  );
};

export default WinBackDemo;

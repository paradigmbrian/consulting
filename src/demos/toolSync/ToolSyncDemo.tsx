import type { ReactNode } from "react";
import { DemoProvider } from "../shared/DemoController";
import DemoShell from "../shared/DemoShell";
import { steps } from "./steps";
import { scriptedWorkflowProvider } from "./provider";
import IntakeStep from "./steps/IntakeStep";
import MapStep from "./steps/MapStep";
import ReconcileStep from "./steps/ReconcileStep";
import PushStep from "./steps/PushStep";
import ResultsStep from "./steps/ResultsStep";
import "./sync.css";

const provider = scriptedWorkflowProvider;

function renderStage(stepId: string): ReactNode {
  switch (stepId) {
    case "intake":
      return <IntakeStep provider={provider} />;
    case "map":
      return <MapStep provider={provider} />;
    case "reconcile":
      return <ReconcileStep provider={provider} />;
    case "push":
      return <PushStep provider={provider} />;
    case "results":
      return <ResultsStep provider={provider} />;
    default:
      return null;
  }
}

const ToolSyncDemo = () => {
  const business = provider.getBusiness();
  return (
    <DemoProvider steps={steps}>
      <DemoShell
        eyebrow="Paradigm Shift — Automation Demo"
        title={`Tool-to-tool sync for ${business.name}`}
        lede="A click-through of how one booking flows into every tool — shaped for each app and de-duplicated on the way — instead of being retyped four times."
        renderStage={renderStage}
      />
    </DemoProvider>
  );
};

export default ToolSyncDemo;

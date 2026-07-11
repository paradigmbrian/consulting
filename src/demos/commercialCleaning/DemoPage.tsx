import type { ReactNode } from "react";
import { DemoProvider } from "../shared/DemoController";
import { SendLifecycleProvider } from "../shared/SendLifecycleProvider";
import DemoShell from "../shared/DemoShell";
import { steps } from "./steps";
import { scriptedWorkflowProvider } from "./ScriptedWorkflowProvider";
import DefineTargetStep from "./steps/DefineTargetStep";
import DiscoverStep from "./steps/DiscoverStep";
import EnrichQualifyStep from "./steps/EnrichQualifyStep";
import PersonalizeStep from "./steps/PersonalizeStep";
import SendStep from "./steps/SendStep";
import ResultsStep from "./steps/ResultsStep";

const provider = scriptedWorkflowProvider;

function renderStage(stepId: string): ReactNode {
  switch (stepId) {
    case "define":
      return <DefineTargetStep provider={provider} />;
    case "discover":
      return <DiscoverStep provider={provider} />;
    case "enrich":
      return <EnrichQualifyStep provider={provider} />;
    case "personalize":
      return <PersonalizeStep provider={provider} />;
    case "send":
      return <SendStep provider={provider} />;
    case "results":
      return <ResultsStep provider={provider} />;
    default:
      return null;
  }
}

const DemoPage = () => {
  return (
    <DemoProvider steps={steps}>
      <SendLifecycleProvider>
        <DemoShell
          eyebrow="Paradigm Shift — Workflow Demo"
          title={`Outbound lead-gen for ${provider.getCompany().name}`}
          lede="A click-through of how the workflow finds, qualifies, personalizes, and reaches out to local leads — end to end."
          renderStage={renderStage}
        />
      </SendLifecycleProvider>
    </DemoProvider>
  );
};

export default DemoPage;

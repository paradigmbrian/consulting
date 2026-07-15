import type { ReactNode } from "react";
import { DemoProvider } from "../shared/DemoController";
import { SendLifecycleProvider } from "../shared/SendLifecycleProvider";
import DemoShell from "../shared/DemoShell";
import { workflowPath } from "../../data/workflows";
import { steps } from "./steps";
import { scriptedWorkflowProvider } from "./provider";
import RequestStep from "./steps/RequestStep";
import UnderstandStep from "./steps/UnderstandStep";
import BuildStep from "./steps/BuildStep";
import ReviewStep from "./steps/ReviewStep";
import SendStep from "./steps/SendStep";
import ResultsStep from "./steps/ResultsStep";
import "./quoting.css";

const provider = scriptedWorkflowProvider;

function renderStage(stepId: string): ReactNode {
  switch (stepId) {
    case "request":
      return <RequestStep provider={provider} />;
    case "understand":
      return <UnderstandStep provider={provider} />;
    case "build":
      return <BuildStep provider={provider} />;
    case "review":
      return <ReviewStep provider={provider} />;
    case "send":
      return <SendStep provider={provider} />;
    case "results":
      return <ResultsStep provider={provider} />;
    default:
      return null;
  }
}

const AutomatedQuotingDemo = () => {
  const business = provider.getBusiness();
  return (
    <DemoProvider steps={steps}>
      <SendLifecycleProvider>
        <DemoShell
          eyebrow="Paradigm Shift — Automation Demo"
          title={`Automated quoting for ${business.name}`}
          lede="A click-through of how a messy request becomes an itemized, ready-to-send quote — with you still in control of the send."
          backTo={workflowPath("automated-quoting")}
          renderStage={renderStage}
        />
      </SendLifecycleProvider>
    </DemoProvider>
  );
};

export default AutomatedQuotingDemo;

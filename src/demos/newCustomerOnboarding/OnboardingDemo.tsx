import type { ReactNode } from "react";
import { DemoProvider } from "../shared/DemoController";
import { SendLifecycleProvider } from "../shared/SendLifecycleProvider";
import DemoShell from "../shared/DemoShell";
import { workflowPath } from "../../data/workflows";
import { steps } from "./steps";
import { scriptedWorkflowProvider } from "./provider";
import SignupStep from "./steps/SignupStep";
import ComposeStep from "./steps/ComposeStep";
import PacketStep from "./steps/PacketStep";
import DeliverStep from "./steps/DeliverStep";
import ScheduleStep from "./steps/ScheduleStep";
import ResultsStep from "./steps/ResultsStep";
import "./onboarding.css";

const provider = scriptedWorkflowProvider;

function renderStage(stepId: string): ReactNode {
  switch (stepId) {
    case "signup":
      return <SignupStep provider={provider} />;
    case "compose":
      return <ComposeStep provider={provider} />;
    case "packet":
      return <PacketStep provider={provider} />;
    case "deliver":
      return <DeliverStep provider={provider} />;
    case "schedule":
      return <ScheduleStep provider={provider} />;
    case "results":
      return <ResultsStep provider={provider} />;
    default:
      return null;
  }
}

const OnboardingDemo = () => {
  const business = provider.getBusiness();
  return (
    <DemoProvider steps={steps}>
      <SendLifecycleProvider>
        <DemoShell
          eyebrow="Paradigm Shift — Automation Demo"
          title={`New-customer onboarding for ${business.name}`}
          lede="A click-through of how a bare booking becomes a welcomed customer — a personal welcome written, the right paperwork assembled, and the first visit booked, all on its own."
          backTo={workflowPath("new-customer-onboarding")}
          renderStage={renderStage}
        />
      </SendLifecycleProvider>
    </DemoProvider>
  );
};

export default OnboardingDemo;

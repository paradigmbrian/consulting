import type { ReactNode } from "react";
import { DemoProvider } from "../shared/DemoController";
import { SendLifecycleProvider } from "../shared/SendLifecycleProvider";
import DemoShell from "../shared/DemoShell";
import { workflowPath } from "../../data/workflows";
import { steps } from "./steps";
import { scriptedWorkflowProvider } from "./provider";
import AppointmentStep from "./steps/AppointmentStep";
import RequestStep from "./steps/RequestStep";
import RouteStep from "./steps/RouteStep";
import GoogleStep from "./steps/GoogleStep";
import CaughtStep from "./steps/CaughtStep";
import ResultsStep from "./steps/ResultsStep";
import "./reviews.css";

const provider = scriptedWorkflowProvider;

function renderStage(stepId: string): ReactNode {
  switch (stepId) {
    case "appointment":
      return <AppointmentStep provider={provider} />;
    case "request":
      return <RequestStep provider={provider} />;
    case "route":
      return <RouteStep provider={provider} />;
    case "google":
      return <GoogleStep provider={provider} />;
    case "caught":
      return <CaughtStep provider={provider} />;
    case "results":
      return <ResultsStep provider={provider} />;
    default:
      return null;
  }
}

const ReviewGenerationDemo = () => {
  const business = provider.getBusiness();
  return (
    <DemoProvider steps={steps}>
      <SendLifecycleProvider>
        <DemoShell
          eyebrow="Paradigm Shift — Automation Demo"
          title={`Review generation for ${business.name}`}
          lede="A click-through of how every happy client becomes a 5-star review — and every unhappy one gets caught before it goes public."
          backTo={workflowPath("review-generation")}
          renderStage={renderStage}
        />
      </SendLifecycleProvider>
    </DemoProvider>
  );
};

export default ReviewGenerationDemo;

import type { ReactNode } from "react";
import { DemoProvider } from "../shared/DemoController";
import { SendLifecycleProvider } from "../shared/SendLifecycleProvider";
import DemoShell from "../shared/DemoShell";
import { workflowPath } from "../../data/workflows";
import { steps } from "./steps";
import { scriptedWorkflowProvider } from "./provider";
import QueueStep from "./steps/QueueStep";
import AssignStep from "./steps/AssignStep";
import RouteStep from "./steps/RouteStep";
import DispatchStep from "./steps/DispatchStep";
import NotifyStep from "./steps/NotifyStep";
import ResultsStep from "./steps/ResultsStep";
import "./dispatch.css";

const provider = scriptedWorkflowProvider;

function renderStage(stepId: string): ReactNode {
  switch (stepId) {
    case "queue":
      return <QueueStep provider={provider} />;
    case "assign":
      return <AssignStep provider={provider} />;
    case "route":
      return <RouteStep provider={provider} />;
    case "dispatch":
      return <DispatchStep provider={provider} />;
    case "notify":
      return <NotifyStep provider={provider} />;
    case "results":
      return <ResultsStep provider={provider} />;
    default:
      return null;
  }
}

const JobDispatchDemo = () => {
  const business = provider.getBusiness();
  return (
    <DemoProvider steps={steps}>
      <SendLifecycleProvider>
        <DemoShell
          eyebrow="Paradigm Shift — Automation Demo"
          title={`Job scheduling & dispatch for ${business.name}`}
          lede="A click-through of how a messy morning pile becomes an optimized dispatch board — every job matched to the right tech, every van routed to cut the drive, and every customer texted an ETA."
          backTo={workflowPath("job-dispatch")}
          renderStage={renderStage}
        />
      </SendLifecycleProvider>
    </DemoProvider>
  );
};

export default JobDispatchDemo;

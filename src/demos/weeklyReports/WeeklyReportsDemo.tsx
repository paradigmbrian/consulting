import type { ReactNode } from "react";
import { DemoProvider } from "../shared/DemoController";
import { SendLifecycleProvider } from "../shared/SendLifecycleProvider";
import DemoShell from "../shared/DemoShell";
import { steps } from "./steps";
import { scriptedWorkflowProvider } from "./provider";
import DataStep from "./steps/DataStep";
import AnalyzeStep from "./steps/AnalyzeStep";
import WriteStep from "./steps/WriteStep";
import DeliverStep from "./steps/DeliverStep";
import ActStep from "./steps/ActStep";
import ResultsStep from "./steps/ResultsStep";
import "./reports.css";

const provider = scriptedWorkflowProvider;

function renderStage(stepId: string): ReactNode {
  switch (stepId) {
    case "data":
      return <DataStep provider={provider} />;
    case "analyze":
      return <AnalyzeStep provider={provider} />;
    case "write":
      return <WriteStep provider={provider} />;
    case "deliver":
      return <DeliverStep provider={provider} />;
    case "act":
      return <ActStep provider={provider} />;
    case "results":
      return <ResultsStep provider={provider} />;
    default:
      return null;
  }
}

const WeeklyReportsDemo = () => {
  const business = provider.getBusiness();
  return (
    <DemoProvider steps={steps}>
      <SendLifecycleProvider>
        <DemoShell
          eyebrow="Paradigm Shift — Automation Demo"
          title={`Weekly owner reports for ${business.name}`}
          lede="A click-through of how a week scattered across five tools becomes a 30-second digest — with one action the owner takes on the spot."
          renderStage={renderStage}
        />
      </SendLifecycleProvider>
    </DemoProvider>
  );
};

export default WeeklyReportsDemo;

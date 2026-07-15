import type { ReactNode } from "react";
import { DemoProvider } from "../shared/DemoController";
import { SendLifecycleProvider } from "../shared/SendLifecycleProvider";
import DemoShell from "../shared/DemoShell";
import { workflowPath } from "../../data/workflows";
import { steps } from "./steps";
import { scriptedWorkflowProvider } from "./provider";
import OverdueStep from "./steps/OverdueStep";
import PlanStep from "./steps/PlanStep";
import DraftStep from "./steps/DraftStep";
import SendStep from "./steps/SendStep";
import PaidStep from "./steps/PaidStep";
import ResultsStep from "./steps/ResultsStep";
import "./invoices.css";

const provider = scriptedWorkflowProvider;

function renderStage(stepId: string): ReactNode {
  switch (stepId) {
    case "overdue":
      return <OverdueStep provider={provider} />;
    case "plan":
      return <PlanStep provider={provider} />;
    case "draft":
      return <DraftStep provider={provider} />;
    case "send":
      return <SendStep provider={provider} />;
    case "paid":
      return <PaidStep provider={provider} />;
    case "results":
      return <ResultsStep provider={provider} />;
    default:
      return null;
  }
}

const InvoiceRemindersDemo = () => {
  const business = provider.getBusiness();
  return (
    <DemoProvider steps={steps}>
      <SendLifecycleProvider>
        <DemoShell
          eyebrow="Paradigm Shift — Automation Demo"
          title={`Invoice & payment reminders for ${business.name}`}
          lede="A click-through of how every invoice follows itself up — in the right tone, at the right time — so you get paid without chasing."
          backTo={workflowPath("invoice-reminders")}
          renderStage={renderStage}
        />
      </SendLifecycleProvider>
    </DemoProvider>
  );
};

export default InvoiceRemindersDemo;

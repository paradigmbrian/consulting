import { FaCalendarAlt } from "react-icons/fa";
import { DemoProvider, useDemo } from "./DemoController";
import { scriptedWorkflowProvider } from "./ScriptedWorkflowProvider";
import { STEP_META } from "./stepMeta";
import FlowMap from "./FlowMap";
import DefineTargetStep from "./steps/DefineTargetStep";
import DiscoverStep from "./steps/DiscoverStep";
import EnrichQualifyStep from "./steps/EnrichQualifyStep";
import PersonalizeStep from "./steps/PersonalizeStep";
import SendStep from "./steps/SendStep";
import ResultsStep from "./steps/ResultsStep";
import "./DemoPage.css";

const provider = scriptedWorkflowProvider;

const CALENDLY_URL = "https://calendly.com/brian-paradigmshiftdev/30min";

function StageHeader() {
  const { stepId, stepIndex } = useDemo();
  const { label, Icon } = STEP_META[stepId];
  return (
    <div className="demo-stage-header">
      <span className="demo-stage-badge">
        <Icon />
      </span>
      <h2 className="demo-stage-title">{label}</h2>
      <span className="demo-stage-count">Step {stepIndex + 1} of 6</span>
    </div>
  );
}

function StepBody() {
  const { stepId } = useDemo();
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

function DemoNav() {
  const { back, next, reset, canBack, canNext } = useDemo();
  return (
    <div className="demo-nav">
      <button
        className="demo-btn demo-btn-ghost"
        onClick={back}
        disabled={!canBack}
      >
        ← Back
      </button>
      <button className="demo-btn demo-btn-ghost" onClick={reset}>
        Restart demo
      </button>
      <button
        className="demo-btn demo-btn-primary"
        onClick={next}
        disabled={!canNext}
      >
        Next →
      </button>
    </div>
  );
}

function DemoShell() {
  const company = provider.getCompany();
  return (
    <main className="demo">
      <div className="container">
        <header className="demo-header">
          <p className="demo-eyebrow">Paradigm Shift — Workflow Demo</p>
          <h1 className="demo-title">Outbound lead-gen for {company.name}</h1>
          <p className="demo-lede">
            A click-through of how the workflow finds, qualifies, personalizes,
            and reaches out to local leads — end to end.
          </p>
          <a
            href={CALENDLY_URL}
            className="demo-cta"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaCalendarAlt className="demo-cta-icon" />
            Book a 30-minute call
          </a>
        </header>

        <FlowMap />

        <section className="demo-stage">
          <StageHeader />
          <StepBody />
        </section>

        <DemoNav />
      </div>
    </main>
  );
}

const DemoPage = () => {
  return (
    <DemoProvider>
      <DemoShell />
    </DemoProvider>
  );
};

export default DemoPage;

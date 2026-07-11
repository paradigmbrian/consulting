import { FaCalendarAlt } from "react-icons/fa";
import type { ReactNode } from "react";
import { useDemo } from "./DemoController";
import FlowMap from "./FlowMap";
import "./DemoShell.css";

const CALENDLY_URL = "https://calendly.com/brian-paradigmshiftdev/30min";

interface DemoShellProps {
  eyebrow: string;
  title: string;
  lede: string;
  renderStage: (stepId: string) => ReactNode;
}

function StageHeader() {
  const { steps, stepIndex } = useDemo();
  const step = steps[stepIndex];
  const Icon = step.Icon;
  return (
    <div className="demo-stage-header">
      <span className="demo-stage-badge">
        <Icon />
      </span>
      <h2 className="demo-stage-title">{step.label}</h2>
      <span className="demo-stage-count">
        Step {stepIndex + 1} of {steps.length}
      </span>
    </div>
  );
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

const DemoShell = ({ eyebrow, title, lede, renderStage }: DemoShellProps) => {
  const { stepId } = useDemo();
  return (
    <main className="demo">
      <div className="container">
        <header className="demo-header">
          <p className="demo-eyebrow">{eyebrow}</p>
          <h1 className="demo-title">{title}</h1>
          <p className="demo-lede">{lede}</p>
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
          {renderStage(stepId)}
        </section>

        <DemoNav />
      </div>
    </main>
  );
};

export default DemoShell;

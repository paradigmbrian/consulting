import { FaCalendarAlt, FaMagic } from "react-icons/fa";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useDemo } from "./DemoController";
import FlowMap from "./FlowMap";
import { CALENDLY_URL } from "../../data/site";
import "./DemoShell.css";

interface DemoShellProps {
  eyebrow: string;
  title: string;
  lede: string;
  backTo?: string;
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

const DemoShell = ({ eyebrow, title, backTo, renderStage }: DemoShellProps) => {
  const { stepId, steps, stepIndex } = useDemo();
  return (
    <main className="demo">
      <header className="demo-topbar">
        {backTo && (
          <Link to={backTo} className="demo-back">
            ← Exit demo
          </Link>
        )}
        <div className="demo-topbar-heading">
          <p className="demo-eyebrow">{eyebrow}</p>
          <h1 className="demo-title">{title}</h1>
        </div>
        <span className="demo-stage-count">
          Step {stepIndex + 1} of {steps.length}
        </span>
        <div className="demo-topbar-actions">
          <span className="demo-ai-chip">
            <FaMagic aria-hidden="true" /> Powered by Claude
          </span>
          <a
            href={CALENDLY_URL}
            className="demo-cta"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaCalendarAlt className="demo-cta-icon" />
            Book a call
          </a>
        </div>
      </header>

      <div className="demo-body">
        <FlowMap />
        <section className="demo-content">
          <StageHeader />
          <div className="demo-stage">{renderStage(stepId)}</div>
        </section>
      </div>

      <footer className="demo-footer">
        <DemoNav />
      </footer>
    </main>
  );
};

export default DemoShell;

import { FaCalendarAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { CALENDLY_URL } from "../data/site";
import { workflows, workflowPath } from "../data/workflows";
import HeroMontage from "../showcases/HeroMontage";
import AwHowItWorks from "./workflows/AwHowItWorks";
import AwWhyWorkWithMe from "./workflows/AwWhyWorkWithMe";
import AwFinalCta from "./workflows/AwFinalCta";
import "./shared-sections.css";
import "./AutomatedWorkflows.css";

const automatableWork: string[] = [
  "Chasing leads and following up",
  "Booking, reminders, and no-shows",
  "Quotes, invoices, and getting paid",
  "Reviews and reputation",
  "Moving data between the tools you already use",
  "Knowing what's actually working",
];

const AutomatedWorkflows = () => {
  return (
    <>
      <section className="aw-hero">
        <div className="container">
          <div className="wf-hero-split">
            <div className="wf-hero-copy">
              <p className="wf-eyebrow">AI Services for Small Business</p>
              <h1 className="aw-hero-title">
                Put AI to work on the busywork your business runs on
              </h1>
              <p className="aw-hero-subtitle">
                I build AI-powered automations that answer missed calls, chase
                invoices, ask for reviews, and turn messy requests into quotes —
                around the tools you already use, not a template you have to bend
                to fit. Backed by 10+ years as a professional software engineer.
              </p>
              <div className="wf-hero-actions">
                <a
                  href={CALENDLY_URL}
                  className="aw-hero-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaCalendarAlt className="aw-hero-btn-icon" />
                  Book a free automation consult →
                </a>
                <Link to="/#use-cases" className="aw-hero-btn aw-hero-btn-ghost">
                  See it work →
                </Link>
              </div>
            </div>
            <div className="wf-hero-visual">
              <HeroMontage />
            </div>
          </div>
        </div>
      </section>

      <section className="aw-trust">
        <div className="container">
          <ul className="aw-trust-list">
            <li>10+ years as a professional software engineer</li>
            <li>Real AI, not brittle no-code that breaks</li>
            <li>Built on the tools you already use</li>
            <li>Fixed scope, agreed up front — no surprise bills</li>
          </ul>
        </div>
      </section>

      <section className="aw-framing">
        <div className="container">
          <div className="section-content">
            <p className="wf-eyebrow">Where it fits</p>
            <h2 className="section-title">
              If your team does it the same way every time, it can probably be
              automated
            </h2>
            <p className="section-intro aw-framing-intro">
              The work that quietly eats your week is usually a candidate:
            </p>
            <ul className="aw-framing-list">
              {automatableWork.map((item) => (
                <li key={item} className="aw-framing-item">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="aw-examples" id="use-cases">
        <div className="container">
          <div className="section-content">
            <p className="wf-eyebrow">Use cases</p>
            <h2 className="section-title">
              A few examples of what that looks like in practice
            </h2>
            <p className="section-intro aw-examples-intro">
              Not a fixed menu — if it's repetitive, it's probably a candidate.
            </p>
            <div className="aw-examples-grid">
              {workflows.map((workflow) => {
                const Icon = workflow.icon;
                const inner = (
                  <>
                    <div className="aw-example-icon">
                      <Icon />
                    </div>
                    <h3 className="aw-example-title">{workflow.label}</h3>
                    <p className="aw-example-description">{workflow.cardSummary}</p>
                  </>
                );
                return workflow.published ? (
                  <Link
                    key={workflow.slug}
                    to={workflowPath(workflow.slug)}
                    className="aw-example-card aw-example-card-link"
                  >
                    {inner}
                  </Link>
                ) : (
                  <div key={workflow.slug} className="aw-example-card">
                    {inner}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <div id="how-it-works">
        <AwHowItWorks title="How it works" />
      </div>
      <AwWhyWorkWithMe />
      <AwFinalCta />
    </>
  );
};

export default AutomatedWorkflows;

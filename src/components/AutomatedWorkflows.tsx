import {
  FaCalendarAlt,
  FaUndo,
  FaCommentDots,
  FaStar,
  FaFileInvoiceDollar,
  FaMoneyBillWave,
  FaUserPlus,
  FaTruck,
  FaChartLine,
  FaSyncAlt,
  FaPhone,
  FaCogs,
  FaRocket,
} from "react-icons/fa";
import type { IconType } from "react-icons";
import { Link } from "react-router-dom";
import "./AutomatedWorkflows.css";

const CALENDLY_URL = "https://calendly.com/brian-paradigmshiftdev/30min";

const automatableWork: string[] = [
  "Chasing leads and following up",
  "Booking, reminders, and no-shows",
  "Quotes, invoices, and getting paid",
  "Reviews and reputation",
  "Moving data between the tools you already use",
  "Knowing what's actually working",
];

interface Example {
  icon: IconType;
  title: string;
  description: string;
  to?: string;
}

const examples: Example[] = [
  {
    icon: FaUndo,
    title: "Win-Back Campaigns",
    description: "Re-engage past customers automatically",
    to: "/demos/win-back-campaign",
  },
  {
    icon: FaCommentDots,
    title: "Missed-Call Text-Back",
    description: "Instant reply so leads don't call a competitor",
  },
  {
    icon: FaStar,
    title: "Review Generation",
    description: "A steady stream of 5-star reviews, hands-off",
  },
  {
    icon: FaFileInvoiceDollar,
    title: "Automated Quoting",
    description: "From intake to a ready-to-send quote",
  },
  {
    icon: FaMoneyBillWave,
    title: "Invoice & Payment Reminders",
    description: "Get paid without chasing",
  },
  {
    icon: FaUserPlus,
    title: "New-Customer Onboarding",
    description: "Welcome, docs, and scheduling handled",
  },
  {
    icon: FaTruck,
    title: "Job Scheduling & Dispatch",
    description: "Right job, right person, customer notified",
  },
  {
    icon: FaChartLine,
    title: "Weekly Owner Reports",
    description: "The numbers that matter, in your inbox",
  },
  {
    icon: FaSyncAlt,
    title: "Tool-to-Tool Sync",
    description: "Stop retyping the same data twice",
  },
];

interface Step {
  icon: IconType;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    icon: FaPhone,
    title: "Discovery call (free)",
    description:
      "We map where your time and money are leaking to repetitive work, and find the highest-ROI place to start.",
  },
  {
    icon: FaCogs,
    title: "Build",
    description:
      "I design and build the automation around your existing tools. Fixed scope, agreed up front.",
  },
  {
    icon: FaRocket,
    title: "Handoff or hands-off",
    description:
      "You own and run it, or I maintain and improve it over time. Your call.",
  },
];

const reasons: string[] = [
  "10+ years as a professional software engineer",
  "Real, robust engineering — not brittle no-code that breaks",
  "Built on the tools you already use",
  "Fixed scope, agreed up front — no surprise bills",
];

const AutomatedWorkflows = () => {
  return (
    <>
      <section className="aw-hero">
        <div className="container">
          <div className="aw-hero-content">
            <h1 className="aw-hero-title">
              Custom automation for the way your business actually works
            </h1>
            <p className="aw-hero-subtitle">
              I'm a software engineer with 10+ years of experience. I build
              systems that take the repetitive, revenue-losing busywork off your
              plate — designed around how your business runs, not a template you
              have to bend to fit.
            </p>
            <a
              href={CALENDLY_URL}
              className="aw-hero-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaCalendarAlt className="aw-hero-btn-icon" />
              Book a free automation consult →
            </a>
          </div>
        </div>
      </section>

      <section className="aw-framing">
        <div className="container">
          <div className="section-content">
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

      <section className="aw-examples">
        <div className="container">
          <div className="section-content">
            <h2 className="section-title">
              A few examples of what that looks like in practice
            </h2>
            <p className="section-intro aw-examples-intro">
              Not a fixed menu — if it's repetitive, it's probably a candidate.
            </p>
            <div className="aw-examples-grid">
              {examples.map((example) => {
                const Icon = example.icon;
                const inner = (
                  <>
                    <div className="aw-example-icon">
                      <Icon />
                    </div>
                    <h3 className="aw-example-title">{example.title}</h3>
                    <p className="aw-example-description">
                      {example.description}
                    </p>
                  </>
                );
                return example.to ? (
                  <Link
                    key={example.title}
                    to={example.to}
                    className="aw-example-card aw-example-card-link"
                  >
                    {inner}
                  </Link>
                ) : (
                  <div key={example.title} className="aw-example-card">
                    {inner}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="aw-how">
        <div className="container">
          <div className="section-content">
            <h2 className="section-title">How It Works</h2>
            <div className="aw-steps">
              {steps.map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.title} className="aw-step">
                    <div className="aw-step-number">
                      <Icon className="aw-step-icon" />
                    </div>
                    <div className="aw-step-content">
                      <h3>{step.title}</h3>
                      <p>{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="aw-why">
        <div className="container">
          <div className="section-content">
            <h2 className="section-title">Why work with me</h2>
            <ul className="aw-why-list">
              {reasons.map((reason) => (
                <li key={reason} className="aw-why-item">
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="aw-cta">
        <div className="container">
          <div className="aw-cta-content">
            <h2 className="aw-cta-title">
              Curious what's automatable in your business?
            </h2>
            <a
              href={CALENDLY_URL}
              className="aw-cta-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaCalendarAlt className="aw-cta-btn-icon" />
              Book a free automation consult →
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default AutomatedWorkflows;

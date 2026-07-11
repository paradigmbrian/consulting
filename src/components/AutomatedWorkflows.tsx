import { FaCalendarAlt } from "react-icons/fa";
import { HiCog } from "react-icons/hi";
import "./AutomatedWorkflows.css";

const AutomatedWorkflows = () => {
  return (
    <section className="workflows-placeholder">
      <div className="container">
        <div className="workflows-placeholder-content">
          <div className="workflows-placeholder-icon">
            <HiCog />
          </div>
          <p className="workflows-placeholder-brand">
            Paradigm Shift — Automated Workflows
          </p>
          <h1 className="workflows-placeholder-title">Automated Workflows</h1>
          <p className="workflows-placeholder-subtitle">
            We design and build automation that removes manual, repetitive work
            from your business. Detailed service page coming soon.
          </p>
          <a
            href="https://calendly.com/brian-paradigmshiftdev/30min"
            className="workflows-placeholder-btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaCalendarAlt className="workflows-placeholder-btn-icon" />
            Book a call to learn more →
          </a>
        </div>
      </div>
    </section>
  );
};

export default AutomatedWorkflows;

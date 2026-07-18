import { FaCalendarAlt, FaPlay } from "react-icons/fa";
import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { CALENDLY_URL } from "../../data/site";
import { workflowDemoPath, type Stat } from "../../data/workflows";

interface WorkflowHeroProps {
  eyebrow?: string;
  headline: string;
  subhead: string;
  slug: string;
  hasDemo: boolean;
  stats: Stat[];
  heroVisual?: ReactNode;
}

const WorkflowHero = ({
  eyebrow,
  headline,
  subhead,
  slug,
  hasDemo,
  stats,
  heroVisual,
}: WorkflowHeroProps) => {
  const copy = (
    <div className="wf-hero-copy">
      {eyebrow && <p className="wf-eyebrow">{eyebrow}</p>}
      <h1 className="wf-hero-title">{headline}</h1>
      <p className="wf-hero-subtitle">{subhead}</p>
      <div className="wf-hero-actions">
        <a
          href={CALENDLY_URL}
          className="wf-hero-btn"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaCalendarAlt className="wf-hero-btn-icon" />
          Book a free automation consult →
        </a>
        {hasDemo && (
          <Link
            to={workflowDemoPath(slug)}
            className="wf-hero-btn wf-hero-btn-secondary"
          >
            <FaPlay className="wf-hero-btn-icon" />
            Try the demo →
          </Link>
        )}
      </div>
      {stats.length > 0 && (
        <div className="wf-hero-stats">
          <p className="wf-hero-stats-label">
            What it costs to leave this manual
          </p>
          <div className="wf-hero-stats-row">
            {stats.map((stat) => (
              <a
                key={stat.label}
                href={stat.sourceUrl}
                className="wf-hero-stat"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="wf-hero-stat-value">{stat.value}</span>
                <span className="wf-hero-stat-label">{stat.label}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <section className="wf-hero">
      <div className="container">
        {heroVisual ? (
          <div className="wf-hero-split">
            {copy}
            <div className="wf-hero-visual">{heroVisual}</div>
          </div>
        ) : (
          <div className="wf-hero-content">{copy}</div>
        )}
      </div>
    </section>
  );
};

export default WorkflowHero;

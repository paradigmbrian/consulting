import { FaCalendarAlt } from "react-icons/fa";
import { CALENDLY_URL } from "../../data/site";

interface WorkflowHeroProps {
  headline: string;
  subhead: string;
}

const WorkflowHero = ({ headline, subhead }: WorkflowHeroProps) => {
  return (
    <section className="wf-hero">
      <div className="container">
        <div className="wf-hero-content">
          <h1 className="wf-hero-title">{headline}</h1>
          <p className="wf-hero-subtitle">{subhead}</p>
          <a
            href={CALENDLY_URL}
            className="wf-hero-btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaCalendarAlt className="wf-hero-btn-icon" />
            Book a free automation consult →
          </a>
        </div>
      </div>
    </section>
  );
};

export default WorkflowHero;

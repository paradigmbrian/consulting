import { FaCalendarAlt } from "react-icons/fa";
import { CALENDLY_URL } from "../../data/site";
import "./AwFinalCta.css";

const AwFinalCta = () => {
  return (
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
  );
};

export default AwFinalCta;

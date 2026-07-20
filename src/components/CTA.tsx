import { FaCalendarAlt } from "react-icons/fa";
import { CALENDLY_URL } from "../data/site";
import "./CTA.css";

interface CTAProps {
  subtitle?: string;
  description?: string;
  buttonText?: string;
}

const CTA = ({
  subtitle = "Book a founder call",
  description = "We'll help you figure out whether one of these engagements is a good fit — no pressure, no pitching.",
  buttonText = "Book a founder call →",
}: CTAProps) => {
  return (
    <section className="cta">
      <div className="container">
        <div className="cta-content">
          <div className="cta-icon">
            <FaCalendarAlt />
          </div>
          <h2 className="cta-title">Next step</h2>
          <h3 className="cta-subtitle">{subtitle}</h3>
          <p className="cta-description">{description}</p>
          <div className="cta-button">
            <a
              href={CALENDLY_URL}
              className="btn btn-primary btn-large"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaCalendarAlt className="btn-icon" />
              {buttonText}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;

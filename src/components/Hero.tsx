import { HiLightBulb } from "react-icons/hi";
import { FaCalendarAlt } from "react-icons/fa";
import "./Hero.css";

const Hero = () => {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <div className="hero-icon">
            <HiLightBulb />
          </div>
          <p className="hero-brand">
            Paradigm Shift — Early-Stage Tech Consulting
          </p>
          <h1 className="hero-title">
            Technical clarity for
            <br />
            non-technical founders
          </h1>
          <p className="hero-subtitle">
            Choose the right technical path — before costly mistakes are made
          </p>
          <div className="hero-cta-buttons">
            <a
              href="https://calendly.com/brian-paradigmshiftdev/30min"
              className="btn btn-primary btn-large"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaCalendarAlt className="btn-icon" />
              Book a 30-minute founder call →
            </a>
            <a href="#offer" className="btn btn-secondary">
              See what's included
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

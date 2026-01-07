import { HiLightBulb } from "react-icons/hi";
import { FaCalendarAlt } from "react-icons/fa";
import "./Hero.css";

const Hero = () => {
  const scrollToOffer = () => {
    const offerSection = document.getElementById("offer");
    if (offerSection) {
      offerSection.scrollIntoView({ behavior: "smooth" });
    }
  };

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
            Technical Clarity for
            <br />
            Non-Technical Founders
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
            <button className="btn btn-secondary" onClick={scrollToOffer}>
              See what's included
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

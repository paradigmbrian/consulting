import { Link } from "react-router-dom";
import { HiLightBulb } from "react-icons/hi";
import { FaCalendarAlt } from "react-icons/fa";
import { publishedServices, servicePath } from "../data/services";
import HeroMontage from "../showcases/HeroMontage";
import CTA from "./CTA";
import "./shared-sections.css";
import "./LandingPage.css";

const LandingPage = () => {
  return (
    <>
      <section className="landing-hero">
        <div className="container">
          <div className="wf-hero-split">
            <div className="wf-hero-copy">
              <p className="wf-eyebrow landing-hero-brand">
                <HiLightBulb className="landing-hero-brand-icon" />
                Paradigm Shift Software Development
              </p>
              <h1 className="landing-hero-title">
                Make the right technical calls — and automate the work that's
                eating your week
              </h1>
              <p className="landing-hero-subtitle">
                For founders making early product decisions and businesses
                buried in repetitive work — a software engineer who helps you
                move faster with less guesswork.
              </p>
              <div className="wf-hero-actions">
                <a
                  href="https://calendly.com/brian-paradigmshiftdev/30min"
                  className="landing-hero-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaCalendarAlt className="landing-hero-btn-icon" />
                  Book a 30-minute call →
                </a>
              </div>
            </div>
            <div className="wf-hero-visual">
              <HeroMontage />
            </div>
          </div>
        </div>
      </section>

      <section className="landing-services">
        <div className="container">
          <p className="wf-eyebrow">Services</p>
          <h2 className="section-title">What I do</h2>
          <div className="landing-services-grid">
            {publishedServices.map((service) => (
              <Link
                key={service.slug}
                to={servicePath(service.slug)}
                className="landing-service-card"
              >
                <h3 className="landing-service-card-title">{service.label}</h3>
                <p className="landing-service-card-summary">{service.summary}</p>
                <span className="landing-service-card-link">Learn more →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
};

export default LandingPage;

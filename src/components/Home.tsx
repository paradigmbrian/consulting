import { FaCalendarAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { CALENDLY_URL } from "../data/site";
import AwWhyWorkWithMe from "./workflows/AwWhyWorkWithMe";
import AwHowItWorks from "./workflows/AwHowItWorks";
import AwFinalCta from "./workflows/AwFinalCta";
import "./shared-sections.css";
import "./Home.css";

interface ServiceCard {
  eyebrow: string;
  name: string;
  line: string;
  to: string;
  accent: boolean;
}

const services: ServiceCard[] = [
  {
    eyebrow: "For small-business owners",
    name: "AI Automations",
    line: "Put AI to work on the busywork — missed calls, quotes, invoices, reviews — on the tools you already use.",
    to: "/services/automated-workflows",
    accent: true,
  },
  {
    eyebrow: "For startups & product teams",
    name: "AI Integration",
    line: "Embed AI into the product you already have — starting with a fixed-fee roadmap, not a rebuild.",
    to: "/services/ai-integration",
    accent: true,
  },
  {
    eyebrow: "For non-technical founders",
    name: "Technical Consulting",
    line: "Technical clarity before you build or hire — fixed-scope audits and MVP blueprints.",
    to: "/services/technical-consulting",
    accent: false,
  },
];

const Home = () => {
  return (
    <>
      <section className="home-hero">
        <div className="container">
          <div className="home-hero-content">
            <p className="wf-eyebrow">Senior software expertise</p>
            <h1 className="home-hero-title">
              Real engineering, three ways to put it to work
            </h1>
            <p className="home-hero-subtitle">
              AI automations, AI built into your product, and technical guidance
              for founders — backed by 10+ years shipping production
              software. Which are you?
            </p>
            <a
              href={CALENDLY_URL}
              className="home-hero-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaCalendarAlt className="home-hero-btn-icon" />
              Book a call →
            </a>
          </div>
        </div>
      </section>

      <section className="home-sorter">
        <div className="container">
          <div className="home-sorter-grid">
            {services.map((service) => (
              <Link
                key={service.to}
                to={service.to}
                className={
                  service.accent
                    ? "home-service-card home-service-card-accent"
                    : "home-service-card"
                }
              >
                <p className="home-service-for">{service.eyebrow}</p>
                <h2 className="home-service-name">{service.name}</h2>
                <p className="home-service-line">{service.line}</p>
                <span className="home-service-link">Explore →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <AwWhyWorkWithMe />
      <AwHowItWorks title="How we work" />
      <AwFinalCta />
    </>
  );
};

export default Home;

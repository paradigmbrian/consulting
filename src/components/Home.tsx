import { FaCalendarAlt } from "react-icons/fa";
import Link from "next/link";
import { CALENDLY_URL } from "../data/site";
import { publishedServices, servicePath } from "../data/services";
import AwWhyWorkWithMe from "./workflows/AwWhyWorkWithMe";
import AwHowItWorks from "./workflows/AwHowItWorks";
import AwFinalCta from "./workflows/AwFinalCta";
import "./shared-sections.css";
import "./Home.css";

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
            {publishedServices.map((service) => (
              <Link
                key={service.slug}
                href={servicePath(service.slug)}
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

import { Link } from "react-router-dom";
import { CALENDLY_URL } from "../data/site";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <nav className="footer-links">
            <Link to="/services/automated-workflows">Automations</Link>
            <Link to="/services/ai-integration">AI integration</Link>
            <Link to="/services/technical-consulting">
              Technical consulting
            </Link>
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
              Book a call
            </a>
          </nav>
          <p className="footer-text">
            © {new Date().getFullYear()} Paradigm Shift Software Development, LLC
          </p>
          <p className="footer-tagline">
            AI-powered automation, built on the tools you already use.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


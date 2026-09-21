import Link from "next/link";
import { HiLightBulb } from "react-icons/hi";
import { FaCalendarAlt } from "react-icons/fa";
import { CALENDLY_URL } from "../data/site";
import "./Header.css";

const Header = () => {
  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <Link href="/" className="site-header-brand">
          <HiLightBulb className="site-header-brand-icon" />
          <span className="site-header-brand-text">Paradigm Shift</span>
        </Link>
        <nav className="site-header-nav">
          <Link href="/services/automated-workflows" className="site-header-link">
            Automations
          </Link>
          <Link href="/services/ai-integration" className="site-header-link">
            AI Integration
          </Link>
          <Link href="/services/technical-consulting" className="site-header-link">
            Consulting
          </Link>
          <a
            href={CALENDLY_URL}
            className="site-header-cta"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaCalendarAlt className="site-header-cta-icon" />
            Book a call
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;

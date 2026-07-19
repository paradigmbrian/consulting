import { Link } from "react-router-dom";
import { HiLightBulb } from "react-icons/hi";
import { FaCalendarAlt } from "react-icons/fa";
import { CALENDLY_URL } from "../data/site";
import "./Header.css";

const Header = () => {
  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <Link to="/" className="site-header-brand">
          <HiLightBulb className="site-header-brand-icon" />
          <span className="site-header-brand-text">Paradigm Shift</span>
        </Link>
        <nav className="site-header-nav">
          <a href="/#use-cases" className="site-header-link">
            Use cases
          </a>
          <a href="/#how-it-works" className="site-header-link">
            How it works
          </a>
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

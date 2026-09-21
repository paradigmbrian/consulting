import Link from "next/link";
import "./shared-sections.css";
import "./Home.css";

const NotFound = () => {
  return (
    <section className="home-hero">
      <div className="container">
        <div className="home-hero-content">
          <p className="wf-eyebrow">404</p>
          <h1 className="home-hero-title">Page not found</h1>
          <p className="home-hero-subtitle">
            That page doesn't exist or has moved.
          </p>
          <Link href="/" className="home-hero-btn">
            Back to the home page →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NotFound;

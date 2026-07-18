import { FaRocket, FaShieldAlt, FaComments } from "react-icons/fa";
import "./WhyWorkWithMe.css";

const WhyWorkWithMe = () => {
  return (
    <section className="why-work-with-me">
      <div className="container">
        <div className="section-content">
          <h2 className="section-title">Why work with me</h2>
          <p className="why-intro">
            I help founders who don't want to make these decisions alone.
          </p>
          <p className="why-focus">
            My focus isn't writing code — it's explaining tradeoffs clearly so
            you can:
          </p>
          <ul className="why-benefits">
            <li>
              <FaRocket className="why-icon" />
              <span>Move faster with confidence</span>
            </li>
            <li>
              <FaShieldAlt className="why-icon" />
              <span>Avoid expensive rework</span>
            </li>
            <li>
              <FaComments className="why-icon" />
              <span>Speak credibly with developers and investors</span>
            </li>
          </ul>
          <p className="why-tagline">
            Think of this as CTO-level judgment without CTO-level commitment.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhyWorkWithMe;

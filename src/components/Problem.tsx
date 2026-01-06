import { FaQuestionCircle, FaMobileAlt, FaCode, FaRedo } from "react-icons/fa";
import { HiExclamationCircle } from "react-icons/hi";
import "./Problem.css";

const Problem = () => {
  return (
    <section className="problem">
      <div className="container">
        <div className="section-content">
          <h2 className="section-title">The Problem We Help You Solve</h2>
          <p className="problem-intro">
            At the idea stage, every technical choice feels risky
          </p>

          <div className="problem-content">
            <div className="problem-questions">
              <ul className="problem-list">
                <li>
                  <FaQuestionCircle className="problem-icon" />
                  <span>Which stack should we use?</span>
                </li>
                <li>
                  <FaMobileAlt className="problem-icon" />
                  <span>Do we need a mobile app yet?</span>
                </li>
                <li>
                  <FaCode className="problem-icon" />
                  <span>Should we hire a developer or use no-code?</span>
                </li>
                <li>
                  <FaRedo className="problem-icon" />
                  <span>
                    How do we avoid having to rebuild everything later?
                  </span>
                </li>
              </ul>
            </div>

            <div className="problem-consequences">
              <div className="consequences-box">
                <h3 className="consequences-title">Most founders either:</h3>
                <ul className="problem-consequence-list">
                  <li>
                    <HiExclamationCircle className="problem-warning-icon" />
                    <span>Overbuild too early</span>
                  </li>
                  <li>
                    <HiExclamationCircle className="problem-warning-icon" />
                    <span>Hire before they're ready</span>
                  </li>
                  <li>
                    <HiExclamationCircle className="problem-warning-icon" />
                    <span>
                      Choose tools they don't understand and can't change
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="problem-cost">
            <p>
              The cost isn't just money — it's lost time, momentum, and
              confidence.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Problem;

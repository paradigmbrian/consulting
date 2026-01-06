import { FaPhone, FaSearch, FaCheckCircle } from 'react-icons/fa'
import './HowItWorks.css'

const HowItWorks = () => {
  return (
    <section className="how-it-works">
      <div className="container">
        <div className="section-content">
          <h2 className="section-title">How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">
                <FaPhone className="step-icon" />
              </div>
              <div className="step-content">
                <h3>Founder Call</h3>
                <p>We talk through your idea, goals, and constraints</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">
                <FaSearch className="step-icon" />
              </div>
              <div className="step-content">
                <h3>Analysis & Recommendation</h3>
                <p>I evaluate options and tradeoffs</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">
                <FaCheckCircle className="step-icon" />
              </div>
              <div className="step-content">
                <h3>Delivery & Walkthrough</h3>
                <p>You receive the Blueprint and we walk through every decision together</p>
              </div>
            </div>
          </div>
          <p className="how-it-works-outcome">
            After this, you'll know exactly what to do next — and why.
          </p>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks


import { FaPhone, FaHandshake, FaRocket } from 'react-icons/fa'
import './HowItWorks.css'

const HowItWorks = () => {
  return (
    <section className="how-it-works">
      <div className="container">
        <div className="section-content">
          <h2 className="section-title">How it works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">
                <FaPhone className="step-icon" />
              </div>
              <div className="step-content">
                <h3>Founder call</h3>
                <p>I start with a 30-minute conversation to understand where you are, what you're building, and which engagement makes the most sense for your situation.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">
                <FaHandshake className="step-icon" />
              </div>
              <div className="step-content">
                <h3>Choose your path</h3>
                <p>Based on your stage and needs, I'll confirm the right engagement — whether that's the MVP Tech Blueprint, a Founder Tech Audit, or Fractional CTO support.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">
                <FaRocket className="step-icon" />
              </div>
              <div className="step-content">
                <h3>Get clarity & move forward</h3>
                <p>You'll get focused, actionable guidance tailored to your situation — no generic advice, no unnecessary complexity.</p>
              </div>
            </div>
          </div>
          <p className="how-it-works-outcome">
            Every engagement is designed to give you confidence in your next technical decisions — whether you need a one-time plan, an audit, or ongoing support.
          </p>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks


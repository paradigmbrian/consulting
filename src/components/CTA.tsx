import { FaCalendarAlt } from 'react-icons/fa'
import './CTA.css'

const CTA = () => {
  return (
    <section className="cta">
      <div className="container">
        <div className="cta-content">
          <div className="cta-icon">
            <FaCalendarAlt />
          </div>
          <h2 className="cta-title">Book a Founder Call</h2>
          <p className="cta-subtitle">
            If you're early, non-technical, and want to start the right way, let's talk.
          </p>
          <div className="cta-button">
            <a 
              href="https://calendly.com/brian-paradigmshiftdev/30min" 
              className="btn btn-primary btn-large"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaCalendarAlt className="btn-icon" />
              Book a 30-minute founder call →
            </a>
          </div>
          <p className="cta-note">
            (If we're not a fit, I'll tell you.)
          </p>
        </div>
      </div>
    </section>
  )
}

export default CTA



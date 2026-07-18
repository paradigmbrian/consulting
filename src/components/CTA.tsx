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
          <h2 className="cta-title">Next step</h2>
          <h3 className="cta-subtitle">Book a founder call</h3>
          <p className="cta-description">
            I'll help you figure out whether one of these engagements is a good fit — no pressure, no pitching.
          </p>
          <div className="cta-button">
            <a 
              href="https://calendly.com/brian-paradigmshiftdev/30min" 
              className="btn btn-primary btn-large"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaCalendarAlt className="btn-icon" />
              Book a founder call →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTA



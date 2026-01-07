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
          <h2 className="cta-title">Next Step</h2>
          <h3 className="cta-subtitle">Book a Founder Call</h3>
          <p className="cta-description">
            We'll determine whether one of these engagements is a good fit — no pressure, no pitching.
          </p>
          <div className="cta-button">
            <a 
              href="https://calendly.com/brian-paradigmshiftdev/30min" 
              className="btn btn-primary btn-large"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaCalendarAlt className="btn-icon" />
              Book a Founder Call →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTA



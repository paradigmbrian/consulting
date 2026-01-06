import { FaLayerGroup, FaFileAlt, FaBan, FaChartLine, FaUserTie } from 'react-icons/fa'
import { HiClock, HiCurrencyDollar } from 'react-icons/hi'
import './Offer.css'

const Offer = () => {
  return (
    <section className="offer">
      <div className="container">
        <div className="section-content">
          <h2 className="section-title">The MVP Tech Blueprint</h2>
          
          <p className="offer-description">
            A short, focused consulting engagement designed to give you clarity and confidence before development starts.
          </p>

          <div className="offer-whats-included">
            <h3>What You Get</h3>
            <ul>
              <li>
                <FaLayerGroup className="offer-icon" />
                <span>Clear technology stack recommendation (frontend, backend, infrastructure)</span>
              </li>
              <li>
                <FaFileAlt className="offer-icon" />
                <span>Plain-English explanation of tradeoffs and risks</span>
              </li>
              <li>
                <FaBan className="offer-icon" />
                <span>Guidance on what not to build yet</span>
              </li>
              <li>
                <FaChartLine className="offer-icon" />
                <span>Cost and scalability assumptions</span>
              </li>
              <li>
                <FaUserTie className="offer-icon" />
                <span>Hiring roadmap (who to hire first, and when)</span>
              </li>
            </ul>
          </div>

          <div className="offer-details">
            <div className="offer-detail-item">
              <HiClock className="offer-detail-icon" />
              <h3>Timeline</h3>
              <p>1–2 weeks</p>
            </div>
            <div className="offer-detail-item">
              <HiCurrencyDollar className="offer-detail-icon" />
              <h3>Price</h3>
              <p className="offer-price">$4,000</p>
              <p className="offer-price-note">(fixed scope)</p>
            </div>
          </div>

          <div className="offer-boundaries">
            <p>No hourly billing. No open-ended consulting. No surprise scope creep.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Offer


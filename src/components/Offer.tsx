import { FaLayerGroup, FaUserTie, FaClipboardCheck } from "react-icons/fa";
import { HiClock, HiCurrencyDollar } from "react-icons/hi";
import "./Offer.css";

const Offer = () => {
  return (
    <section id="offer" className="offer">
      <div className="container">
        <div className="section-content">
          <h2 className="section-title">Choose Your Path</h2>

          <div className="offer-grid">
            <div className="offer-item">
              <div className="offer-item-icon">
                <FaLayerGroup />
              </div>
              <h3 className="offer-item-title">MVP Tech Blueprint</h3>
              <p className="offer-item-subtitle">
                For founders before building or hiring
              </p>

              <div className="offer-item-details">
                <div className="offer-item-detail">
                  <HiCurrencyDollar className="offer-item-detail-icon" />
                  <span>$4,000 - $6000</span>
                </div>
                <div className="offer-item-detail">
                  <HiClock className="offer-item-detail-icon" />
                  <span>2–4 weeks</span>
                </div>
              </div>

              <div className="offer-item-section">
                <h4 className="offer-item-section-title">What it is</h4>
                <p className="offer-item-section-text">
                  A focused engagement that gives you a clear, opinionated
                  technical plan before you write code or hire engineers.
                </p>
              </div>

              <div className="offer-item-section">
                <h4 className="offer-item-section-title">Best if you:</h4>
                <ul className="offer-item-list">
                  <li>Have an idea but no production code</li>
                  <li>Are unsure which tech stack makes sense</li>
                  <li>Are about to hire your first engineer</li>
                  <li>Want confidence before spending real money</li>
                </ul>
              </div>

              <div className="offer-item-section">
                <h4 className="offer-item-section-title">Outcome</h4>
                <p className="offer-item-section-text">
                  You leave knowing exactly what to build first, what technology
                  to use and why, what tradeoffs you're accepting, and how to
                  move forward without guessing or rebuilding later.
                </p>
              </div>
            </div>

            <div className="offer-item">
              <div className="offer-item-icon">
                <FaClipboardCheck />
              </div>
              <h3 className="offer-item-title">Founder Tech Audit</h3>
              <p className="offer-item-subtitle">
                For founders with an existing MVP or codebase
              </p>

              <div className="offer-item-details">
                <div className="offer-item-detail">
                  <HiCurrencyDollar className="offer-item-detail-icon" />
                  <span>$2,500 - $3,500</span>
                </div>
                <div className="offer-item-detail">
                  <HiClock className="offer-item-detail-icon" />
                  <span>1 - 2 weeks</span>
                </div>
              </div>

              <div className="offer-item-section">
                <h4 className="offer-item-section-title">What it is</h4>
                <p className="offer-item-section-text">
                  A focused technical audit of your existing product to identify
                  risks, misalignments, and decision gaps before you invest
                  further.
                </p>
              </div>

              <div className="offer-item-section">
                <h4 className="offer-item-section-title">Best if you:</h4>
                <ul className="offer-item-list">
                  <li>Already have an MVP or live product</li>
                  <li>Suspect early technical decisions may be limiting you</li>
                  <li>
                    Are seeing performance, velocity, or maintainability issues
                  </li>
                  <li>Want a second opinion before scaling or fundraising</li>
                </ul>
              </div>

              <div className="offer-item-section">
                <h4 className="offer-item-section-title">Outcome</h4>
                <p className="offer-item-section-text">
                  You gain clarity on what's working, what's risky, what can
                  stay as-is, and what decisions need to be revisited — without
                  committing to a rebuild.
                </p>
              </div>
            </div>

            <div className="offer-item">
              <div className="offer-item-icon">
                <FaUserTie />
              </div>
              <h3 className="offer-item-title">Fractional CTO</h3>
              <p className="offer-item-subtitle">
                For founders who need ongoing technical support
              </p>

              <div className="offer-item-details">
                <div className="offer-item-detail">
                  <HiCurrencyDollar className="offer-item-detail-icon" />
                  <span>$3,000 / month</span>
                </div>
                <div className="offer-item-detail">
                  <span className="offer-item-availability">Limited</span>
                </div>
              </div>

              <div className="offer-item-section">
                <h4 className="offer-item-section-title">What it is</h4>
                <p className="offer-item-section-text">
                  Lightweight, high-level technical leadership to support
                  product, hiring, and architecture decisions — without bringing
                  on a full-time CTO.
                </p>
              </div>

              <div className="offer-item-section">
                <h4 className="offer-item-section-title">Best if you:</h4>
                <ul className="offer-item-list">
                  <li>Already have technical clarity</li>
                  <li>Are actively building or hiring</li>
                  <li>Need a trusted decision partner, not a builder</li>
                  <li>Want to avoid costly missteps as you scale</li>
                </ul>
              </div>

              <div className="offer-item-section">
                <h4 className="offer-item-section-title">Outcome</h4>
                <p className="offer-item-section-text">
                  You get consistent, experienced guidance so technical
                  decisions don't slow progress or create long-term problems.
                </p>
              </div>
            </div>
          </div>
          <div className="offer-fit-note">
            <p>
              Not sure which is right? Most founders start with the{" "}
              <strong>MVP Tech Blueprint</strong>. If you already have an MVP or
              are further along, we’ll quickly confirm the best fit on a founder
              call.
            </p>
          </div>
          <div className="offer-boundaries">
            <p>
              No hourly billing. No open-ended consulting. No surprise scope
              creep.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Offer;

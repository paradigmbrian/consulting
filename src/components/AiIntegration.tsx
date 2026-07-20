import {
  FaCalendarAlt,
  FaClipboardCheck,
  FaRocket,
  FaPhone,
  FaBolt,
} from "react-icons/fa";
import { HiClock, HiCurrencyDollar, HiLightBulb } from "react-icons/hi";
import { CALENDLY_URL } from "../data/site";
import CTA from "./CTA";
import "./AiIntegration.css";

const AiIntegration = () => {
  const scrollToOffer = () => {
    document.getElementById("ai-offer")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <section className="ai-hero">
        <div className="container">
          <div className="ai-hero-content">
            <div className="ai-hero-icon">
              <HiLightBulb />
            </div>
            <p className="wf-eyebrow">Paradigm Shift — AI Integration</p>
            <h1 className="ai-hero-title">
              AI, Built Into the Product
              <br />
              You Already Have
            </h1>
            <p className="ai-hero-subtitle">
              Start with a fixed-fee roadmap — not a rebuild.
            </p>
            <div className="ai-hero-cta">
              <a
                href={CALENDLY_URL}
                className="btn btn-primary btn-large"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaCalendarAlt className="btn-icon" />
                Book a 30-minute call →
              </a>
              <button className="btn btn-secondary" onClick={scrollToOffer}>
                See the engagements
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="ai-who">
        <div className="container">
          <div className="section-content">
            <h2 className="section-title">Who this is for</h2>
            <p className="ai-who-text">
              Funded startups and established businesses who know AI belongs in
              their product — but don't yet know what's actually worth building,
              or whether their systems and data can support it. You want a
              working capability inside the product you already have, not a
              standalone chatbot and not a full-time ML team to find out.
            </p>
          </div>
        </div>
      </section>

      <section id="ai-offer" className="offer">
        <div className="container">
          <div className="section-content">
            <h2 className="section-title">Two ways to start</h2>

            <div className="offer-grid ai-offer-grid">
              <div className="offer-item">
                <div className="offer-item-icon">
                  <FaClipboardCheck />
                </div>
                <h3 className="offer-item-title">AI Opportunity Audit</h3>
                <p className="offer-item-subtitle">
                  The fixed-fee starting point
                </p>

                <div className="offer-item-details">
                  <div className="offer-item-detail">
                    <HiCurrencyDollar className="offer-item-detail-icon" />
                    <span>$3,000</span>
                  </div>
                  <div className="offer-item-detail">
                    <HiClock className="offer-item-detail-icon" />
                    <span>8–12 hrs, fully async</span>
                  </div>
                </div>

                <div className="offer-item-section">
                  <h4 className="offer-item-section-title">What it is</h4>
                  <p className="offer-item-section-text">
                    A focused review of your product and data that tells you
                    where AI genuinely adds value — before you commit to a build.
                    You get a written report plus a 45-minute walkthrough call.
                  </p>
                </div>

                <div className="offer-item-section">
                  <h4 className="offer-item-section-title">You leave with</h4>
                  <ul className="offer-item-list">
                    <li>3–5 concrete AI opportunities, ranked by value vs. effort</li>
                    <li>A feasibility check against your current systems</li>
                    <li>A data-readiness assessment — what plumbing is missing</li>
                    <li>A recommended first build with rough scope and cost</li>
                  </ul>
                </div>

                <div className="offer-item-section">
                  <h4 className="offer-item-section-title">Outcome</h4>
                  <p className="offer-item-section-text">
                    You know exactly what to build first and why — and the
                    $3,000 fee credits toward the sprint if you move forward.
                  </p>
                </div>
              </div>

              <div className="offer-item">
                <div className="offer-item-icon">
                  <FaRocket />
                </div>
                <h3 className="offer-item-title">AI Integration Sprint</h3>
                <p className="offer-item-subtitle">
                  The build, scoped from your audit
                </p>

                <div className="offer-item-details">
                  <div className="offer-item-detail">
                    <HiCurrencyDollar className="offer-item-detail-icon" />
                    <span>$10,000 – $20,000</span>
                  </div>
                  <div className="offer-item-detail">
                    <HiClock className="offer-item-detail-icon" />
                    <span>2–4 weeks, fixed scope</span>
                  </div>
                </div>

                <div className="offer-item-section">
                  <h4 className="offer-item-section-title">What it is</h4>
                  <p className="offer-item-section-text">
                    One working, shipped AI capability inside your product — an
                    embedded assistant, an LLM-powered feature, or an internal
                    agent with real data context. Fixed scope, taken straight
                    from the top of your audit.
                  </p>
                </div>

                <div className="offer-item-section">
                  <h4 className="offer-item-section-title">Best if you:</h4>
                  <ul className="offer-item-list">
                    <li>Have a live product AI should live inside</li>
                    <li>Want a shipped capability, not a proof-of-concept</li>
                    <li>Prefer a fixed price over an open-ended build</li>
                    <li>Have completed (or will start with) the audit</li>
                  </ul>
                </div>

                <div className="offer-item-section">
                  <h4 className="offer-item-section-title">Data not ready?</h4>
                  <p className="offer-item-section-text">
                    If the audit shows your data isn't usable yet, the first
                    sprint becomes a Data-Ready-for-AI foundation — pipelines and
                    retrieval setup — so the capability sprint that follows has
                    solid ground to stand on.
                  </p>
                </div>
              </div>
            </div>

            <div className="ai-offer-note">
              <p>
                Not sure where you land? Most teams start with the{" "}
                <strong>AI Opportunity Audit</strong>. It's low-risk, valuable on
                its own, and tells us both whether a sprint makes sense.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <div className="container">
          <div className="section-content">
            <h2 className="section-title">How we'd work together</h2>
            <div className="steps">
              <div className="step">
                <div className="step-number">
                  <FaPhone className="step-icon" />
                </div>
                <div className="step-content">
                  <h3>Book a call</h3>
                  <p>
                    A 30-minute conversation to understand your product, your
                    data, and what you're hoping AI can do inside it.
                  </p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">
                  <FaClipboardCheck className="step-icon" />
                </div>
                <div className="step-content">
                  <h3>AI Opportunity Audit</h3>
                  <p>
                    A fixed-fee review that turns the hype into a ranked, feasible
                    roadmap — with a recommended first build and a real cost.
                  </p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">
                  <FaRocket className="step-icon" />
                </div>
                <div className="step-content">
                  <h3>AI Integration Sprint</h3>
                  <p>
                    In 2–4 weeks, the top opportunity ships as a working
                    capability inside your product. The audit fee credits over.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ai-proof">
        <div className="container">
          <div className="section-content">
            <h2 className="section-title">Why work with us</h2>
            <div className="ai-proof-card">
              <div className="ai-proof-icon">
                <FaBolt />
              </div>
              <p className="ai-proof-text">
                We build AI <em>into</em> existing products — not standalone bots.
                For an early-stage startup, we were handed the keys to an
                unfamiliar codebase and data model, learned it, and shipped a
                context-aware AI agent embedded in their live product in about
                two weeks. That's the whole offer: fast, scoped, and inside the
                thing you already have.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CTA
        subtitle="Book a call"
        description="We'll figure out whether an audit or a sprint fits your product — no pressure, no pitching."
        buttonText="Book a call →"
      />
    </>
  );
};

export default AiIntegration;

import {
  FaInbox,
  FaFileInvoiceDollar,
  FaUserCheck,
  FaPaperPlane,
  FaPen,
} from "react-icons/fa";
import "../demos/automatedQuoting/quoting.css";

/**
 * Static "product-shot" snippets for the automated-quoting detail page.
 * Reuses the demo's real `.qt-*` classes (styled by quoting.css, colored by
 * the enclosing .demo-scope) with fixed sample content — no provider, no
 * interactivity. One snippet per key.
 */

const Intake = () => (
  <div className="qt-intake">
    <div className="qt-intake-head">
      <FaInbox className="qt-intake-icon" />
      <div className="qt-intake-meta">
        <p className="qt-intake-name">Marcus Webb</p>
        <p className="qt-intake-channel">via Website form · Received 8:14 AM</p>
      </div>
    </div>
    <p className="qt-intake-body">
      "Need a quote for a water heater swap — ours is 14 years old and just
      started leaking from the bottom. 50-gallon, gas. Also curious what a
      tankless upgrade would run."
    </p>
  </div>
);

const Quote = () => (
  <div className="qt-quote">
    <div className="qt-quote-head">
      <FaFileInvoiceDollar className="qt-quote-icon" />
      <span className="qt-quote-title">Itemized estimate</span>
    </div>
    <ul className="qt-quote-lines">
      <li className="qt-quote-line">
        <div className="qt-quote-line-main">
          <span className="qt-quote-line-label">50-gal gas water heater</span>
          <span className="qt-quote-line-detail">
            Unit, venting, and code-required parts
          </span>
        </div>
        <span className="qt-quote-line-amount">$1,180</span>
      </li>
      <li className="qt-quote-line">
        <div className="qt-quote-line-main">
          <span className="qt-quote-line-label">Installation labor</span>
          <span className="qt-quote-line-detail">2 techs · approx. 3 hours</span>
        </div>
        <span className="qt-quote-line-amount">$360</span>
      </li>
      <li className="qt-quote-line">
        <div className="qt-quote-line-main">
          <span className="qt-quote-line-label">Old unit haul-away</span>
          <span className="qt-quote-line-detail">Disposal and permit filing</span>
        </div>
        <span className="qt-quote-line-amount">$85</span>
      </li>
    </ul>
    <div className="qt-quote-total">
      <span className="qt-quote-total-label">Total estimate</span>
      <span className="qt-quote-total-amount">$1,625</span>
    </div>
    <p className="qt-quote-validity">
      Valid for 14 days · pricing locked at approval
    </p>
  </div>
);

const Approve = () => (
  <div>
    <div className="qt-approve-banner">
      <FaUserCheck className="qt-approve-banner-icon" />
      <span>Quote ready — one line flagged for confirmation on site</span>
    </div>
    <div className="qt-approve-actions">
      <span className="qt-approve-btn qt-approve-btn-primary">
        <FaPaperPlane className="qt-approve-btn-icon" />
        Approve &amp; send
      </span>
      <span className="qt-approve-btn qt-approve-btn-ghost">
        <FaPen className="qt-approve-btn-icon" />
        Tweak a line
      </span>
    </div>
  </div>
);

const snippets: Record<string, JSX.Element> = {
  intake: <Intake />,
  quote: <Quote />,
  approve: <Approve />,
};

const AutomatedQuotingShowcase = ({ snippet }: { snippet: string }) =>
  snippets[snippet] ?? null;

export default AutomatedQuotingShowcase;

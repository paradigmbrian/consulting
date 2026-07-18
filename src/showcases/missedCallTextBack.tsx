import {
  FaPhoneSlash,
  FaBolt,
  FaPaperPlane,
  FaCheck,
  FaSms,
  FaCheckCircle,
  FaCalendarCheck,
  FaHardHat,
} from "react-icons/fa";
import "../demos/missedCallTextBack/missedcall.css";

/**
 * Static "product-shot" snippets for the missed-call-text-back detail page.
 * Reuses the demo's real `.mc-*` classes (styled by missedcall.css, colored
 * by the enclosing .demo-scope) with fixed sample content — no provider, no
 * interactivity. One snippet per key.
 */

const MissedCall = () => (
  <div className="mc-callcard">
    <div className="mc-callcard-icon">
      <FaPhoneSlash />
    </div>
    <div className="mc-callcard-body">
      <p className="mc-callcard-name">Marcus Bell</p>
      <p className="mc-callcard-number">(•••) •••-3162</p>
      <p className="mc-callcard-meta">Today 2:14 PM · 2 rings → voicemail</p>
    </div>
    <span className="mc-callcard-tag">Missed</span>
  </div>
);

const TextBack = () => (
  <div>
    <div className="mc-badge">
      <FaBolt className="mc-badge-icon" />
      Replied in 14 seconds
    </div>
    <div className="mc-outbox">
      <div className="mc-bubble mc-bubble-business">
        <p className="mc-bubble-body">
          Hi, this is Summit Air &amp; Plumbing — sorry we missed your call!
          What can we help with?
        </p>
      </div>
      <ol className="mc-stages">
        <li className="mc-stage is-active is-done">
          <span className="mc-stage-icon">
            <FaPaperPlane />
          </span>
          <span className="mc-stage-label">Sending</span>
        </li>
        <li className="mc-stage is-active is-done">
          <span className="mc-stage-icon">
            <FaCheck />
          </span>
          <span className="mc-stage-label">Delivered</span>
        </li>
        <li className="mc-stage is-active">
          <span className="mc-stage-icon">
            <FaSms />
          </span>
          <span className="mc-stage-label">Read</span>
        </li>
      </ol>
    </div>
  </div>
);

const Conversation = () => (
  <div>
    <div className="mc-thread">
      <div className="mc-turn mc-turn-caller">
        <div className="mc-bubble mc-bubble-caller">
          <p className="mc-bubble-body">
            My AC quit and the house is 84 and climbing. Can someone come out
            today?
          </p>
        </div>
        <span className="mc-turn-time">2:15 PM</span>
      </div>
      <div className="mc-turn mc-turn-business">
        <div className="mc-bubble mc-bubble-business">
          <p className="mc-bubble-body">
            Got it. I can get a tech out this afternoon for an AC diagnostic.
            Want me to lock in the next slot?
          </p>
        </div>
        <span className="mc-turn-time">2:16 PM</span>
      </div>
    </div>

    <div className="mc-facts">
      <div className="mc-fact">
        <FaCheckCircle className="mc-fact-icon" />
        <span className="mc-fact-label">Problem:</span>
        <span className="mc-fact-value">AC not cooling (84°F indoors)</span>
      </div>
      <div className="mc-fact">
        <FaCheckCircle className="mc-fact-icon" />
        <span className="mc-fact-label">Urgency:</span>
        <span className="mc-fact-value">Same-day / emergency</span>
      </div>
      <div className="mc-fact">
        <FaCheckCircle className="mc-fact-icon" />
        <span className="mc-fact-label">Address:</span>
        <span className="mc-fact-value">412 Marigold Ln</span>
      </div>
      <div className="mc-fact">
        <FaCheckCircle className="mc-fact-icon" />
        <span className="mc-fact-label">Homeowner:</span>
        <span className="mc-fact-value">Yes</span>
      </div>
    </div>
  </div>
);

const Booked = () => (
  <div>
    <div className="mc-booking">
      <FaCalendarCheck className="mc-booking-icon" />
      <div>
        <p className="mc-booking-title">Booked — AC diagnostic</p>
        <p className="mc-booking-meta">
          Today 4:30 PM · $189 diagnostic (repair likely to follow)
        </p>
        <p className="mc-booking-tech">
          <FaHardHat className="mc-booking-tech-icon" />
          Dispatched to Diego R.
        </p>
      </div>
    </div>

    <div className="mc-bubble mc-bubble-business mc-confirm">
      <p className="mc-bubble-body">
        You're all set for Today 4:30 PM. Diego R. will text when he's on the
        way. Thanks for reaching out!
      </p>
    </div>
  </div>
);

const snippets: Record<string, JSX.Element> = {
  missedcall: <MissedCall />,
  textback: <TextBack />,
  conversation: <Conversation />,
  booked: <Booked />,
};

const MissedCallTextBackShowcase = ({ snippet }: { snippet: string }) =>
  snippets[snippet] ?? null;

export default MissedCallTextBackShowcase;

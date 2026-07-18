import { FaGoogle, FaStar, FaCheckCircle, FaSpa, FaThumbsUp } from "react-icons/fa";
import "../demos/reviewGeneration/reviews.css";

/**
 * Static "product-shot" snippets for the review-generation detail page.
 * Reuses the demo's real `.rg-*` classes (styled by reviews.css, colored by
 * the enclosing .demo-scope) with fixed sample content — no provider, no
 * interactivity. One snippet per key.
 */

const Review = () => (
  <div className="rg-review">
    <div className="rg-review-head">
      <FaGoogle className="rg-review-google" />
      <span className="rg-review-on">Posted to Google</span>
      <span className="rg-review-badge">
        <FaCheckCircle /> Live
      </span>
    </div>
    <div className="rg-review-stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <FaStar key={i} className="rg-review-star" />
      ))}
    </div>
    <p className="rg-review-body">
      "Booked in fast, the results speak for themselves, and the whole visit
      was easy start to finish. Already rebooked — highly recommend."
    </p>
    <p className="rg-review-author">— Priya Nair</p>
  </div>
);

const Appt = () => (
  <div className="rg-appt">
    <div className="rg-appt-icon">
      <FaSpa />
    </div>
    <div className="rg-appt-body">
      <p className="rg-appt-name">Jenna Alvarez</p>
      <p className="rg-appt-service">HydraFacial · with Maya</p>
      <p className="rg-appt-meta">Today 1:30 PM · visit complete</p>
    </div>
    <span className="rg-appt-tag">Done</span>
  </div>
);

const Thread = () => (
  <div className="rg-thread">
    <div className="rg-turn" style={{ alignItems: "flex-start" }}>
      <div className="rg-bubble rg-bubble-business">
        <p className="rg-bubble-body">
          Hi Jenna — how was your visit with Maya today? Mind sharing a quick
          word?
        </p>
      </div>
      <span className="rg-turn-time">You · just now</span>
    </div>
    <div className="rg-turn">
      <div className="rg-bubble rg-bubble-caller">
        <p className="rg-bubble-body">
          Honestly one of the best facials I've had. Maya was great!
        </p>
      </div>
      <span className="rg-turn-time">Jenna · replied 6 min later</span>
    </div>
  </div>
);

const Route = () => (
  <div className="rg-route rg-route-positive">
    <span className="rg-route-sentiment">
      <FaThumbsUp className="rg-route-sentiment-icon" />
      Positive
    </span>
    <span className="rg-route-arrow">→</span>
    <div className="rg-route-decision">
      <p className="rg-route-dest">Send a one-tap Google review link</p>
      <p className="rg-route-note">
        Happy client — invite the public review while the visit is fresh.
      </p>
    </div>
  </div>
);

const snippets: Record<string, JSX.Element> = {
  review: <Review />,
  appt: <Appt />,
  thread: <Thread />,
  route: <Route />,
};

const ReviewGenerationShowcase = ({ snippet }: { snippet: string }) =>
  snippets[snippet] ?? null;

export default ReviewGenerationShowcase;

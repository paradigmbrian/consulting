import {
  FaShieldAlt,
  FaLock,
  FaBell,
  FaExclamationTriangle,
} from "react-icons/fa";
import type { WorkflowProvider } from "../types";

const CaughtStep = ({ provider }: { provider: WorkflowProvider }) => {
  const reply = provider.getReply("unhappy");
  const routing = provider.getRouting("unhappy");
  const privateCatch = provider.getPrivateCatch();
  const business = provider.getBusiness();

  return (
    <div className="rg-step">
      <h3 className="rg-heading">The other branch: caught before it goes public</h3>
      <p className="rg-sub">
        Not everyone leaves happy. When the reply isn't positive, the automation
        does the opposite of asking for a review — it protects your rating.
      </p>

      <div className="rg-thread">
        <div className="rg-turn">
          <div className="rg-bubble rg-bubble-caller">
            <p className="rg-bubble-body">{reply.body}</p>
          </div>
          <span className="rg-turn-time">
            {reply.name} · {reply.receivedLabel}
          </span>
        </div>
      </div>

      <div className="rg-route rg-route-negative">
        <span className="rg-route-sentiment">
          <FaExclamationTriangle className="rg-route-sentiment-icon" />
          Negative
        </span>
        <span className="rg-route-arrow">→</span>
        <div className="rg-route-decision">
          <p className="rg-route-dest">
            <FaLock className="rg-route-lock" />
            {routing.destination}
          </p>
          <p className="rg-route-note">{routing.decision}</p>
        </div>
      </div>

      <div className="rg-catch">
        <FaShieldAlt className="rg-catch-icon" />
        <div>
          <p className="rg-catch-title">Kept off Google — handled privately</p>
          <p className="rg-catch-meta">{privateCatch.concern}</p>
          <p className="rg-catch-action">{privateCatch.ownerAction}</p>
        </div>
      </div>

      <div className="rg-phone">
        <div className="rg-push">
          <div className="rg-push-head">
            <span className="rg-push-app">
              <FaBell className="rg-push-app-icon" />
              {business.name}
            </span>
            <span className="rg-push-now">now</span>
          </div>
          <p className="rg-push-title">Client needs a personal touch</p>
          <ul className="rg-push-lines">
            {privateCatch.alertLines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CaughtStep;

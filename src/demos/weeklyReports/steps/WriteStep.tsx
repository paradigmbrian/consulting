import { useState } from "react";
import { FaCheck, FaExclamationTriangle, FaBolt } from "react-icons/fa";
import type { WorkflowProvider } from "../types";
import { usePrefersReducedMotion } from "../../shared/usePrefersReducedMotion";
import AiPanel from "../../shared/AiPanel";

const WriteStep = ({ provider }: { provider: WorkflowProvider }) => {
  const digest = provider.getDigest();
  const reasoning = provider.getAiReasoning("write");
  const reduced = usePrefersReducedMotion();
  const [revealed, setRevealed] = useState(reduced);

  return (
    <div className="wr-step">
      <h3 className="wr-heading">It writes the report — a 30-second read</h3>
      <p className="wr-sub">
        Not a dashboard. A plain-English digest that reads like a sharp ops
        manager wrote it: the headline, the wins, the one thing to watch, and a
        single action to take.
      </p>

      <AiPanel
        title={reasoning.title}
        lines={reasoning.lines}
        onComplete={() => setRevealed(true)}
      />

      <div className={"wr-reveal" + (revealed ? " is-shown" : "")}>
        <div className="wr-report">
          <p className="wr-report-headline">{digest.headline}</p>

          <ul className="wr-highlights">
            {digest.highlights.map((h) => (
              <li key={h} className="wr-highlight">
                <FaCheck className="wr-highlight-icon" aria-hidden="true" />
                <span>{h}</span>
              </li>
            ))}
          </ul>

          <div className="wr-watchout">
            <FaExclamationTriangle
              className="wr-watchout-icon"
              aria-hidden="true"
            />
            <div>
              <p className="wr-watchout-label">One thing to watch</p>
              <p className="wr-watchout-text">{digest.watchOut}</p>
            </div>
          </div>

          <div className="wr-action-row">
            <FaBolt className="wr-action-icon" aria-hidden="true" />
            <div>
              <p className="wr-action-label">Recommended action</p>
              <p className="wr-action-text">
                {digest.recommendedAction.summary}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriteStep;

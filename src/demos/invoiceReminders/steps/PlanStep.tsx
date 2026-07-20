import { useState } from "react";
import { FaUserClock } from "react-icons/fa";
import type { WorkflowProvider } from "../types";
import { usePrefersReducedMotion } from "../../shared/usePrefersReducedMotion";
import AiPanel from "../../shared/AiPanel";

const PlanStep = ({ provider }: { provider: WorkflowProvider }) => {
  const cadence = provider.getCadence();
  const reasoning = provider.getAiReasoning("plan");
  const reduced = usePrefersReducedMotion();
  const [revealed, setRevealed] = useState(reduced);

  return (
    <div className="inv-step">
      <h3 className="inv-heading">It plans the follow-up — tone and timing</h3>
      <p className="inv-sub">
        The AI doesn't just blast one reminder. It lays out a schedule that gets
        firmer over time, and knows when to hand the tough one to you.
      </p>

      <AiPanel
        title={reasoning.title}
        lines={reasoning.lines}
        onComplete={() => setRevealed(true)}
      />

      <div className={"inv-reveal" + (revealed ? " is-shown" : "")}>
        <div className="inv-ladder">
          {cadence.map((rung, i) => (
            <div
              key={rung.label}
              className={"inv-rung" + (rung.isOwnerFlag ? " inv-rung-owner" : "")}
            >
              <span className="inv-rung-index">
                {rung.isOwnerFlag ? <FaUserClock /> : i + 1}
              </span>
              <div className="inv-rung-body">
                <div className="inv-rung-top">
                  <span className="inv-rung-label">{rung.label}</span>
                  <span className="inv-rung-timing">{rung.timing}</span>
                </div>
                <p className="inv-rung-meta">
                  {rung.tone} · {rung.channel}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlanStep;

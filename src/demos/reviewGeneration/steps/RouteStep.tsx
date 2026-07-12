import { useState } from "react";
import { FaThumbsUp } from "react-icons/fa";
import type { WorkflowProvider } from "../types";
import { usePrefersReducedMotion } from "../../shared/usePrefersReducedMotion";
import AiPanel from "../../shared/AiPanel";

const RouteStep = ({ provider }: { provider: WorkflowProvider }) => {
  const reply = provider.getReply("happy");
  const routing = provider.getRouting("happy");
  const reasoning = provider.getAiReasoning("route");
  const reduced = usePrefersReducedMotion();
  const [revealed, setRevealed] = useState(reduced);

  return (
    <div className="rg-step">
      <h3 className="rg-heading">It reads the reply — and picks a path</h3>
      <p className="rg-sub">
        Claude doesn't blast everyone to Google. It reads what the client
        actually said and routes on sentiment.
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

      <AiPanel
        title={reasoning.title}
        lines={reasoning.lines}
        onComplete={() => setRevealed(true)}
      />

      <div className={"rg-reveal" + (revealed ? " is-shown" : "")}>
        <div className="rg-route rg-route-positive">
          <span className="rg-route-sentiment">
            <FaThumbsUp className="rg-route-sentiment-icon" />
            Positive
          </span>
          <span className="rg-route-arrow">→</span>
          <div className="rg-route-decision">
            <p className="rg-route-dest">{routing.destination}</p>
            <p className="rg-route-note">{routing.decision}</p>
          </div>
        </div>
        <p className="rg-note">
          A lukewarm or negative reply takes the other branch — you'll see that
          in a couple of steps.
        </p>
      </div>
    </div>
  );
};

export default RouteStep;

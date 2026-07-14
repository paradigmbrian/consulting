import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import type { WorkflowProvider } from "../types";
import { usePrefersReducedMotion } from "../../shared/usePrefersReducedMotion";
import AiPanel from "../../shared/AiPanel";

const ConversationStep = ({ provider }: { provider: WorkflowProvider }) => {
  const thread = provider.getConversation();
  const qualified = provider.getQualified();
  const reasoning = provider.getAiReasoning("conversation");
  const reduced = usePrefersReducedMotion();
  const [revealed, setRevealed] = useState(reduced);

  const facts = [
    { label: "Problem", value: qualified.problem },
    { label: "Urgency", value: qualified.urgency },
    { label: "Address", value: qualified.address },
    { label: "Homeowner", value: qualified.homeowner ? "Yes" : "No" },
  ];

  return (
    <div className="mc-step">
      <h3 className="mc-heading">
        The automation qualifies the lead — in plain text
      </h3>
      <p className="mc-sub">
        Claude handles the back-and-forth over SMS, pulling out exactly what the
        shop needs to book the job.
      </p>

      <AiPanel
        title={reasoning.title}
        lines={reasoning.lines}
        onComplete={() => setRevealed(true)}
      />

      <div className={"mc-reveal" + (revealed ? " is-shown" : "")}>
        <div className="mc-thread">
          {thread.map((turn) => (
            <div key={turn.id} className={"mc-turn mc-turn-" + turn.from}>
              <div className={"mc-bubble mc-bubble-" + turn.from}>
                <p className="mc-bubble-body">{turn.body}</p>
              </div>
              <span className="mc-turn-time">{turn.timeLabel}</span>
            </div>
          ))}
        </div>

        <div className="mc-facts">
          {facts.map((f) => (
            <div key={f.label} className="mc-fact">
              <FaCheckCircle className="mc-fact-icon" />
              <span className="mc-fact-label">{f.label}:</span>
              <span className="mc-fact-value">{f.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConversationStep;

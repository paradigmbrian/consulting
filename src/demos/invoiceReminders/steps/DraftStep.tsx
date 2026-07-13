import { useState } from "react";
import type { WorkflowProvider } from "../types";
import { usePrefersReducedMotion } from "../../shared/usePrefersReducedMotion";
import AiPanel from "../../shared/AiPanel";

const DraftStep = ({ provider }: { provider: WorkflowProvider }) => {
  const reminders = provider.getReminders();
  const reasoning = provider.getAiReasoning("draft");
  const reduced = usePrefersReducedMotion();
  const [revealed, setRevealed] = useState(reduced);

  return (
    <div className="inv-step">
      <h3 className="inv-heading">It writes each reminder in the right tone</h3>
      <p className="inv-sub">
        Same customer, three different tones — warm, then friendly, then clearly
        professional. Never a template, never rude.
      </p>

      <AiPanel
        title={reasoning.title}
        lines={reasoning.lines}
        onComplete={() => setRevealed(true)}
      />

      <div className={"inv-reveal" + (revealed ? " is-shown" : "")}>
        <div className="inv-messages">
          {reminders.map((reminder) => (
            <div key={reminder.rungLabel} className="inv-message">
              <div className="inv-message-head">
                <span className="inv-message-rung">{reminder.rungLabel}</span>
                <span className="inv-message-tone">{reminder.tone}</span>
              </div>
              <p className="inv-message-body">{reminder.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DraftStep;

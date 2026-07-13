import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import type { WorkflowProvider } from "../types";
import { usePrefersReducedMotion } from "../../shared/usePrefersReducedMotion";
import AiPanel from "../../shared/AiPanel";

const ComposeStep = ({ provider }: { provider: WorkflowProvider }) => {
  const welcome = provider.getWelcome();
  const reasoning = provider.getAiReasoning("compose");
  const reduced = usePrefersReducedMotion();
  const [revealed, setRevealed] = useState(reduced);

  return (
    <div className="nco-step">
      <h3 className="nco-heading">It writes a real welcome — not a template</h3>
      <p className="nco-sub">
        Claude reads what the customer actually booked, then writes a warm,
        personal welcome and a tailored "what to expect" — the kind of message
        an owner wishes they had time to send every time.
      </p>

      <AiPanel
        title={reasoning.title}
        lines={reasoning.lines}
        onComplete={() => setRevealed(true)}
      />

      <div className={"nco-reveal" + (revealed ? " is-shown" : "")}>
        <div className="nco-welcome">
          <p className="nco-welcome-greeting">{welcome.greeting}</p>
          {welcome.body.map((p) => (
            <p key={p} className="nco-welcome-body">
              {p}
            </p>
          ))}
          <div className="nco-expect">
            <p className="nco-expect-label">What to expect</p>
            <ul className="nco-expect-list">
              {welcome.whatToExpect.map((e) => (
                <li key={e} className="nco-expect-item">
                  <FaCheck className="nco-expect-icon" aria-hidden="true" />
                  <span>{e}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComposeStep;

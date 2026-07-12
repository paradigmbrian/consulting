import { useState } from "react";
import type { WorkflowProvider } from "../types";
import { usePrefersReducedMotion } from "../../shared/usePrefersReducedMotion";
import AiPanel from "../../shared/AiPanel";

const UnderstandStep = ({ provider }: { provider: WorkflowProvider }) => {
  const intake = provider.getIntake();
  const scope = provider.getScope();
  const reasoning = provider.getAiReasoning("understand");
  const reduced = usePrefersReducedMotion();
  const [revealed, setRevealed] = useState(reduced);

  const firstName = intake.customerName.split(" ")[0];

  return (
    <div className="qt-step">
      <h3 className="qt-heading">It turns the mess into a clear scope</h3>
      <p className="qt-sub">
        Claude reads {firstName}'s message and pulls out the details that
        actually drive the price.
      </p>

      <AiPanel
        title={reasoning.title}
        lines={reasoning.lines}
        onComplete={() => setRevealed(true)}
      />

      <div className={"qt-reveal" + (revealed ? " is-shown" : "")}>
        <dl className="qt-scope">
          {scope.map((field) => (
            <div key={field.label} className="qt-scope-row">
              <dt className="qt-scope-label">{field.label}</dt>
              <dd className="qt-scope-value">{field.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
};

export default UnderstandStep;

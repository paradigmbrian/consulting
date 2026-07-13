import { useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import type { WorkflowProvider } from "../types";
import { usePrefersReducedMotion } from "../../shared/usePrefersReducedMotion";
import AiPanel from "../../shared/AiPanel";

const AnalyzeStep = ({ provider }: { provider: WorkflowProvider }) => {
  const findings = provider.getFindings();
  const reasoning = provider.getAiReasoning("analyze");
  const reduced = usePrefersReducedMotion();
  const [revealed, setRevealed] = useState(reduced);

  return (
    <div className="wr-step">
      <h3 className="wr-heading">It reads the whole week in one pass</h3>
      <p className="wr-sub">
        Claude pulls every tool's numbers into one place, compares them against
        last week, and flags what actually moved — and what needs attention.
      </p>

      <AiPanel
        title={reasoning.title}
        lines={reasoning.lines}
        onComplete={() => setRevealed(true)}
      />

      <div className={"wr-reveal" + (revealed ? " is-shown" : "")}>
        <div className="wr-findings">
          {findings.map((f) => (
            <div key={f.label} className="wr-finding">
              <div className="wr-finding-main">
                <span className="wr-finding-label">{f.label}</span>
                <span className="wr-finding-value">{f.value}</span>
              </div>
              <span className={"wr-badge wr-badge-" + f.trend}>
                {f.trend === "watch" && (
                  <FaExclamationTriangle aria-hidden="true" />
                )}
                {f.delta}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyzeStep;

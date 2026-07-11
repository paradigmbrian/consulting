import { useState } from "react";
import { FaUserSlash } from "react-icons/fa";
import type { WorkflowProvider } from "../types";
import { usePrefersReducedMotion } from "../../shared/usePrefersReducedMotion";
import AiPanel from "../../shared/AiPanel";

const SegmentStep = ({ provider }: { provider: WorkflowProvider }) => {
  const segments = provider.getSegments();
  const dropped = provider.getDroppedSummary();
  const reasoning = provider.getAiReasoning("segment");
  const reduced = usePrefersReducedMotion();
  const [revealed, setRevealed] = useState(reduced);

  return (
    <div className="wb-step">
      <h3 className="wb-heading">Find the winnable patients</h3>
      <p className="wb-sub">
        Claude reads the full list, groups the lapsed patients worth
        re-engaging, and sets aside the rest.
      </p>

      <AiPanel
        title={reasoning.title}
        lines={reasoning.lines}
        onComplete={() => setRevealed(true)}
      />

      <div className={"wb-reveal" + (revealed ? " is-shown" : "")}>
        <div className="wb-segments">
          {segments.map((s) => (
            <div key={s.id} className="wb-segment">
              <p className="wb-segment-count">{s.count.toLocaleString()}</p>
              <p className="wb-segment-label">{s.label}</p>
              <p className="wb-segment-crit">{s.criteria}</p>
            </div>
          ))}
        </div>

        <div className="wb-dropped">
          <FaUserSlash className="wb-dropped-icon" />
          <div>
            <p className="wb-dropped-count">
              {dropped.dropped.toLocaleString()} set aside
            </p>
            <ul className="wb-dropped-reasons">
              {dropped.reasons.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SegmentStep;

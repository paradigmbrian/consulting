import { useState } from "react";
import { FaExclamationTriangle, FaArrowRight } from "react-icons/fa";
import type { WorkflowProvider } from "../types";
import { usePrefersReducedMotion } from "../../shared/usePrefersReducedMotion";
import AiPanel from "../../shared/AiPanel";

const ReconcileStep = ({ provider }: { provider: WorkflowProvider }) => {
  const recon = provider.getReconciliation();
  const reasoning = provider.getAiReasoning("reconcile");
  const reduced = usePrefersReducedMotion();
  const [revealed, setRevealed] = useState(reduced);

  return (
    <div className="tts-step">
      <h3 className="tts-heading">
        It catches the duplicate before it's created
      </h3>
      <p className="tts-sub">
        Before writing anything, Claude checks each tool for a match. This "new"
        customer is actually an existing account under a shortened name — so the
        job merges onto the real record instead of spawning a second one.
      </p>

      <AiPanel
        title={reasoning.title}
        lines={reasoning.lines}
        onComplete={() => setRevealed(true)}
      />

      <div className={"tts-reveal" + (revealed ? " is-shown" : "")}>
        <div className="tts-recon">
          <div className="tts-dup-banner">
            <FaExclamationTriangle className="tts-dup-icon" aria-hidden="true" />
            <div className="tts-dup-meta">
              <span className="tts-dup-title">{recon.existingLabel}</span>
              <span className="tts-dup-reason">{recon.matchReason}</span>
            </div>
          </div>

          <div className="tts-conflicts">
            {recon.conflicts.map((c) => (
              <div key={c.field} className="tts-conflict">
                <span className="tts-conflict-field">{c.field}</span>
                <div className="tts-conflict-row">
                  <span className="tts-conflict-pair">
                    <span className="tts-conflict-tag">Booking</span>
                    <span className="tts-conflict-incoming">{c.incoming}</span>
                  </span>
                  <span className="tts-conflict-pair">
                    <span className="tts-conflict-tag">On file</span>
                    <span className="tts-conflict-existing">{c.existing}</span>
                  </span>
                </div>
                <div className="tts-conflict-res">
                  <FaArrowRight className="tts-conflict-arrow" aria-hidden="true" />
                  <span>{c.resolution}</span>
                </div>
              </div>
            ))}
          </div>

          <p className="tts-recon-note">{recon.note}</p>
        </div>
      </div>
    </div>
  );
};

export default ReconcileStep;

import { useState } from "react";
import type { WorkflowProvider } from "../types";
import { usePrefersReducedMotion } from "../../shared/usePrefersReducedMotion";
import AiPanel from "../../shared/AiPanel";

const MapStep = ({ provider }: { provider: WorkflowProvider }) => {
  const mappings = provider.getMappings();
  const reasoning = provider.getAiReasoning("map");
  const reduced = usePrefersReducedMotion();
  const [revealed, setRevealed] = useState(reduced);

  return (
    <div className="tts-step">
      <h3 className="tts-heading">It shapes the one job for every tool</h3>
      <p className="tts-sub">
        Each app wants the same facts in a different shape. Claude reads the
        booking once and builds the right record for each — a draft invoice, a
        CRM deal, a calendar event, and a work order.
      </p>

      <AiPanel
        title={reasoning.title}
        lines={reasoning.lines}
        onComplete={() => setRevealed(true)}
      />

      <div className={"tts-reveal" + (revealed ? " is-shown" : "")}>
        <div className="tts-mappings">
          {mappings.map((m) => (
            <div key={m.toolName} className="tts-map-card">
              <div className="tts-map-head">
                <span className="tts-map-tool">{m.toolName}</span>
                <span className="tts-map-kind">{m.kind}</span>
              </div>
              <dl className="tts-map-fields">
                {m.fields.map((f) => (
                  <div key={f.label} className="tts-map-field">
                    <dt className="tts-map-label">{f.label}</dt>
                    <dd className="tts-map-value">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapStep;

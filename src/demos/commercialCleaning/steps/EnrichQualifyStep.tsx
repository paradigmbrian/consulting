import { FaCheckCircle, FaTimesCircle, FaUser, FaPhone } from "react-icons/fa";
import type { WorkflowProvider } from "../types";
import AiPanel from "../AiPanel";
import "./EnrichQualifyStep.css";

const EnrichQualifyStep = ({ provider }: { provider: WorkflowProvider }) => {
  const targets = provider.getTargets();
  const rows = targets.map((p) => ({
    prospect: p,
    enrichment: provider.getEnrichment(p.id),
  }));
  const qualified = rows.filter((r) => r.enrichment.qualified);
  const dropped = rows.filter((r) => !r.enrichment.qualified);
  const ai = provider.getAiReasoning("enrich");

  return (
    <div className="enrich-step">
      <h2 className="step-heading">Step 3 — Enrich &amp; qualify</h2>
      <p className="step-sub">
        Contact and facility details fill in per prospect — and the workflow
        drops the ones that aren't a fit. It targets, it doesn't spray.
      </p>

      <AiPanel title={ai.title} lines={ai.lines} />

      <p className="enrich-summary">
        <span className="enrich-pill enrich-pill-ok">
          {qualified.length} qualified
        </span>
        <span className="enrich-pill enrich-pill-drop">
          {dropped.length} dropped
        </span>
      </p>

      <ul className="enrich-list">
        {rows.map(({ prospect, enrichment }) => (
          <li
            key={prospect.id}
            className={
              "enrich-card" +
              (enrichment.qualified ? " is-qualified" : " is-dropped")
            }
          >
            <div className="enrich-card-head">
              {enrichment.qualified ? (
                <FaCheckCircle className="enrich-status-ok" />
              ) : (
                <FaTimesCircle className="enrich-status-drop" />
              )}
              <h3>{prospect.name}</h3>
            </div>

            {enrichment.qualified ? (
              <div className="enrich-details">
                <p>
                  <FaUser /> {enrichment.contactName} — {enrichment.contactTitle}
                </p>
                <p>
                  <FaPhone /> {enrichment.phone}
                </p>
                <p className="enrich-facility">{enrichment.facilityDetail}</p>
              </div>
            ) : (
              <p className="enrich-reason">Dropped — {enrichment.dropReason}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EnrichQualifyStep;

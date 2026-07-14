import type { WorkflowProvider } from "../types";

const ResultsStep = ({ provider }: { provider: WorkflowProvider }) => {
  const results = provider.getResults();
  const tally = [
    { num: String(results.toolsSynced), label: "Tools in sync" },
    { num: results.timeSaved, label: "Double-entry saved", hl: true },
    { num: results.fieldsMapped, label: "Fields mapped" },
    { num: results.duplicatesPrevented, label: "Duplicates prevented" },
  ];

  return (
    <div className="tts-step">
      <h3 className="tts-heading">One entry, four tools, zero retyping</h3>
      <p className="tts-sub">
        Every booking flows into accounting, CRM, calendar, and the crew app —
        correctly shaped for each, with duplicates caught before they land.
      </p>

      <div className="tts-tally">
        {tally.map((t) => (
          <div
            key={t.label}
            className={"tts-tally-item" + (t.hl ? " tts-tally-item-hl" : "")}
          >
            <span className="tts-tally-num">{t.num}</span>
            <span className="tts-tally-label">{t.label}</span>
          </div>
        ))}
      </div>

      <p className="tts-takeaway">{results.takeaway}</p>
    </div>
  );
};

export default ResultsStep;

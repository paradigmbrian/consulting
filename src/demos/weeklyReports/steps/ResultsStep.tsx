import type { WorkflowProvider } from "../types";

const ResultsStep = ({ provider }: { provider: WorkflowProvider }) => {
  const results = provider.getResults();
  const tally = [
    { num: String(results.reportsDelivered), label: "Reports delivered" },
    { num: results.avgReadTime, label: "Avg read time", hl: true },
    { num: String(results.actionsTaken), label: "One-tap actions taken" },
    { num: results.hoursSaved, label: "Owner time saved" },
  ];

  return (
    <div className="wr-step">
      <h3 className="wr-heading">
        A quarter of Sundays — the numbers, finally read
      </h3>
      <p className="wr-sub">
        Every week compiled into a 30-second digest, with one clear action the
        owner can take on the spot. No evenings lost to spreadsheets.
      </p>

      <div className="wr-tally">
        {tally.map((t) => (
          <div
            key={t.label}
            className={"wr-tally-item" + (t.hl ? " wr-tally-item-hl" : "")}
          >
            <span className="wr-tally-num">{t.num}</span>
            <span className="wr-tally-label">{t.label}</span>
          </div>
        ))}
      </div>

      <p className="wr-takeaway">{results.takeaway}</p>
    </div>
  );
};

export default ResultsStep;

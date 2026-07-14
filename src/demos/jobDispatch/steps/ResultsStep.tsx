import type { WorkflowProvider } from "../types";

const ResultsStep = ({ provider }: { provider: WorkflowProvider }) => {
  const results = provider.getResults();
  const tally = [
    { num: String(results.jobsPlaced), label: "Jobs placed" },
    { num: results.driveTimeSaved, label: "Drive time saved", hl: true },
    { num: results.onTimeRate, label: "On-time arrival" },
    { num: results.dispatchTime, label: "Dispatch time" },
  ];

  return (
    <div className="jd-step">
      <h3 className="jd-heading">A full day, dispatched in under a minute</h3>
      <p className="jd-sub">
        Eight jobs matched, four vans routed, and every customer notified —
        before the dispatcher would've finished their first coffee.
      </p>

      <div className="jd-tally">
        {tally.map((t) => (
          <div
            key={t.label}
            className={"jd-tally-item" + (t.hl ? " jd-tally-item-hl" : "")}
          >
            <span className="jd-tally-num">{t.num}</span>
            <span className="jd-tally-label">{t.label}</span>
          </div>
        ))}
      </div>

      <p className="jd-takeaway">{results.takeaway}</p>
    </div>
  );
};

export default ResultsStep;

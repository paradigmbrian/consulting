import type { WorkflowProvider } from "../types";

const ResultsStep = ({ provider }: { provider: WorkflowProvider }) => {
  const results = provider.getResults();
  const tally = [
    { num: String(results.requests), label: "Quote requests" },
    { num: String(results.quotesSent), label: "Quotes sent" },
    { num: results.avgTurnaround, label: "Avg turnaround", hl: true },
    { num: String(results.jobsBooked), label: "Jobs booked" },
    { num: results.winRate, label: "Win rate" },
    { num: results.revenueQuoted, label: "Revenue quoted" },
  ];

  return (
    <div className="qt-step">
      <h3 className="qt-heading">One month, quotes on autopilot</h3>
      <p className="qt-sub">
        Every request answered in minutes, every quote itemized and consistent.
      </p>

      <div className="qt-tally">
        {tally.map((t) => (
          <div
            key={t.label}
            className={"qt-tally-item" + (t.hl ? " qt-tally-item-hl" : "")}
          >
            <span className="qt-tally-num">{t.num}</span>
            <span className="qt-tally-label">{t.label}</span>
          </div>
        ))}
      </div>

      <p className="qt-takeaway">{results.takeaway}</p>
    </div>
  );
};

export default ResultsStep;

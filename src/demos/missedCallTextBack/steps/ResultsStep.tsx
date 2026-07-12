import type { WorkflowProvider } from "../types";

const ResultsStep = ({ provider }: { provider: WorkflowProvider }) => {
  const results = provider.getResults();
  const tally = [
    { num: results.missedCalls, label: "Missed calls" },
    { num: results.recovered, label: "Recovered" },
    { num: results.booked, label: "Booked", hl: true },
  ];

  return (
    <div className="mc-step">
      <h3 className="mc-heading">One week, hands-off</h3>
      <p className="mc-sub">
        Every missed call got an instant text back. Here's what that recovered.
      </p>

      <div className="mc-tally">
        {tally.map((t) => (
          <div
            key={t.label}
            className={"mc-tally-item" + (t.hl ? " mc-tally-item-hl" : "")}
          >
            <span className="mc-tally-num">{t.num}</span>
            <span className="mc-tally-label">{t.label}</span>
          </div>
        ))}
      </div>

      <p className="mc-revenue">{results.revenueRecovered}</p>
      <p className="mc-takeaway">{results.takeaway}</p>
    </div>
  );
};

export default ResultsStep;

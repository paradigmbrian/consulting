import type { WorkflowProvider } from "../types";

const ResultsStep = ({ provider }: { provider: WorkflowProvider }) => {
  const results = provider.getResults();
  const tally = [
    { num: results.contacted.toLocaleString(), label: "Contacted" },
    { num: results.delivered.toLocaleString(), label: "Delivered" },
    { num: results.replied.toLocaleString(), label: "Replied" },
    { num: results.booked.toLocaleString(), label: "Booked", hl: true },
  ];

  return (
    <div className="wb-step">
      <h3 className="wb-heading">Campaign results</h3>
      <p className="wb-sub">One run, off a list the practice already owned.</p>

      <div className="wb-tally">
        {tally.map((t) => (
          <div
            key={t.label}
            className={"wb-tally-item" + (t.hl ? " wb-tally-item-hl" : "")}
          >
            <span className="wb-tally-num">{t.num}</span>
            <span className="wb-tally-label">{t.label}</span>
          </div>
        ))}
      </div>

      <p className="wb-revenue">{results.revenueRecovered}</p>
      <p className="wb-takeaway">{results.takeaway}</p>
    </div>
  );
};

export default ResultsStep;

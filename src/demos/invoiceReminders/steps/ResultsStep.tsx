import type { WorkflowProvider } from "../types";

const ResultsStep = ({ provider }: { provider: WorkflowProvider }) => {
  const results = provider.getResults();
  const tally = [
    { num: String(results.invoicesTracked), label: "Invoices tracked" },
    { num: results.collected, label: "Collected", hl: true },
    { num: results.hoursSaved, label: "Owner time saved" },
    { num: String(results.flaggedForCall), label: "Flagged for a call" },
  ];

  return (
    <div className="inv-step">
      <h3 className="inv-heading">One month, invoices chasing themselves</h3>
      <p className="inv-sub">
        Every invoice followed up on time and in the right tone — the owner stays
        out of it unless a human is actually needed.
      </p>

      <div className="inv-tally">
        {tally.map((t) => (
          <div
            key={t.label}
            className={"inv-tally-item" + (t.hl ? " inv-tally-item-hl" : "")}
          >
            <span className="inv-tally-num">{t.num}</span>
            <span className="inv-tally-label">{t.label}</span>
          </div>
        ))}
      </div>

      <div className="inv-lift">
        <span className="inv-lift-before">{results.avgDaysBefore}</span>
        <span className="inv-lift-arrow">→</span>
        <span className="inv-lift-after">{results.avgDaysAfter}</span>
        <span className="inv-lift-caption">Avg days to get paid</span>
      </div>

      <p className="inv-takeaway">{results.takeaway}</p>
    </div>
  );
};

export default ResultsStep;

import type { WorkflowProvider } from "../types";

const ResultsStep = ({ provider }: { provider: WorkflowProvider }) => {
  const results = provider.getResults();
  const tally = [
    { num: String(results.customersOnboarded), label: "Customers onboarded" },
    {
      num: results.avgTimeToFirstVisit,
      label: "Avg time to first visit",
      hl: true,
    },
    { num: results.agreementsSigned, label: "Agreements signed" },
    { num: results.hoursSaved, label: "Owner time saved" },
  ];

  return (
    <div className="nco-step">
      <h3 className="nco-heading">
        Every new customer, welcomed the moment they book
      </h3>
      <p className="nco-sub">
        A personal welcome, the right paperwork, and a first visit on the
        calendar — all handled before the owner would've even opened their
        laptop.
      </p>

      <div className="nco-tally">
        {tally.map((t) => (
          <div
            key={t.label}
            className={"nco-tally-item" + (t.hl ? " nco-tally-item-hl" : "")}
          >
            <span className="nco-tally-num">{t.num}</span>
            <span className="nco-tally-label">{t.label}</span>
          </div>
        ))}
      </div>

      <p className="nco-takeaway">{results.takeaway}</p>
    </div>
  );
};

export default ResultsStep;

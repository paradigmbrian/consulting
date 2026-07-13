import type { WorkflowProvider } from "../types";

const DataStep = ({ provider }: { provider: WorkflowProvider }) => {
  const business = provider.getBusiness();
  const raw = provider.getRawData();

  return (
    <div className="wr-step">
      <h3 className="wr-heading">
        Sunday night — a week's worth of numbers, unread
      </h3>
      <p className="wr-sub">
        {business.name} ran the crews all week. The numbers piled up across five
        different apps — revenue, jobs, leads, quotes, reviews, missed calls,
        crew hours — and no one has time to log into five dashboards to read
        them.
      </p>

      <div className="wr-rawgrid">
        {raw.map((m) => (
          <div key={m.label} className="wr-chip">
            <span className="wr-chip-source">{m.source}</span>
            <span className="wr-chip-value">{m.value}</span>
            <span className="wr-chip-label">{m.label}</span>
          </div>
        ))}
      </div>

      <p className="wr-note">
        Raw, scattered, and unglamorous — exactly the pile that never gets
        looked at.
      </p>
    </div>
  );
};

export default DataStep;

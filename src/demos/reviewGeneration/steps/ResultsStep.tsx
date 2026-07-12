import { FaStar } from "react-icons/fa";
import type { WorkflowProvider } from "../types";

const ResultsStep = ({ provider }: { provider: WorkflowProvider }) => {
  const results = provider.getResults();
  const tally = [
    { num: results.requestsSent, label: "Requests sent" },
    { num: results.reviewsGained, label: "New 5★ reviews", hl: true },
    { num: results.intercepted, label: "Caught privately" },
  ];

  return (
    <div className="rg-step">
      <h3 className="rg-heading">One month, on autopilot</h3>
      <p className="rg-sub">
        Every completed visit asked, every reply read and routed.
      </p>

      <div className="rg-tally">
        {tally.map((t) => (
          <div
            key={t.label}
            className={"rg-tally-item" + (t.hl ? " rg-tally-item-hl" : "")}
          >
            <span className="rg-tally-num">{t.num}</span>
            <span className="rg-tally-label">{t.label}</span>
          </div>
        ))}
      </div>

      <div className="rg-rating">
        <span className="rg-rating-before">{results.ratingBefore}★</span>
        <span className="rg-rating-arrow">→</span>
        <span className="rg-rating-after">
          <FaStar className="rg-rating-star" />
          {results.ratingAfter}
        </span>
        <span className="rg-rating-caption">Google rating</span>
      </div>

      <p className="rg-takeaway">{results.takeaway}</p>
    </div>
  );
};

export default ResultsStep;

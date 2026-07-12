import { FaInbox, FaBolt } from "react-icons/fa";
import type { WorkflowProvider } from "../types";

const RequestStep = ({ provider }: { provider: WorkflowProvider }) => {
  const business = provider.getBusiness();
  const intake = provider.getIntake();

  return (
    <div className="qt-step">
      <h3 className="qt-heading">A lead asks for a price — in their own words</h3>
      <p className="qt-sub">
        {business.name} lives and dies on fast, accurate quotes. Here's one
        coming in — messy and conversational, the way real customers write.
      </p>

      <div className="qt-intake">
        <div className="qt-intake-head">
          <FaInbox className="qt-intake-icon" />
          <div className="qt-intake-meta">
            <p className="qt-intake-name">{intake.customerName}</p>
            <p className="qt-intake-channel">
              via {intake.channel} · {intake.receivedLabel}
            </p>
          </div>
        </div>
        <p className="qt-intake-body">"{intake.rawText}"</p>
      </div>

      <div className="qt-badge">
        <FaBolt className="qt-badge-icon" />
        A lead worth a fast, accurate quote
      </div>
    </div>
  );
};

export default RequestStep;

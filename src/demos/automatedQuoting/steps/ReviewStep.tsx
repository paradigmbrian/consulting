import { FaUserCheck, FaPaperPlane, FaPen } from "react-icons/fa";
import type { WorkflowProvider } from "../types";
import QuoteCard from "./QuoteCard";

const ReviewStep = ({ provider }: { provider: WorkflowProvider }) => {
  const quote = provider.getQuote();
  const approval = provider.getApproval();

  return (
    <div className="qt-step">
      <h3 className="qt-heading">You stay in control — one tap to send</h3>
      <p className="qt-sub">
        The AI did the grunt work. The quote lands in your queue ready to go —
        you approve it, or tweak a line first.
      </p>

      <div className="qt-approve-banner">
        <FaUserCheck className="qt-approve-banner-icon" />
        <span>{approval.summary}</span>
      </div>

      <QuoteCard quote={quote} />

      <div className="qt-approve-actions">
        <span className="qt-approve-btn qt-approve-btn-primary">
          <FaPaperPlane className="qt-approve-btn-icon" />
          Approve &amp; send
        </span>
        <span className="qt-approve-btn qt-approve-btn-ghost">
          <FaPen className="qt-approve-btn-icon" />
          Tweak a line
        </span>
      </div>

      <p className="qt-note">{approval.ownerAction}</p>
    </div>
  );
};

export default ReviewStep;

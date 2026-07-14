import { FaPhoneSlash } from "react-icons/fa";
import type { WorkflowProvider } from "../types";

const MissedCallStep = ({ provider }: { provider: WorkflowProvider }) => {
  const call = provider.getMissedCall();
  const business = provider.getBusiness();

  return (
    <div className="mc-step">
      <h3 className="mc-heading">A call comes in — and nobody's free</h3>
      <p className="mc-sub">
        {business.name}: {business.context}. The phone rings while the crew is
        out on a job, so it goes to voicemail.
      </p>

      <div className="mc-callcard">
        <div className="mc-callcard-icon">
          <FaPhoneSlash />
        </div>
        <div className="mc-callcard-body">
          <p className="mc-callcard-name">{call.callerName}</p>
          <p className="mc-callcard-number">{call.number}</p>
          <p className="mc-callcard-meta">
            {call.timeLabel} · {call.ringNote}
          </p>
        </div>
        <span className="mc-callcard-tag">Missed</span>
      </div>

      <p className="mc-note">
        Normally this lead just calls the next shop on Google. Watch what
        happens instead.
      </p>
    </div>
  );
};

export default MissedCallStep;

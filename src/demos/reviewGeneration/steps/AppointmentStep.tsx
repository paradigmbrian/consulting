import { FaSpa } from "react-icons/fa";
import type { WorkflowProvider } from "../types";

const AppointmentStep = ({ provider }: { provider: WorkflowProvider }) => {
  const business = provider.getBusiness();
  const appt = provider.getAppointment();

  return (
    <div className="rg-step">
      <h3 className="rg-heading">A great visit just wrapped</h3>
      <p className="rg-sub">
        {business.name} — {business.ratingContext}. Every happy client who walks
        out is a review waiting to happen. Here's one.
      </p>

      <div className="rg-appt">
        <div className="rg-appt-icon">
          <FaSpa />
        </div>
        <div className="rg-appt-body">
          <p className="rg-appt-name">{appt.client}</p>
          <p className="rg-appt-service">
            {appt.service} · with {appt.provider}
          </p>
          <p className="rg-appt-meta">{appt.timeLabel} · visit complete</p>
        </div>
        <span className="rg-appt-tag">Done</span>
      </div>

      <p className="rg-note">
        Most happy clients never leave a review — not because they won't, but
        because no one asked at the right moment.
      </p>
    </div>
  );
};

export default AppointmentStep;

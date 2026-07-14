import { FaBell } from "react-icons/fa";
import type { WorkflowProvider } from "../types";

const OwnerAlertStep = ({ provider }: { provider: WorkflowProvider }) => {
  const alert = provider.getOwnerAlert();
  const business = provider.getBusiness();

  return (
    <div className="mc-step">
      <h3 className="mc-heading">The owner just gets the good news</h3>
      <p className="mc-sub">
        No missed-call panic, no callback scramble. {business.name}'s owner sees
        one notification: a job already booked.
      </p>

      <div className="mc-phone">
        <div className="mc-push">
          <div className="mc-push-head">
            <span className="mc-push-app">
              <FaBell className="mc-push-app-icon" />
              {business.name}
            </span>
            <span className="mc-push-now">now</span>
          </div>
          <p className="mc-push-title">{alert.title}</p>
          <ul className="mc-push-lines">
            {alert.lines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OwnerAlertStep;

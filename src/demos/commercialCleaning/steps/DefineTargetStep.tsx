import { FaMapMarkerAlt, FaBuilding } from "react-icons/fa";
import type { WorkflowProvider } from "../types";
import "./DefineTargetStep.css";

const DefineTargetStep = ({ provider }: { provider: WorkflowProvider }) => {
  const company = provider.getCompany();
  const icp = provider.getICP();
  return (
    <div className="define-step">
      <h2 className="step-heading">Step 1 — Define the target</h2>
      <p className="step-sub">
        Before any outreach, the workflow locks onto exactly who {company.name}{" "}
        wants as customers.
      </p>

      <div className="define-grid">
        <div className="define-card">
          <FaBuilding className="define-icon" />
          <h3>Ideal facility types</h3>
          <ul className="define-chips">
            {icp.facilityTypes.map((t) => (
              <li key={t} className="define-chip">
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="define-card">
          <FaMapMarkerAlt className="define-icon" />
          <h3>Service area</h3>
          <p className="define-area">{icp.serviceAreaLabel}</p>
          <p className="define-radius">
            {icp.serviceRadiusMiles}-mile service radius
          </p>
        </div>
      </div>
    </div>
  );
};

export default DefineTargetStep;

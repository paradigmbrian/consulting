import { useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import type { WorkflowProvider } from "../types";
import { usePrefersReducedMotion } from "../../shared/usePrefersReducedMotion";
import AiPanel from "../../shared/AiPanel";

const RouteStep = ({ provider }: { provider: WorkflowProvider }) => {
  const routes = provider.getRoutes();
  const reasoning = provider.getAiReasoning("route");
  const reduced = usePrefersReducedMotion();
  const [revealed, setRevealed] = useState(reduced);

  // The emergency route is whichever tech got the emergency job — derived, not hardcoded.
  const emergencyCustomers = new Set(
    provider
      .getJobs()
      .filter((j) => j.priority === "emergency")
      .map((j) => j.customer),
  );
  const emergencyTech = provider
    .getAssignments()
    .find((a) => emergencyCustomers.has(a.customer))?.techName;

  return (
    <div className="jd-step">
      <h3 className="jd-heading">It routes each van to cut the drive</h3>
      <p className="jd-sub">
        Claude sequences each tech's stops into the tightest route that still
        honors every time window — and keeps the emergency locked as the first
        stop.
      </p>

      <AiPanel
        title={reasoning.title}
        lines={reasoning.lines}
        onComplete={() => setRevealed(true)}
      />

      <div className={"jd-reveal" + (revealed ? " is-shown" : "")}>
        <div className="jd-routes">
          {routes.map((r) => {
            const emergency = r.techName === emergencyTech;
            return (
              <div
                key={r.techName}
                className={"jd-route-card" + (emergency ? " is-emergency" : "")}
              >
                <div className="jd-route-head">
                  <span className="jd-route-tech">{r.techName}</span>
                  {emergency && (
                    <span className="jd-route-flag">
                      <FaExclamationTriangle aria-hidden="true" /> Emergency first
                    </span>
                  )}
                </div>
                <ol className="jd-route-stops">
                  {r.stops.map((s) => (
                    <li key={s} className="jd-route-stop">
                      {s}
                    </li>
                  ))}
                </ol>
                <p className="jd-route-note">{r.driveNote}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RouteStep;

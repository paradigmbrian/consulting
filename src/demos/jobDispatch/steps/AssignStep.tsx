import { useState } from "react";
import { FaArrowRight, FaExclamationTriangle } from "react-icons/fa";
import type { WorkflowProvider } from "../types";
import { usePrefersReducedMotion } from "../../shared/usePrefersReducedMotion";
import AiPanel from "../../shared/AiPanel";

const AssignStep = ({ provider }: { provider: WorkflowProvider }) => {
  const assignments = provider.getAssignments();
  const reasoning = provider.getAiReasoning("assign");
  const reduced = usePrefersReducedMotion();
  const [revealed, setRevealed] = useState(reduced);

  // Derive the emergency customer(s) from the raw queue — no hardcoded names.
  const emergencyCustomers = new Set(
    provider
      .getJobs()
      .filter((j) => j.priority === "emergency")
      .map((j) => j.customer),
  );

  return (
    <div className="jd-step">
      <h3 className="jd-heading">It matches every job to the right tech</h3>
      <p className="jd-sub">
        The AI reads each job's skill need, zone, and time window — bumps the
        burst pipe to the front — then matches it to the tech who fits, balancing
        the load so no van is overloaded.
      </p>

      <AiPanel
        title={reasoning.title}
        lines={reasoning.lines}
        onComplete={() => setRevealed(true)}
      />

      <div className={"jd-reveal" + (revealed ? " is-shown" : "")}>
        <div className="jd-assignments">
          {assignments.map((a) => {
            const emergency = emergencyCustomers.has(a.customer);
            return (
              <div
                key={a.jobLabel}
                className={"jd-assign-row" + (emergency ? " is-emergency" : "")}
              >
                <div className="jd-assign-match">
                  <span className="jd-assign-job">
                    {emergency && <FaExclamationTriangle aria-hidden="true" />}
                    {a.jobLabel}
                    <span className="jd-assign-customer">{a.customer}</span>
                  </span>
                  <FaArrowRight className="jd-assign-arrow" aria-hidden="true" />
                  <span className="jd-assign-tech">{a.techName}</span>
                </div>
                <p className="jd-assign-reason">{a.reason}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AssignStep;

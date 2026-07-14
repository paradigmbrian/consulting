import { useEffect, useState } from "react";
import { FaCalendarCheck, FaCheckCircle, FaUserCircle } from "react-icons/fa";
import type { WorkflowProvider } from "../types";
import { usePrefersReducedMotion } from "../../shared/usePrefersReducedMotion";

const BOOK_DELAY_MS = 1100;

const ScheduleStep = ({ provider }: { provider: WorkflowProvider }) => {
  const visit = provider.getFirstVisit();
  const reduced = usePrefersReducedMotion();
  const [booked, setBooked] = useState(reduced);

  useEffect(() => {
    if (reduced) {
      setBooked(true);
      return;
    }
    const t = window.setTimeout(() => setBooked(true), BOOK_DELAY_MS);
    return () => window.clearTimeout(t);
  }, [reduced]);

  return (
    <div className="nco-step">
      <h3 className="nco-heading">
        And it books the first visit — automatically
      </h3>
      <p className="nco-sub">
        The last step handles itself: the automation finds the first open slot
        on the right route and puts it on the calendar. The owner never touches
        it.
      </p>

      <div className="nco-schedule">
        <div className={"nco-slot" + (booked ? " is-booked" : "")}>
          <FaCalendarCheck className="nco-slot-icon" aria-hidden="true" />
          <div className="nco-slot-meta">
            <span className="nco-slot-when">{visit.slotLabel}</span>
            <span className="nco-slot-tech">
              <FaUserCircle aria-hidden="true" /> {visit.tech}
            </span>
          </div>
          <span className="nco-slot-status">{booked ? "Booked" : "Booking…"}</span>
        </div>

        <div className={"nco-confirm" + (booked ? " is-shown" : "")}>
          <FaCheckCircle className="nco-confirm-icon" aria-hidden="true" />
          <div>
            <p className="nco-confirm-title">{visit.confirmation}</p>
            <p className="nco-confirm-detail">{visit.detail}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleStep;

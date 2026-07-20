import { useState } from "react";
import { FaCalendarCheck, FaHardHat } from "react-icons/fa";
import type { WorkflowProvider } from "../types";
import { usePrefersReducedMotion } from "../../shared/usePrefersReducedMotion";
import AiPanel from "../../shared/AiPanel";

const BookStep = ({ provider }: { provider: WorkflowProvider }) => {
  const booking = provider.getBooking();
  const reasoning = provider.getAiReasoning("book");
  const reduced = usePrefersReducedMotion();
  const [revealed, setRevealed] = useState(reduced);

  return (
    <div className="mc-step">
      <h3 className="mc-heading">It books the job and dispatches a tech</h3>
      <p className="mc-sub">
        The AI offers the next same-day slot, confirms with the caller over
        text, and puts the job on the board.
      </p>

      <AiPanel
        title={reasoning.title}
        lines={reasoning.lines}
        onComplete={() => setRevealed(true)}
      />

      <div className={"mc-reveal" + (revealed ? " is-shown" : "")}>
        <div className="mc-booking">
          <FaCalendarCheck className="mc-booking-icon" />
          <div>
            <p className="mc-booking-title">Booked — {booking.service}</p>
            <p className="mc-booking-meta">
              {booking.when} · {booking.value}
            </p>
            <p className="mc-booking-tech">
              <FaHardHat className="mc-booking-tech-icon" />
              Dispatched to {booking.tech}
            </p>
          </div>
        </div>

        <div className="mc-bubble mc-bubble-business mc-confirm">
          <p className="mc-bubble-body">
            You're all set for {booking.when}. {booking.tech} will text when
            he's on the way. Thanks for reaching out!
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookStep;

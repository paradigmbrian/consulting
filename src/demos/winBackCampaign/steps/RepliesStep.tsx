import { useEffect, useRef, useState } from "react";
import { FaReply, FaCalendarCheck } from "react-icons/fa";
import type { WorkflowProvider } from "../types";
import { useSendLifecycle } from "../../shared/SendLifecycleProvider";
import { usePrefersReducedMotion } from "../../shared/usePrefersReducedMotion";

const REPLY_DELAY_MS = 700;

const RepliesStep = ({ provider }: { provider: WorkflowProvider }) => {
  const patientId = provider.getFeaturedPatientId();
  const reply = provider.getReply(patientId);
  const booking = provider.getBooking(patientId);
  const { markReplied } = useSendLifecycle();
  const reduced = usePrefersReducedMotion();
  const [shown, setShown] = useState(reduced);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (reduced) {
      setShown(true);
      markReplied();
      return;
    }
    timer.current = window.setTimeout(() => {
      setShown(true);
      markReplied();
    }, REPLY_DELAY_MS);
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, [reduced, markReplied]);

  return (
    <div className="wb-step">
      <h3 className="wb-heading">A patient replies — and books</h3>
      <p className="wb-sub">{reply.receivedLabel}, {reply.fromName} texts back.</p>

      <div className={"wb-reply-card" + (shown ? " is-shown" : "")}>
        <div className="wb-reply-head">
          <FaReply className="wb-reply-icon" />
          <div>
            <p className="wb-reply-from">{reply.fromName}</p>
            <p className="wb-reply-channel">{reply.channel}</p>
          </div>
        </div>
        <p className="wb-reply-body">{reply.body}</p>
      </div>

      <div className={"wb-booking" + (shown ? " is-shown" : "")}>
        <FaCalendarCheck className="wb-booking-icon" />
        <div>
          <p className="wb-booking-title">Booked — {booking.service}</p>
          <p className="wb-booking-meta">
            {booking.when} · {booking.value}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RepliesStep;

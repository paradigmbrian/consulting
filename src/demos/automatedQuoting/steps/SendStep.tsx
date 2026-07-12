import { useEffect, useRef, useState } from "react";
import {
  FaPaperPlane,
  FaCheck,
  FaEnvelopeOpenText,
  FaReply,
  FaCalendarCheck,
} from "react-icons/fa";
import type { WorkflowProvider } from "../types";
import {
  useSendLifecycle,
  type SendStatus,
} from "../../shared/SendLifecycleProvider";
import { usePrefersReducedMotion } from "../../shared/usePrefersReducedMotion";

const ORDER: SendStatus[] = ["sending", "delivered", "opened"];
const REPLY_DELAY_MS = 700;

function statusRank(s: SendStatus): number {
  if (s === "idle") return -1;
  if (s === "replied") return ORDER.length - 1;
  return ORDER.indexOf(s);
}

const SendStep = ({ provider }: { provider: WorkflowProvider }) => {
  const acceptance = provider.getAcceptance();
  const { status, start, markReplied } = useSendLifecycle();
  const reduced = usePrefersReducedMotion();
  const started = useRef(false);
  const replyTimer = useRef<number | null>(null);
  const [accepted, setAccepted] = useState(reduced);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    start();
  }, [start]);

  useEffect(() => {
    if (status !== "opened") return;
    if (reduced) {
      setAccepted(true);
      markReplied();
      return;
    }
    replyTimer.current = window.setTimeout(() => {
      setAccepted(true);
      markReplied();
    }, REPLY_DELAY_MS);
    return () => {
      if (replyTimer.current !== null) window.clearTimeout(replyTimer.current);
    };
  }, [status, reduced, markReplied]);

  const rank = statusRank(status);
  const stages = [
    { id: "sending", label: "Sending", icon: <FaPaperPlane /> },
    { id: "delivered", label: "Delivered", icon: <FaCheck /> },
    { id: "opened", label: "Read", icon: <FaEnvelopeOpenText /> },
  ];

  return (
    <div className="qt-step">
      <h3 className="qt-heading">Sent — and the job books itself</h3>
      <p className="qt-sub">
        The quote goes out the moment you approve it. {acceptance.customerName}{" "}
        sees a fast, professional estimate — and says yes.
      </p>

      <div className="qt-outbox">
        <ol className="qt-stages">
          {stages.map((stage, i) => (
            <li
              key={stage.id}
              className={
                "qt-stage" +
                (rank >= i ? " is-active" : "") +
                (rank > i ? " is-done" : "")
              }
            >
              <span className="qt-stage-icon">{stage.icon}</span>
              <span className="qt-stage-label">{stage.label}</span>
            </li>
          ))}
        </ol>

        <div className={"qt-accept" + (accepted ? " is-shown" : "")}>
          <div className="qt-accept-reply">
            <div className="qt-accept-reply-head">
              <FaReply className="qt-accept-reply-icon" />
              <span className="qt-accept-reply-from">
                {acceptance.customerName}
              </span>
            </div>
            <p className="qt-accept-reply-body">{acceptance.replyBody}</p>
          </div>
          <div className="qt-accept-booking">
            <FaCalendarCheck className="qt-accept-booking-icon" />
            <div>
              <p className="qt-accept-booking-title">
                Booked — {acceptance.bookedDate}
              </p>
              <p className="qt-accept-booking-meta">{acceptance.jobValue}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendStep;

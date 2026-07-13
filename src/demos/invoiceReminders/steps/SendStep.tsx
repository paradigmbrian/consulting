import { useEffect, useRef } from "react";
import {
  FaPaperPlane,
  FaCheck,
  FaEnvelopeOpenText,
} from "react-icons/fa";
import type { WorkflowProvider } from "../types";
import {
  useSendLifecycle,
  type SendStatus,
} from "../../shared/SendLifecycleProvider";

const ORDER: SendStatus[] = ["sending", "delivered", "opened"];

function statusRank(s: SendStatus): number {
  if (s === "idle") return -1;
  if (s === "replied") return ORDER.length - 1;
  return ORDER.indexOf(s);
}

const SendStep = ({ provider }: { provider: WorkflowProvider }) => {
  const cadence = provider.getCadence();
  const { status, start } = useSendLifecycle();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    start();
  }, [start]);

  // The reminders that actually go out (exclude the owner-flag safety net).
  const sentRungs = cadence.filter((rung) => !rung.isOwnerFlag);

  const rank = statusRank(status);
  const lifecycle = [
    { id: "sending", label: "Sending", icon: <FaPaperPlane /> },
    { id: "delivered", label: "Delivered", icon: <FaCheck /> },
    { id: "opened", label: "Read", icon: <FaEnvelopeOpenText /> },
  ];

  return (
    <div className="inv-step">
      <h3 className="inv-heading">The reminders go out on schedule</h3>
      <p className="inv-sub">
        No one lifts a finger. Each reminder fires on its day, in its tone —
        until the invoice is paid or it's time to loop you in.
      </p>

      <div className="inv-outbox">
        <ol className="inv-stages">
          {sentRungs.map((rung) => (
            <li key={rung.label} className="inv-stage is-done">
              <span className="inv-stage-icon">
                <FaCheck />
              </span>
              <span className="inv-stage-label">{rung.label}</span>
              <span className="inv-stage-timing">{rung.timing}</span>
            </li>
          ))}
        </ol>

        <p className="inv-done-note">Firm reminder delivered:</p>

        <ol className="inv-lifecycle">
          {lifecycle.map((stage, i) => (
            <li
              key={stage.id}
              className={
                "inv-life" +
                (rank >= i ? " is-active" : "") +
                (rank > i ? " is-done" : "")
              }
            >
              <span className="inv-life-icon">{stage.icon}</span>
              <span className="inv-life-label">{stage.label}</span>
            </li>
          ))}
        </ol>

        {status === "opened" && (
          <p className="inv-done-note">
            Read. Now watch what happens next — no third-party collections, no
            awkward phone call.
          </p>
        )}
      </div>
    </div>
  );
};

export default SendStep;

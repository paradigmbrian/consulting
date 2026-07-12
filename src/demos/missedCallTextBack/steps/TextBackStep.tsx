import { useEffect, useRef } from "react";
import { FaPaperPlane, FaCheck, FaSms, FaBolt } from "react-icons/fa";
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

const TextBackStep = ({ provider }: { provider: WorkflowProvider }) => {
  const autoText = provider.getAutoText();
  const call = provider.getMissedCall();
  const { status, start } = useSendLifecycle();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    start();
  }, [start]);

  const rank = statusRank(status);
  const stages = [
    { id: "sending", label: "Sending", icon: <FaPaperPlane /> },
    { id: "delivered", label: "Delivered", icon: <FaCheck /> },
    { id: "opened", label: "Read", icon: <FaSms /> },
  ];

  return (
    <div className="mc-step">
      <h3 className="mc-heading">An instant text goes back — automatically</h3>
      <p className="mc-sub">
        No one lifted a finger. Seconds after the missed call, {call.callerName}{" "}
        gets a text from the shop's number.
      </p>

      <div className="mc-badge">
        <FaBolt className="mc-badge-icon" />
        Replied in {autoText.responseSeconds} seconds
      </div>

      <div className="mc-outbox">
        <div className="mc-bubble mc-bubble-business">
          <p className="mc-bubble-body">{autoText.body}</p>
        </div>

        <ol className="mc-stages">
          {stages.map((stage, i) => (
            <li
              key={stage.id}
              className={
                "mc-stage" +
                (rank >= i ? " is-active" : "") +
                (rank > i ? " is-done" : "")
              }
            >
              <span className="mc-stage-icon">{stage.icon}</span>
              <span className="mc-stage-label">{stage.label}</span>
            </li>
          ))}
        </ol>

        {status === "opened" && (
          <p className="mc-done-note">
            Read — the lead is still yours. Now the automation actually talks to
            them.
          </p>
        )}
      </div>
    </div>
  );
};

export default TextBackStep;

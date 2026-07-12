import { useEffect, useRef } from "react";
import { FaPaperPlane, FaCheck, FaSms } from "react-icons/fa";
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

const RequestStep = ({ provider }: { provider: WorkflowProvider }) => {
  const request = provider.getRequest();
  const appt = provider.getAppointment();
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
    <div className="rg-step">
      <h3 className="rg-heading">A warm, well-timed ask — automatically</h3>
      <p className="rg-sub">
        {request.delayLabel}, {appt.client} gets a friendly text. No pushy
        "leave us 5 stars" — just a real question.
      </p>

      <div className="rg-outbox">
        <div className="rg-bubble rg-bubble-business">
          <p className="rg-bubble-body">{request.body}</p>
        </div>

        <ol className="rg-stages">
          {stages.map((stage, i) => (
            <li
              key={stage.id}
              className={
                "rg-stage" +
                (rank >= i ? " is-active" : "") +
                (rank > i ? " is-done" : "")
              }
            >
              <span className="rg-stage-icon">{stage.icon}</span>
              <span className="rg-stage-label">{stage.label}</span>
            </li>
          ))}
        </ol>

        {status === "opened" && (
          <p className="rg-done-note">
            Read. Now the important part — what she says next decides what
            happens.
          </p>
        )}
      </div>
    </div>
  );
};

export default RequestStep;

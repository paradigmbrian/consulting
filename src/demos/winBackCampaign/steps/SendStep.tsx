import { useEffect, useRef } from "react";
import { FaPaperPlane, FaCheck, FaEnvelopeOpen, FaInbox } from "react-icons/fa";
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
  const patientId = provider.getFeaturedPatientId();
  const message = provider.getMessage(patientId);
  const results = provider.getResults();
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
    { id: "opened", label: "Opened", icon: <FaEnvelopeOpen /> },
  ];

  return (
    <div className="wb-step">
      <h3 className="wb-heading">Send the campaign</h3>
      <p className="wb-sub">
        {results.contacted.toLocaleString()} messages go out. Here's the
        featured patient's message moving through the lifecycle.
      </p>

      <div className="wb-outbox">
        <div className="wb-envelope">
          <FaInbox className="wb-envelope-icon" />
          <p className="wb-envelope-body">{message.body}</p>
        </div>

        <ol className="wb-stages">
          {stages.map((stage, i) => (
            <li
              key={stage.id}
              className={
                "wb-stage" +
                (rank >= i ? " is-active" : "") +
                (rank > i ? " is-done" : "")
              }
            >
              <span className="wb-stage-icon">{stage.icon}</span>
              <span className="wb-stage-label">{stage.label}</span>
            </li>
          ))}
        </ol>

        {status === "opened" && (
          <p className="wb-done-note">
            Opened — when a lapsed patient engages, that's your booking signal.
            Continue to see what comes back.
          </p>
        )}
      </div>
    </div>
  );
};

export default SendStep;

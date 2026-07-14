import { useEffect, useRef } from "react";
import { FaPaperPlane, FaCheck, FaEnvelopeOpenText } from "react-icons/fa";
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

const DeliverStep = ({ provider }: { provider: WorkflowProvider }) => {
  const delivery = provider.getDelivery();
  const { status, start } = useSendLifecycle();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    start();
  }, [start]);

  const rank = statusRank(status);
  const lifecycle = [
    { id: "sending", label: "Sending", icon: <FaPaperPlane /> },
    { id: "delivered", label: "Delivered", icon: <FaCheck /> },
    { id: "opened", label: "Read", icon: <FaEnvelopeOpenText /> },
  ];

  return (
    <div className="wr-step">
      <h3 className="wr-heading">It lands Sunday evening — and gets read</h3>
      <p className="wr-sub">
        The digest goes out as a text and email to {delivery.recipientName}. No
        login, no dashboard — just the week, in about 30 seconds.
      </p>

      <div className="wr-deliver">
        <div className="wr-deliver-meta">
          <span className="wr-deliver-to">To {delivery.recipientName}</span>
          <span className="wr-deliver-channel">
            {delivery.channel} · {delivery.sentLabel}
          </span>
        </div>

        <ol className="wr-lifecycle">
          {lifecycle.map((stage, i) => (
            <li
              key={stage.id}
              className={
                "wr-life" +
                (rank >= i ? " is-active" : "") +
                (rank > i ? " is-done" : "")
              }
            >
              <span className="wr-life-icon">{stage.icon}</span>
              <span className="wr-life-label">{stage.label}</span>
            </li>
          ))}
        </ol>

        {status === "opened" && (
          <p className="wr-deliver-note">
            Read in 32 seconds. The owner knows the week — without chasing it.
          </p>
        )}
      </div>
    </div>
  );
};

export default DeliverStep;

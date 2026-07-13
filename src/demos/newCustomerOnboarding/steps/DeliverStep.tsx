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
    <div className="nco-step">
      <h3 className="nco-heading">
        It reaches the customer — minutes after booking
      </h3>
      <p className="nco-sub">
        The welcome and packet link go out to {delivery.recipientName} as a text
        and an email. No waiting, no owner effort — just a warm start.
      </p>

      <div className="nco-deliver">
        <div className="nco-deliver-meta">
          <span className="nco-deliver-to">To {delivery.recipientName}</span>
          <span className="nco-deliver-channel">
            {delivery.channel} · {delivery.sentLabel}
          </span>
        </div>

        <ol className="nco-lifecycle">
          {lifecycle.map((stage, i) => (
            <li
              key={stage.id}
              className={
                "nco-life" +
                (rank >= i ? " is-active" : "") +
                (rank > i ? " is-done" : "")
              }
            >
              <span className="nco-life-icon">{stage.icon}</span>
              <span className="nco-life-label">{stage.label}</span>
            </li>
          ))}
        </ol>

        {status === "opened" && (
          <p className="nco-deliver-note">
            Opened and read. {delivery.recipientName} feels taken care of before
            anyone's even shown up.
          </p>
        )}
      </div>
    </div>
  );
};

export default DeliverStep;

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

const NotifyStep = ({ provider }: { provider: WorkflowProvider }) => {
  const notify = provider.getNotify();
  const { status, start } = useSendLifecycle();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    start();
  }, [start]);

  const rank = statusRank(status);
  const lifecycle = [
    { id: "sending", label: "Sending", icon: <FaPaperPlane aria-hidden="true" /> },
    { id: "delivered", label: "Delivered", icon: <FaCheck aria-hidden="true" /> },
    {
      id: "opened",
      label: "Read",
      icon: <FaEnvelopeOpenText aria-hidden="true" />,
    },
  ];

  return (
    <div className="jd-step">
      <h3 className="jd-heading">
        Every customer gets an ETA — before the van pulls up
      </h3>
      <p className="jd-sub">
        The moment routes are set, each customer gets a text with who's coming
        and when. Here's the emergency going out to {notify.recipientName}.
      </p>

      <div className="jd-notify">
        <div className="jd-notify-meta">
          <span className="jd-notify-to">To {notify.recipientName}</span>
          <span className="jd-notify-channel">
            {notify.channel} · {notify.sentLabel}
          </span>
        </div>

        <p className="jd-notify-message">{notify.message}</p>

        <ol className="jd-lifecycle">
          {lifecycle.map((stage, i) => (
            <li
              key={stage.id}
              className={
                "jd-life" +
                (rank >= i ? " is-active" : "") +
                (rank > i ? " is-done" : "")
              }
            >
              <span className="jd-life-icon">{stage.icon}</span>
              <span className="jd-life-label">{stage.label}</span>
            </li>
          ))}
        </ol>

        {status === "opened" && (
          <p className="jd-notify-note">
            Read. {notify.recipientName} knows help is on the way — before
            anyone's even shown up.
          </p>
        )}
      </div>
    </div>
  );
};

export default NotifyStep;

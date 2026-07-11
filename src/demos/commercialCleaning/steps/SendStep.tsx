import { useEffect, useRef } from "react";
import { FaPaperPlane, FaInbox, FaCheck, FaEnvelopeOpen } from "react-icons/fa";
import type { WorkflowProvider } from "../types";
import { useSendLifecycle, type SendStatus } from "../../shared/SendLifecycleProvider";
import "./SendStep.css";

const ORDER: SendStatus[] = ["sending", "delivered", "opened"];

function statusRank(s: SendStatus): number {
  if (s === "idle") return -1;
  if (s === "replied") return ORDER.length - 1; // treat as "opened or beyond"
  return ORDER.indexOf(s);
}

const SendStep = ({ provider }: { provider: WorkflowProvider }) => {
  const prospectId = provider.getFeaturedProspectId();
  const enrichment = provider.getEnrichment(prospectId);
  const email = provider.getEmail(prospectId);
  const { status: sendStatus, start: startSend } = useSendLifecycle();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    // Fire-and-forget mocked network send; the timed lifecycle is driven by the controller.
    void provider.send(email);
    startSend();
  }, [provider, email, startSend]);

  const rank = statusRank(sendStatus);

  const stages = [
    { id: "sending", label: "Sending", icon: <FaPaperPlane /> },
    { id: "delivered", label: "Delivered", icon: <FaCheck /> },
    { id: "opened", label: "Opened", icon: <FaEnvelopeOpen /> },
  ];

  return (
    <div className="send-step">
      <h2 className="step-heading">Step 5 — Send</h2>
      <p className="step-sub">
        The email goes out to {enrichment.contactName}. Watch it move through
        the lifecycle — sent, delivered, opened.
      </p>

      <div className="send-outbox">
        <div className="send-envelope">
          <FaInbox className="send-envelope-icon" />
          <div>
            <p className="send-envelope-to">{enrichment.email}</p>
            <p className="send-envelope-subject">{email.subject}</p>
          </div>
        </div>

        <ol className="send-stages">
          {stages.map((stage, i) => (
            <li
              key={stage.id}
              className={
                "send-stage" +
                (rank >= i ? " is-active" : "") +
                (rank > i ? " is-done" : "")
              }
            >
              <span className="send-stage-icon">{stage.icon}</span>
              <span className="send-stage-label">{stage.label}</span>
            </li>
          ))}
        </ol>

        {sendStatus === "opened" && (
          <p className="send-done-note">
            Opened — when a prospect engages, that's your signal. Continue to see
            what comes back.
          </p>
        )}
      </div>
    </div>
  );
};

export default SendStep;

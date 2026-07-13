import { useState } from "react";
import { FaCheck, FaClock } from "react-icons/fa";
import type { WorkflowProvider, PacketStatus } from "../types";
import { usePrefersReducedMotion } from "../../shared/usePrefersReducedMotion";
import AiPanel from "../../shared/AiPanel";

const STATUS_LABEL: Record<PacketStatus, string> = {
  ready: "Ready",
  collected: "On file",
  requested: "Requested",
};

const PacketStep = ({ provider }: { provider: WorkflowProvider }) => {
  const packet = provider.getPacket();
  const reasoning = provider.getAiReasoning("packet");
  const reduced = usePrefersReducedMotion();
  const [revealed, setRevealed] = useState(reduced);

  return (
    <div className="nco-step">
      <h3 className="nco-heading">
        It assembles exactly what this customer needs
      </h3>
      <p className="nco-sub">
        Claude sorts what's already known from what only the customer can
        provide — then turns the gaps into one-tap requests. Nothing gets chased
        by hand.
      </p>

      <AiPanel
        title={reasoning.title}
        lines={reasoning.lines}
        onComplete={() => setRevealed(true)}
      />

      <div className={"nco-reveal" + (revealed ? " is-shown" : "")}>
        <div className="nco-packet">
          {packet.map((item) => (
            <div key={item.label} className="nco-packet-item">
              <div className="nco-packet-main">
                <span className="nco-packet-label">{item.label}</span>
                <span className="nco-packet-detail">{item.detail}</span>
              </div>
              <span className={"nco-pill nco-pill-" + item.status}>
                {item.status === "requested" ? (
                  <FaClock aria-hidden="true" />
                ) : (
                  <FaCheck aria-hidden="true" />
                )}
                {STATUS_LABEL[item.status]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PacketStep;

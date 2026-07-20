import { useState } from "react";
import { FaTag, FaCommentDots } from "react-icons/fa";
import type { WorkflowProvider } from "../types";
import { usePrefersReducedMotion } from "../../shared/usePrefersReducedMotion";
import AiPanel from "../../shared/AiPanel";

const CraftOfferStep = ({ provider }: { provider: WorkflowProvider }) => {
  const offer = provider.getOffer();
  const featuredId = provider.getFeaturedPatientId();
  const message = provider.getMessage(featuredId);
  const reasoning = provider.getAiReasoning("offer");
  const reduced = usePrefersReducedMotion();
  const [revealed, setRevealed] = useState(reduced);

  return (
    <div className="wb-step">
      <h3 className="wb-heading">Craft the offer &amp; the message</h3>
      <p className="wb-sub">
        The AI picks an offer worth booking and writes short, compliant copy —
        personalized per patient.
      </p>

      <AiPanel
        title={reasoning.title}
        lines={reasoning.lines}
        onComplete={() => setRevealed(true)}
      />

      <div className={"wb-reveal" + (revealed ? " is-shown" : "")}>
        <div className="wb-offer">
          <FaTag className="wb-offer-icon" />
          <div>
            <p className="wb-offer-headline">{offer.headline}</p>
            <p className="wb-offer-detail">{offer.detail}</p>
            <p className="wb-offer-channel">Channel: {offer.channel}</p>
          </div>
        </div>

        <div className="wb-message">
          <div className="wb-message-head">
            <FaCommentDots />
            <span>Drafted {message.channel} — featured patient</span>
          </div>
          <p className="wb-message-body">{message.body}</p>
        </div>
      </div>
    </div>
  );
};

export default CraftOfferStep;

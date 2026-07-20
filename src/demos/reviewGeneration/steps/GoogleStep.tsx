import { useState } from "react";
import { FaStar, FaGoogle, FaCheckCircle } from "react-icons/fa";
import type { WorkflowProvider } from "../types";
import { usePrefersReducedMotion } from "../../shared/usePrefersReducedMotion";
import AiPanel from "../../shared/AiPanel";

const GoogleStep = ({ provider }: { provider: WorkflowProvider }) => {
  const review = provider.getGoogleReview();
  const reasoning = provider.getAiReasoning("draft");
  const reduced = usePrefersReducedMotion();
  const [revealed, setRevealed] = useState(reduced);

  const firstName = review.clientName.split(" ")[0];
  const stars = Array.from({ length: review.stars }, (_, i) => i);

  return (
    <div className="rg-step">
      <h3 className="rg-heading">One tap to a public 5-star review</h3>
      <p className="rg-sub">
        The AI drafts the review in {firstName}'s voice and sends a one-tap
        link. She just taps post.
      </p>

      <AiPanel
        title={reasoning.title}
        lines={reasoning.lines}
        onComplete={() => setRevealed(true)}
      />

      <div className={"rg-reveal" + (revealed ? " is-shown" : "")}>
        <div className="rg-review">
          <div className="rg-review-head">
            <FaGoogle className="rg-review-google" />
            <span className="rg-review-on">Posted to Google</span>
            <span className="rg-review-badge">
              <FaCheckCircle /> Live
            </span>
          </div>
          <div className="rg-review-stars">
            {stars.map((i) => (
              <FaStar key={i} className="rg-review-star" />
            ))}
          </div>
          <p className="rg-review-body">"{review.suggestedBody}"</p>
          <p className="rg-review-author">— {review.clientName}</p>
        </div>
      </div>
    </div>
  );
};

export default GoogleStep;

import { useState } from "react";
import type { WorkflowProvider } from "../types";
import { usePrefersReducedMotion } from "../../shared/usePrefersReducedMotion";
import AiPanel from "../../shared/AiPanel";
import QuoteCard from "./QuoteCard";

const BuildStep = ({ provider }: { provider: WorkflowProvider }) => {
  const quote = provider.getQuote();
  const reasoning = provider.getAiReasoning("build");
  const reduced = usePrefersReducedMotion();
  const [revealed, setRevealed] = useState(reduced);

  return (
    <div className="qt-step">
      <h3 className="qt-heading">It builds the quote, line by line</h3>
      <p className="qt-sub">
        Claude prices each piece from the shop's rate card and totals it — an
        itemized estimate, not a templated guess.
      </p>

      <AiPanel
        title={reasoning.title}
        lines={reasoning.lines}
        onComplete={() => setRevealed(true)}
      />

      <div className={"qt-reveal" + (revealed ? " is-shown" : "")}>
        <QuoteCard quote={quote} />
      </div>
    </div>
  );
};

export default BuildStep;

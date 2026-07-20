import { useEffect, useRef, useState } from "react";
import { FaMagic } from "react-icons/fa";
import type { WorkflowProvider } from "../types";
import { usePrefersReducedMotion } from "../../shared/usePrefersReducedMotion";
import AiPanel from "../../shared/AiPanel";
import "./PersonalizeStep.css";

const CHARS_PER_TICK = 4;
const TICK_MS = 16;

const PersonalizeStep = ({ provider }: { provider: WorkflowProvider }) => {
  const prospectId = provider.getFeaturedProspectId();
  const email = provider.getEmail(prospectId);
  const enrichment = provider.getEnrichment(prospectId);
  const ai = provider.getAiReasoning("personalize");
  const reduced = usePrefersReducedMotion();

  // The email types in only after the AI's reasoning finishes.
  const [reasoningDone, setReasoningDone] = useState(reduced);
  const [typed, setTyped] = useState(reduced ? email.body.length : 0);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (reduced) {
      setTyped(email.body.length);
      return;
    }
    if (!reasoningDone) return;
    setTyped(0);
    timer.current = window.setInterval(() => {
      setTyped((n) => {
        const next = n + CHARS_PER_TICK;
        if (next >= email.body.length && timer.current !== null) {
          window.clearInterval(timer.current);
          timer.current = null;
          return email.body.length;
        }
        return next;
      });
    }, TICK_MS);
    return () => {
      if (timer.current !== null) window.clearInterval(timer.current);
    };
  }, [email.body.length, reduced, reasoningDone]);

  const isDone = typed >= email.body.length;

  return (
    <div className="personalize-step">
      <h2 className="step-heading">Step 4 — Personalize the outreach</h2>
      <p className="step-sub">
        For each qualified prospect, a tailored cold email is written —
        referencing specifics about them, not a generic blast. Here's{" "}
        {enrichment.contactName} at the top of the list.
      </p>

      <AiPanel
        title={ai.title}
        lines={ai.lines}
        onComplete={() => setReasoningDone(true)}
      />

      <div className="email-card">
        <div className="email-meta">
          <p>
            <span className="email-label">To:</span> {enrichment.contactName}{" "}
            &lt;{enrichment.email}&gt;
          </p>
          <p>
            <span className="email-label">Subject:</span> {email.subject}
          </p>
          <p className="email-drafted">
            <FaMagic className="email-drafted-icon" aria-hidden="true" /> Drafted
            by AI
          </p>
        </div>
        <pre className={"email-body" + (isDone ? "" : " is-typing")}>
          {email.body.slice(0, typed)}
        </pre>
        <p className="email-footer">{email.footer}</p>
      </div>
    </div>
  );
};

export default PersonalizeStep;

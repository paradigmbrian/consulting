import { useEffect, useRef, useState } from "react";
import { FaReply } from "react-icons/fa";
import type { WorkflowProvider } from "../types";
import { useDemo } from "../DemoController";
import { usePrefersReducedMotion } from "../usePrefersReducedMotion";
import "./ResultsStep.css";

const REPLY_DELAY_MS = 700;

const ResultsStep = ({ provider }: { provider: WorkflowProvider }) => {
  const prospectId = provider.getFeaturedProspectId();
  const reply = provider.getReply(prospectId);
  const results = provider.getResults();
  const { markReplied } = useDemo();
  const reduced = usePrefersReducedMotion();
  const [showReply, setShowReply] = useState(reduced);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (reduced) {
      setShowReply(true);
      markReplied();
      return;
    }
    timer.current = window.setTimeout(() => {
      setShowReply(true);
      markReplied();
    }, REPLY_DELAY_MS);
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, [reduced, markReplied]);

  return (
    <div className="results-step">
      <h2 className="step-heading">Step 6 — Reply &amp; results</h2>
      <p className="step-sub">
        {reply.receivedLabel}, a reply lands in the inbox.
      </p>

      <div className={"reply-card" + (showReply ? " is-shown" : "")}>
        <div className="reply-head">
          <FaReply className="reply-icon" />
          <div>
            <p className="reply-from">{reply.fromName}</p>
            <p className="reply-subject">{reply.subject}</p>
          </div>
        </div>
        <pre className="reply-body">{reply.body}</pre>
      </div>

      <div className="results-tally">
        <div className="tally-item">
          <span className="tally-num">{results.sent}</span>
          <span className="tally-label">Sent</span>
        </div>
        <div className="tally-item">
          <span className="tally-num">{results.opened}</span>
          <span className="tally-label">Opened</span>
        </div>
        <div className="tally-item tally-item-hl">
          <span className="tally-num">{results.replied}</span>
          <span className="tally-label">Replied</span>
        </div>
      </div>

      <p className="results-takeaway">{results.takeaway}</p>
    </div>
  );
};

export default ResultsStep;

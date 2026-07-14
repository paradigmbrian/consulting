import { useEffect, useRef, useState } from "react";
import { FaBolt, FaCheckCircle } from "react-icons/fa";
import type { WorkflowProvider } from "../types";
import { usePrefersReducedMotion } from "../../shared/usePrefersReducedMotion";

const ACT_DELAY_MS = 1100;

const ActStep = ({ provider }: { provider: WorkflowProvider }) => {
  const action = provider.getDigest().recommendedAction;
  const result = provider.getActionResult();
  const reduced = usePrefersReducedMotion();
  const [fired, setFired] = useState(reduced);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (reduced) {
      setFired(true);
      return;
    }
    timer.current = window.setTimeout(() => setFired(true), ACT_DELAY_MS);
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, [reduced]);

  const fire = () => {
    if (timer.current !== null) window.clearTimeout(timer.current);
    setFired(true);
  };

  return (
    <div className="wr-step">
      <h3 className="wr-heading">One tap — and the report drives a decision</h3>
      <p className="wr-sub">
        The report doesn't just inform. Its recommended action is a single tap,
        right from the text — so the week's one real risk gets handled on the
        spot.
      </p>

      <div className="wr-act">
        <button
          type="button"
          className={"wr-act-btn" + (fired ? " is-fired" : "")}
          onClick={fire}
          disabled={fired}
        >
          <FaBolt aria-hidden="true" />
          {fired ? "Sent" : action.actionLabel}
        </button>

        <div className={"wr-act-confirm" + (fired ? " is-shown" : "")}>
          <FaCheckCircle className="wr-act-confirm-icon" aria-hidden="true" />
          <div>
            <p className="wr-act-confirm-title">{result.confirmation}</p>
            <p className="wr-act-confirm-detail">{result.detail}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActStep;

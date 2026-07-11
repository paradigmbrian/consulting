import { useEffect, useRef, useState } from "react";
import { FaMapMarkerAlt, FaGlobe } from "react-icons/fa";
import type { WorkflowProvider } from "../types";
import { usePrefersReducedMotion } from "../usePrefersReducedMotion";
import AiPanel from "../AiPanel";
import "./DiscoverStep.css";

const REVEAL_INTERVAL_MS = 350;

const DiscoverStep = ({ provider }: { provider: WorkflowProvider }) => {
  const targets = provider.getTargets();
  const ai = provider.getAiReasoning("discover");
  const reduced = usePrefersReducedMotion();
  const [revealed, setRevealed] = useState(reduced ? targets.length : 0);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (reduced) {
      setRevealed(targets.length);
      return;
    }
    setRevealed(0);
    for (let i = 1; i <= targets.length; i++) {
      timers.current.push(
        window.setTimeout(() => setRevealed(i), REVEAL_INTERVAL_MS * i),
      );
    }
    const snapshot = timers.current;
    return () => snapshot.forEach((id) => window.clearTimeout(id));
  }, [targets.length, reduced]);

  return (
    <div className="discover-step">
      <h2 className="step-heading">Step 2 — Discover local businesses</h2>
      <p className="step-sub">
        The workflow scans the service area and surfaces facilities that match
        the buy-signals — physical location, no in-house janitorial, inside the
        radius.
      </p>

      <AiPanel title={ai.title} lines={ai.lines} />

      <p className="discover-count">
        {revealed} / {targets.length} matched
      </p>

      <ul className="discover-list">
        {targets.map((p, i) => (
          <li
            key={p.id}
            className={
              "discover-card" + (i < revealed ? " is-revealed" : "")
            }
          >
            <div className="discover-card-head">
              <h3>{p.name}</h3>
              <span className="discover-type">{p.facilityType}</span>
            </div>
            <p className="discover-meta">
              <FaMapMarkerAlt /> {p.address}
            </p>
            <p className="discover-meta">
              <FaGlobe /> {p.website}
            </p>
            <ul className="discover-signals">
              {p.matchSignals.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DiscoverStep;

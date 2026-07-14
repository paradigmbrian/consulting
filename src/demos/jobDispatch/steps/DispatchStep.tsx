import { useEffect, useState } from "react";
import { FaTruck, FaCheckCircle } from "react-icons/fa";
import type { WorkflowProvider } from "../types";
import { usePrefersReducedMotion } from "../../shared/usePrefersReducedMotion";

const ACCEPT_DELAY_MS = 600;

const DispatchStep = ({ provider }: { provider: WorkflowProvider }) => {
  const dispatch = provider.getDispatch();
  const reduced = usePrefersReducedMotion();
  const total = dispatch.crew.length;
  const [accepted, setAccepted] = useState(reduced ? total : 0);

  useEffect(() => {
    if (reduced) {
      setAccepted(total);
      return;
    }
    setAccepted(0);
    const timers: number[] = [];
    for (let i = 1; i <= total; i++) {
      timers.push(
        window.setTimeout(() => setAccepted(i), ACCEPT_DELAY_MS * i),
      );
    }
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [reduced, total]);

  return (
    <div className="jd-step">
      <h3 className="jd-heading">It pushes every route to the crew</h3>
      <p className="jd-sub">
        Each tech gets their stops, addresses, and job notes on their phone — and
        taps to accept. No radio calls, no paper run sheets.
      </p>

      <div className="jd-dispatch">
        <div className="jd-dispatch-head">
          <FaTruck aria-hidden="true" /> {dispatch.headline}
        </div>
        <div className="jd-crew">
          {dispatch.crew.map((c, i) => {
            const isAccepted = i < accepted;
            return (
              <div
                key={c.techName}
                className={"jd-crew-row" + (isAccepted ? " is-accepted" : "")}
              >
                <span className="jd-crew-name">{c.techName}</span>
                <span className="jd-crew-stops">{c.stops}</span>
                <span className="jd-crew-status">
                  {isAccepted ? (
                    <>
                      <FaCheckCircle aria-hidden="true" /> Accepted
                    </>
                  ) : (
                    "Sending…"
                  )}
                </span>
              </div>
            );
          })}
        </div>
        <p className="jd-dispatch-note">{dispatch.note}</p>
      </div>
    </div>
  );
};

export default DispatchStep;

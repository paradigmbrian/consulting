import { useEffect, useState } from "react";
import { FaSyncAlt, FaCheckCircle } from "react-icons/fa";
import type { WorkflowProvider } from "../types";
import { usePrefersReducedMotion } from "../../shared/usePrefersReducedMotion";

const SYNC_DELAY_MS = 600;

const PushStep = ({ provider }: { provider: WorkflowProvider }) => {
  const sync = provider.getSyncResult();
  const reduced = usePrefersReducedMotion();
  const total = sync.rows.length;
  const [synced, setSynced] = useState(reduced ? total : 0);

  useEffect(() => {
    if (reduced) {
      setSynced(total);
      return;
    }
    setSynced(0);
    const timers: number[] = [];
    for (let i = 1; i <= total; i++) {
      timers.push(window.setTimeout(() => setSynced(i), SYNC_DELAY_MS * i));
    }
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [reduced, total]);

  return (
    <div className="tts-step">
      <h3 className="tts-heading">It writes the record to all four tools</h3>
      <p className="tts-sub">
        With everything shaped and de-duplicated, the records go out to each app
        at once — no copy-paste, no tab-switching.
      </p>

      <div className="tts-sync">
        <div className="tts-sync-head">
          <FaSyncAlt aria-hidden="true" /> {sync.headline}
        </div>
        <div className="tts-sync-rows">
          {sync.rows.map((r, i) => {
            const isSynced = i < synced;
            return (
              <div
                key={r.toolName}
                className={"tts-sync-row" + (isSynced ? " is-synced" : "")}
              >
                <span className="tts-sync-tool">{r.toolName}</span>
                <span className="tts-sync-detail">{r.detail}</span>
                <span className="tts-sync-status">
                  {isSynced ? (
                    <>
                      <FaCheckCircle aria-hidden="true" /> Synced
                    </>
                  ) : (
                    "Writing…"
                  )}
                </span>
              </div>
            );
          })}
        </div>
        <p className="tts-sync-note">{sync.note}</p>
      </div>
    </div>
  );
};

export default PushStep;

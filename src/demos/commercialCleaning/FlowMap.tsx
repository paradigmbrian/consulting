import { useEffect, useRef } from "react";
import { FaCheck, FaMagic } from "react-icons/fa";
import { useDemo, STEPS, type StepId } from "./DemoController";
import { STEP_META, AI_STEPS } from "./stepMeta";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";
import FlowAiLane from "./FlowAiLane";
import "./FlowMap.css";

type ConnState = "done" | "active" | "idle";

function Connector({ state }: { state: ConnState }) {
  return (
    <svg
      className={`flow-conn flow-conn-${state}`}
      width="48"
      height="24"
      viewBox="0 0 48 24"
      aria-hidden="true"
    >
      <line x1="0" y1="12" x2="48" y2="12" className="flow-conn-line" />
    </svg>
  );
}

const FlowMap = () => {
  const { stepIndex, goTo } = useDemo();
  const reduced = usePrefersReducedMotion();
  const containerRef = useRef<HTMLElement | null>(null);
  const activeRef = useRef<HTMLButtonElement | null>(null);
  const aiNodeRefs = useRef<Partial<Record<StepId, HTMLButtonElement | null>>>(
    {},
  );

  useEffect(() => {
    const el = activeRef.current;
    if (!el) return;
    el.scrollIntoView({
      inline: "center",
      block: "nearest",
      behavior: reduced ? "auto" : "smooth",
    });
  }, [stepIndex, reduced]);

  const setNodeRef =
    (id: StepId, isActive: boolean) => (el: HTMLButtonElement | null) => {
      if (isActive) activeRef.current = el;
      if (AI_STEPS.includes(id)) aiNodeRefs.current[id] = el;
    };

  return (
    <nav className="flow-map" aria-label="Workflow steps" ref={containerRef}>
      <ol className="flow-track">
        {STEPS.map((id, i) => {
          const { label, Icon } = STEP_META[id];
          const status =
            i < stepIndex ? "done" : i === stepIndex ? "active" : "upcoming";
          const connState: ConnState =
            i < stepIndex ? "done" : i === stepIndex ? "active" : "idle";
          const isAi = AI_STEPS.includes(id);
          return (
            <li key={id} className="flow-item">
              {i > 0 && <Connector state={connState} />}
              <button
                type="button"
                ref={setNodeRef(id, i === stepIndex)}
                className={`flow-node flow-node-${status}`}
                onClick={() => goTo(i)}
                aria-current={i === stepIndex ? "step" : undefined}
                aria-label={`Step ${i + 1}: ${label}`}
              >
                {isAi && (
                  <span className="flow-node-ai-mark" aria-hidden="true">
                    <FaMagic />
                  </span>
                )}
                <span className="flow-node-badge">
                  {i < stepIndex ? <FaCheck /> : <Icon />}
                </span>
                <span className="flow-node-label">{label}</span>
              </button>
            </li>
          );
        })}
      </ol>

      <FlowAiLane
        containerRef={containerRef}
        aiNodeRefs={aiNodeRefs}
        activeStepId={STEPS[stepIndex]}
      />

      <p className="flow-ai-caption">
        <FaMagic aria-hidden="true" /> Powered by Claude
      </p>
    </nav>
  );
};

export default FlowMap;

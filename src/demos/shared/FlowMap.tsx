import { useEffect, useRef } from "react";
import { FaCheck, FaMagic } from "react-icons/fa";
import { useDemo } from "./DemoController";
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
  const { steps, stepIndex, goTo } = useDemo();
  const reduced = usePrefersReducedMotion();
  const containerRef = useRef<HTMLElement | null>(null);
  const activeRef = useRef<HTMLButtonElement | null>(null);
  const aiNodeRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const aiStepIds = steps.filter((s) => s.isAi).map((s) => s.id);

  useEffect(() => {
    activeRef.current?.scrollIntoView({
      inline: "center",
      block: "nearest",
      behavior: reduced ? "auto" : "smooth",
    });
  }, [stepIndex, reduced]);

  const setNodeRef =
    (id: string, isActive: boolean) => (el: HTMLButtonElement | null) => {
      if (isActive) activeRef.current = el;
      if (aiStepIds.includes(id)) aiNodeRefs.current[id] = el;
    };

  return (
    <nav className="flow-map" aria-label="Workflow steps" ref={containerRef}>
      <ol className="flow-track">
        {steps.map((step, i) => {
          const status =
            i < stepIndex ? "done" : i === stepIndex ? "active" : "upcoming";
          const connState: ConnState =
            i < stepIndex ? "done" : i === stepIndex ? "active" : "idle";
          const Icon = step.Icon;
          return (
            <li key={step.id} className="flow-item">
              {i > 0 && <Connector state={connState} />}
              <button
                type="button"
                ref={setNodeRef(step.id, i === stepIndex)}
                className={`flow-node flow-node-${status}`}
                onClick={() => goTo(i)}
                aria-current={i === stepIndex ? "step" : undefined}
                aria-label={`Step ${i + 1}: ${step.label}`}
              >
                {step.isAi && (
                  <span className="flow-node-ai-mark" aria-hidden="true">
                    <FaMagic />
                  </span>
                )}
                <span className="flow-node-badge">
                  {i < stepIndex ? <FaCheck /> : <Icon />}
                </span>
                <span className="flow-node-label">{step.label}</span>
              </button>
            </li>
          );
        })}
      </ol>

      {aiStepIds.length > 0 && (
        <>
          <FlowAiLane
            containerRef={containerRef}
            aiNodeRefs={aiNodeRefs}
            aiStepIds={aiStepIds}
            activeStepId={steps[stepIndex].id}
          />
          <p className="flow-ai-caption">
            <FaMagic aria-hidden="true" /> Powered by Claude
          </p>
        </>
      )}
    </nav>
  );
};

export default FlowMap;

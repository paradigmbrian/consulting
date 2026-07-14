import { useEffect, useRef } from "react";
import { FaCheck, FaMagic } from "react-icons/fa";
import { useDemo } from "./DemoController";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";
import "./FlowMap.css";

const FlowMap = () => {
  const { steps, stepIndex, goTo } = useDemo();
  const reduced = usePrefersReducedMotion();
  const activeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({
      block: "nearest",
      inline: "nearest",
      behavior: reduced ? "auto" : "smooth",
    });
  }, [stepIndex, reduced]);

  return (
    <nav className="flow-map" aria-label="Workflow steps">
      <ol className="flow-track">
        {steps.map((step, i) => {
          const status =
            i < stepIndex ? "done" : i === stepIndex ? "active" : "upcoming";
          const Icon = step.Icon;
          return (
            <li key={step.id} className="flow-item">
              <button
                type="button"
                ref={i === stepIndex ? activeRef : undefined}
                className={`flow-node flow-node-${status}`}
                onClick={() => goTo(i)}
                aria-current={i === stepIndex ? "step" : undefined}
                aria-label={`Step ${i + 1}: ${step.label}`}
              >
                <span className="flow-node-badge">
                  {i < stepIndex ? <FaCheck /> : <Icon />}
                </span>
                <span className="flow-node-label">{step.label}</span>
                {step.isAi && (
                  <span className="flow-node-ai-mark" aria-label="AI-powered">
                    <FaMagic />
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default FlowMap;

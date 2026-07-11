import { useEffect, useRef, useState, type RefObject } from "react";
import { FaMagic } from "react-icons/fa";
import type { StepId } from "./DemoController";
import { AI_STEPS } from "./stepMeta";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";
import "./FlowAiLane.css";

interface Point {
  x: number;
  y: number;
}

interface Edge {
  id: StepId;
  from: Point; // Claude node (top-center)
  to: Point; // AI step node (bottom-center)
}

interface FlowAiLaneProps {
  containerRef: RefObject<HTMLElement | null>;
  aiNodeRefs: RefObject<Partial<Record<StepId, HTMLButtonElement | null>>>;
  activeStepId: StepId;
}

const FlowAiLane = ({
  containerRef,
  aiNodeRefs,
  activeStepId,
}: FlowAiLaneProps) => {
  const reduced = usePrefersReducedMotion();
  const claudeRef = useRef<HTMLDivElement | null>(null);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const container = containerRef.current;
    const claude = claudeRef.current;
    if (!container || !claude) return;

    const measure = () => {
      const cont = container.getBoundingClientRect();
      const c = claude.getBoundingClientRect();
      const from: Point = {
        x: c.left - cont.left + c.width / 2,
        y: c.top - cont.top,
      };
      const next: Edge[] = [];
      for (const id of AI_STEPS) {
        const el = aiNodeRefs.current?.[id];
        if (!el) continue;
        const r = el.getBoundingClientRect();
        next.push({
          id,
          from,
          to: {
            x: r.left - cont.left + r.width / 2,
            y: r.bottom - cont.top,
          },
        });
      }
      setEdges(next);
      setSize({ w: cont.width, h: cont.height });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(container);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [containerRef, aiNodeRefs]);

  return (
    <>
      <svg
        className="flow-ai-edges"
        width={size.w}
        height={size.h}
        aria-hidden="true"
      >
        {edges.map((e) => {
          const midY = (e.to.y + e.from.y) / 2;
          const d = `M ${e.to.x} ${e.to.y} C ${e.to.x} ${midY}, ${e.from.x} ${midY}, ${e.from.x} ${e.from.y}`;
          const active = e.id === activeStepId && !reduced;
          return (
            <path
              key={e.id}
              d={d}
              className={"flow-ai-edge" + (active ? " is-active" : "")}
            />
          );
        })}
      </svg>
      <div className="flow-ai-lane">
        <div className="flow-ai-node" ref={claudeRef}>
          <span className="flow-ai-badge" aria-hidden="true">
            <FaMagic />
          </span>
          <span className="flow-ai-label">Claude</span>
          <span className="flow-ai-sub">Anthropic</span>
        </div>
      </div>
    </>
  );
};

export default FlowAiLane;

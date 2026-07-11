import { useEffect, useRef, useState } from "react";
import { FaMagic } from "react-icons/fa";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";
import "./AiPanel.css";

const LINE_INTERVAL_MS = 550;

interface AiPanelProps {
  title: string;
  lines: string[];
  animate?: boolean;
  onComplete?: () => void;
}

const AiPanel = ({ title, lines, animate = true, onComplete }: AiPanelProps) => {
  const reduced = usePrefersReducedMotion();
  const instant = reduced || !animate;
  const [shown, setShown] = useState(instant ? lines.length : 0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (instant) {
      setShown(lines.length);
      onCompleteRef.current?.();
      return;
    }
    setShown(0);
    const timers: number[] = [];
    for (let i = 1; i <= lines.length; i++) {
      timers.push(
        window.setTimeout(() => {
          setShown(i);
          if (i === lines.length) onCompleteRef.current?.();
        }, LINE_INTERVAL_MS * i),
      );
    }
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [lines.length, instant]);

  const working = shown < lines.length;

  return (
    <div className="ai-panel">
      <div className="ai-panel-head">
        <span className="ai-panel-badge" aria-hidden="true">
          <FaMagic />
        </span>
        <span className="ai-panel-title">{title}</span>
        <span
          className={"ai-panel-state" + (working ? " is-working" : " is-done")}
          aria-live="polite"
        >
          {working ? "working…" : "done"}
        </span>
      </div>
      <ul className="ai-panel-lines">
        {lines.map((line, i) => (
          <li
            key={line}
            className={"ai-panel-line" + (i < shown ? " is-shown" : "")}
          >
            {line}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AiPanel;

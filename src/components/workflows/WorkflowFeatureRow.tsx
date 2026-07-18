import type { ReactNode } from "react";

interface WorkflowFeatureRowProps {
  eyebrow?: string;
  title: string;
  body: string;
  visual: ReactNode;
  flip?: boolean;
}

const WorkflowFeatureRow = ({
  eyebrow,
  title,
  body,
  visual,
  flip = false,
}: WorkflowFeatureRowProps) => (
  <div className={flip ? "wf-feature-row wf-feature-row-flip" : "wf-feature-row"}>
    <div className="wf-feature-copy">
      {eyebrow && <p className="wf-eyebrow">{eyebrow}</p>}
      <h2 className="wf-feature-title">{title}</h2>
      <p className="wf-feature-body">{body}</p>
    </div>
    <div className="wf-feature-visual">{visual}</div>
  </div>
);

export default WorkflowFeatureRow;

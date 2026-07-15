import { FaPlay } from "react-icons/fa";
import { Link } from "react-router-dom";
import { workflowDemoPath } from "../../data/workflows";

interface WorkflowDemoCtaProps {
  slug: string;
  label: string;
}

const WorkflowDemoCta = ({ slug, label }: WorkflowDemoCtaProps) => {
  return (
    <section className="wf-demo">
      <div className="container">
        <div className="wf-demo-content">
          <h2 className="section-title">See it run</h2>
          <p className="wf-demo-lede">
            A click-through of {label.toLowerCase()} on a made-up business, so
            you can see exactly what happens at each step before you commit to
            anything.
          </p>
          <Link to={workflowDemoPath(slug)} className="wf-demo-btn">
            <FaPlay className="wf-demo-btn-icon" />
            Try the interactive demo →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WorkflowDemoCta;

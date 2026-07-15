interface WorkflowPainsProps {
  painPoints: string[];
}

const WorkflowPains = ({ painPoints }: WorkflowPainsProps) => {
  return (
    <section className="wf-pains">
      <div className="container">
        <div className="section-content">
          <h2 className="section-title">Sound familiar?</h2>
          <ul className="wf-pains-list">
            {painPoints.map((pain) => (
              <li key={pain} className="wf-pains-item">
                {pain}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default WorkflowPains;

interface WorkflowProblemSolutionProps {
  painPoints: string[];
  mechanism: { title: string; description: string }[];
}

const WorkflowProblemSolution = ({
  painPoints,
  mechanism,
}: WorkflowProblemSolutionProps) => {
  return (
    <section className="wf-problem-solution">
      <div className="container">
        <div className="wf-ps-grid">
          <div className="wf-ps-col">
            <h2 className="wf-ps-heading">Sound familiar?</h2>
            <ul className="wf-pains-list">
              {painPoints.map((pain) => (
                <li key={pain} className="wf-pains-item">
                  {pain}
                </li>
              ))}
            </ul>
          </div>
          <div className="wf-ps-col">
            <h2 className="wf-ps-heading">How it works</h2>
            <ol className="wf-mechanism-list">
              {mechanism.map((item, index) => (
                <li key={item.title} className="wf-mechanism-item">
                  <span className="wf-mechanism-number">{index + 1}</span>
                  <div className="wf-mechanism-body">
                    <h3 className="wf-mechanism-title">{item.title}</h3>
                    <p className="wf-mechanism-description">
                      {item.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkflowProblemSolution;

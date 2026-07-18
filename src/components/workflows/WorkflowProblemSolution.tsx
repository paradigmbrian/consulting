interface WorkflowProblemSolutionProps {
  painPoints: string[];
  mechanism: { title: string; description: string }[];
}

const WorkflowProblemSolution = ({
  painPoints,
  mechanism,
}: WorkflowProblemSolutionProps) => {
  // In the Phase-2 redesign the mechanism becomes feature rows, so this section
  // is passed an empty mechanism and renders the pains as a single column.
  const showMechanism = mechanism.length > 0;

  return (
    <section className="wf-problem-solution">
      <div className="container">
        <div className={showMechanism ? "wf-ps-grid" : "wf-ps-grid wf-ps-grid-single"}>
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
          {showMechanism && (
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
          )}
        </div>
      </div>
    </section>
  );
};

export default WorkflowProblemSolution;

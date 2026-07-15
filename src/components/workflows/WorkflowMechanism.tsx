interface WorkflowMechanismProps {
  mechanism: { title: string; description: string }[];
}

const WorkflowMechanism = ({ mechanism }: WorkflowMechanismProps) => {
  return (
    <section className="wf-mechanism">
      <div className="container">
        <div className="section-content">
          <h2 className="section-title">How it works</h2>
          <ol className="wf-mechanism-list">
            {mechanism.map((item, index) => (
              <li key={item.title} className="wf-mechanism-item">
                <span className="wf-mechanism-number">{index + 1}</span>
                <div className="wf-mechanism-body">
                  <h3 className="wf-mechanism-title">{item.title}</h3>
                  <p className="wf-mechanism-description">{item.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default WorkflowMechanism;

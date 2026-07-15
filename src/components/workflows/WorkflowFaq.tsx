interface WorkflowFaqProps {
  faq: { q: string; a: string }[];
}

const WorkflowFaq = ({ faq }: WorkflowFaqProps) => {
  return (
    <section className="wf-faq">
      <div className="container">
        <div className="section-content">
          <h2 className="section-title">Questions</h2>
          <div className="wf-faq-list">
            {faq.map((item) => (
              <details key={item.q} className="wf-faq-item">
                <summary className="wf-faq-question">{item.q}</summary>
                <p className="wf-faq-answer">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkflowFaq;

import './Solution.css'

const Solution = () => {
  return (
    <section className="solution">
      <div className="container">
        <div className="section-content">
          <h2 className="section-title">The MVP Tech Blueprint</h2>
          <p className="section-intro">
            A short, fixed-scope engagement to help early founders avoid costly technical mistakes.
          </p>
          <div className="solution-outcomes">
            <h3 className="outcomes-title">After this engagement, you will have:</h3>
            <ul className="outcomes-list">
              <li>
                <strong>A clear recommendation</strong> for what technology to use—and why
              </li>
              <li>
                <strong>Confidence</strong> that your MVP is simple without being fragile
              </li>
              <li>
                <strong>A realistic understanding</strong> of early tradeoffs
              </li>
              <li>
                <strong>A concrete plan</strong> for what to do next, without second-guessing
              </li>
            </ul>
            <p className="solution-goal">
              The goal is not perfection. The goal is reducing risk before momentum locks you in.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Solution


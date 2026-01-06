import "./WhoIsFor.css";

const WhoIsFor = () => {
  return (
    <section className="who-is-for">
      <div className="container">
        <div className="section-content">
          <h2 className="section-title">Who This Is For</h2>
          <div className="who-is-for-content">
            <div className="who-is-for-list">
              <ul>
                <li>Non-technical, first-time founders</li>
                <li>Early-stage B2C SaaS ideas</li>
                <li>Teams with a clear concept but no code yet</li>
                <li>
                  Founders who want to move fast without making irreversible
                  mistakes
                </li>
              </ul>
            </div>
          </div>
          <div className="section-divider"></div>
          <h2 className="section-title">Who This Is Not For</h2>
          <div className="who-is-not-for-list">
            <ul>
              <li>
                Teams looking for a freelance developer to just "start building"
              </li>
              <li>Companies with an existing large codebase</li>
              <li>
                Founders optimizing for the cheapest possible implementation
              </li>
              <li>Projects without decision-making authority</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoIsFor;

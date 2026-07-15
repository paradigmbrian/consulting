import "./AwWhyWorkWithMe.css";

const reasons: string[] = [
  "10+ years as a professional software engineer",
  "Real, robust engineering — not brittle no-code that breaks",
  "Built on the tools you already use",
  "Fixed scope, agreed up front — no surprise bills",
];

const AwWhyWorkWithMe = () => {
  return (
    <section className="aw-why">
      <div className="container">
        <div className="section-content">
          <h2 className="section-title">Why work with me</h2>
          <ul className="aw-why-list">
            {reasons.map((reason) => (
              <li key={reason} className="aw-why-item">
                {reason}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default AwWhyWorkWithMe;

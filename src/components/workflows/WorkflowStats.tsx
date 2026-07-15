import type { Stat } from "../../data/workflows";

interface WorkflowStatsProps {
  stats: Stat[];
}

const WorkflowStats = ({ stats }: WorkflowStatsProps) => {
  if (stats.length === 0) {
    return null;
  }

  return (
    <section className="wf-stats">
      <div className="container">
        <div className="section-content">
          <h2 className="section-title">What it costs to leave this manual</h2>
          <div className="wf-stats-grid">
            {stats.map((stat) => (
              <div key={stat.label} className="wf-stat">
                <p className="wf-stat-value">{stat.value}</p>
                <p className="wf-stat-label">{stat.label}</p>
                <a
                  href={stat.sourceUrl}
                  className="wf-stat-source"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {stat.source}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkflowStats;

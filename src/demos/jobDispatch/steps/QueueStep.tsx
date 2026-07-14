import { FaExclamationTriangle } from "react-icons/fa";
import type { WorkflowProvider } from "../types";

const QueueStep = ({ provider }: { provider: WorkflowProvider }) => {
  const business = provider.getBusiness();
  const techs = provider.getTechs();
  const jobs = provider.getJobs();

  return (
    <div className="jd-step">
      <h3 className="jd-heading">
        Eight jobs, four vans, one emergency — the morning pile
      </h3>
      <p className="jd-sub">
        {business.name} starts every day with a stack of unassigned jobs and a
        dispatcher playing Tetris — matching skills to jobs, protecting time
        windows, and squeezing in whatever just broke. Here's this morning's
        pile.
      </p>

      <div className="jd-techs">
        {techs.map((t) => (
          <div key={t.name} className="jd-tech-chip">
            <span className="jd-tech-name">{t.name}</span>
            <span className="jd-tech-specialty">{t.specialty}</span>
            <span className="jd-tech-zone">{t.zone}</span>
          </div>
        ))}
      </div>

      <div className="jd-jobs">
        {jobs.map((job) => {
          const emergency = job.priority === "emergency";
          return (
            <div
              key={job.customer}
              className={"jd-job-card" + (emergency ? " is-emergency" : "")}
            >
              <div className="jd-job-top">
                <span className="jd-job-customer">{job.customer}</span>
                <span
                  className={"jd-job-tag" + (emergency ? " is-emergency" : "")}
                >
                  {emergency && <FaExclamationTriangle aria-hidden="true" />}
                  {emergency ? "Emergency" : "Standard"}
                </span>
              </div>
              <span className="jd-job-type">{job.type}</span>
              <div className="jd-job-meta">
                <span className="jd-job-location">{job.location}</span>
                <span className="jd-job-window">{job.window}</span>
              </div>
            </div>
          );
        })}
      </div>

      <p className="jd-note">
        Dense and unsorted — an hour of the owner's morning, every morning.
      </p>
    </div>
  );
};

export default QueueStep;

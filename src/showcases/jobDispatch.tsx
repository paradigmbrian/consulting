import { FaExclamationTriangle, FaArrowRight, FaCheckCircle } from "react-icons/fa";
import "../demos/jobDispatch/dispatch.css";

/**
 * Static "product-shot" snippets for the job-dispatch detail page.
 * Reuses the demo's real `.jd-*` classes (styled by dispatch.css, colored by
 * the enclosing .demo-scope) with fixed sample content — no provider, no
 * interactivity. One snippet per key.
 */

const Queue = () => (
  <div className="jd-jobs">
    <div className="jd-job-card is-emergency">
      <div className="jd-job-top">
        <span className="jd-job-customer">Danika Ruiz</span>
        <span className="jd-job-tag is-emergency">
          <FaExclamationTriangle /> Emergency
        </span>
      </div>
      <span className="jd-job-type">Burst pipe — active leak</span>
      <div className="jd-job-meta">
        <span className="jd-job-location">Maple Ridge</span>
        <span className="jd-job-window">ASAP</span>
      </div>
    </div>
    <div className="jd-job-card">
      <div className="jd-job-top">
        <span className="jd-job-customer">Owen Castillo</span>
        <span className="jd-job-tag">Standard</span>
      </div>
      <span className="jd-job-type">Water heater install</span>
      <div className="jd-job-meta">
        <span className="jd-job-location">Elm District</span>
        <span className="jd-job-window">10 AM – 12 PM</span>
      </div>
    </div>
  </div>
);

const Assign = () => (
  <div className="jd-assignments">
    <div className="jd-assign-row is-emergency">
      <div className="jd-assign-match">
        <span className="jd-assign-job">
          <FaExclamationTriangle /> Burst pipe
          <span className="jd-assign-customer">Danika Ruiz</span>
        </span>
        <FaArrowRight className="jd-assign-arrow" />
        <span className="jd-assign-tech">Marcus T.</span>
      </div>
      <p className="jd-assign-reason">
        Closest certified tech, already routed through Maple Ridge — bumped to
        the front of his day.
      </p>
    </div>
    <div className="jd-assign-row">
      <div className="jd-assign-match">
        <span className="jd-assign-job">
          Water heater install
          <span className="jd-assign-customer">Owen Castillo</span>
        </span>
        <FaArrowRight className="jd-assign-arrow" />
        <span className="jd-assign-tech">Priya S.</span>
      </div>
      <p className="jd-assign-reason">
        Certified for installs, owns the Elm District zone, and the 10–12
        window fits between her other two stops.
      </p>
    </div>
  </div>
);

const Route = () => (
  <div className="jd-route-card is-emergency">
    <div className="jd-route-head">
      <span className="jd-route-tech">Marcus T.</span>
      <span className="jd-route-flag">
        <FaExclamationTriangle /> Emergency first
      </span>
    </div>
    <ol className="jd-route-stops">
      <li className="jd-route-stop">Danika Ruiz — Maple Ridge (burst pipe)</li>
      <li className="jd-route-stop">Foster Ln. — drain cleaning</li>
      <li className="jd-route-stop">Birchwood Ct. — fixture repair</li>
    </ol>
    <p className="jd-route-note">
      Emergency locked as stop one; the rest batched to cut backtracking
      across town.
    </p>
  </div>
);

const Notify = () => (
  <div className="jd-notify">
    <div className="jd-notify-meta">
      <span className="jd-notify-to">To Danika Ruiz</span>
      <span className="jd-notify-channel">SMS · sent 7:52 AM</span>
    </div>
    <p className="jd-notify-message">
      Hi Danika — Marcus is on his way for the leak, arriving by 8:15 AM.
      We'll text again when he's close.
    </p>
    <ol className="jd-lifecycle">
      <li className="jd-life is-done">
        <span className="jd-life-icon">
          <FaCheckCircle />
        </span>
        <span className="jd-life-label">Delivered</span>
      </li>
      <li className="jd-life is-active">
        <span className="jd-life-icon">
          <FaCheckCircle />
        </span>
        <span className="jd-life-label">Read</span>
      </li>
    </ol>
    <p className="jd-notify-note">
      Read. Danika knows help is on the way — before Marcus has even pulled
      up.
    </p>
  </div>
);

const snippets: Record<string, JSX.Element> = {
  queue: <Queue />,
  assign: <Assign />,
  route: <Route />,
  notify: <Notify />,
};

const JobDispatchShowcase = ({ snippet }: { snippet: string }) =>
  snippets[snippet] ?? null;

export default JobDispatchShowcase;

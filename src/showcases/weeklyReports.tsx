import { FaCheck, FaExclamationTriangle, FaBolt, FaCheckCircle } from "react-icons/fa";
import "../demos/weeklyReports/reports.css";

/**
 * Static "product-shot" snippets for the weekly-owner-reports detail page.
 * Reuses the demo's real `.wr-*` classes (styled by reports.css, colored by
 * the enclosing .demo-scope) with fixed sample content — no provider, no
 * interactivity. One snippet per key.
 */

const RawData = () => (
  <div className="wr-rawgrid">
    <div className="wr-chip">
      <span className="wr-chip-source">Jobs</span>
      <span className="wr-chip-value">38</span>
      <span className="wr-chip-label">Jobs completed</span>
    </div>
    <div className="wr-chip">
      <span className="wr-chip-source">Revenue</span>
      <span className="wr-chip-value">$14,200</span>
      <span className="wr-chip-label">Revenue booked</span>
    </div>
    <div className="wr-chip">
      <span className="wr-chip-source">Leads</span>
      <span className="wr-chip-value">23</span>
      <span className="wr-chip-label">New leads</span>
    </div>
    <div className="wr-chip">
      <span className="wr-chip-source">Phone</span>
      <span className="wr-chip-value">12</span>
      <span className="wr-chip-label">Missed calls</span>
    </div>
  </div>
);

const Report = () => (
  <div className="wr-report">
    <p className="wr-report-headline">
      Strong week — revenue up 14% and reviews climbing. One thing to fix: 3
      quotes are going cold.
    </p>

    <ul className="wr-highlights">
      <li className="wr-highlight">
        <FaCheck className="wr-highlight-icon" aria-hidden="true" />
        <span>Revenue hit $14,200 — your best week this month, up 14%.</span>
      </li>
      <li className="wr-highlight">
        <FaCheck className="wr-highlight-icon" aria-hidden="true" />
        <span>38 jobs done and 9 fresh reviews (4.8★ avg) — the crews are firing.</span>
      </li>
    </ul>

    <div className="wr-watchout">
      <FaExclamationTriangle className="wr-watchout-icon" aria-hidden="true" />
      <div>
        <p className="wr-watchout-label">One thing to watch</p>
        <p className="wr-watchout-text">
          3 of your 6 open quotes haven't been touched in over a week —
          roughly $4k that could quietly walk.
        </p>
      </div>
    </div>

    <div className="wr-action-row">
      <FaBolt className="wr-action-icon" aria-hidden="true" />
      <div>
        <p className="wr-action-label">Recommended action</p>
        <p className="wr-action-text">
          Send a friendly follow-up to the 3 cold quotes before they slip
          away.
        </p>
      </div>
    </div>
  </div>
);

const Deliver = () => (
  <div className="wr-deliver">
    <div className="wr-deliver-meta">
      <span className="wr-deliver-to">To Dana</span>
      <span className="wr-deliver-channel">Text + email · Sunday 6:02 PM</span>
    </div>

    <ol className="wr-lifecycle">
      <li className="wr-life is-active is-done">
        <span className="wr-life-icon">
          <FaCheck />
        </span>
        <span className="wr-life-label">Sending</span>
      </li>
      <li className="wr-life is-active is-done">
        <span className="wr-life-icon">
          <FaCheck />
        </span>
        <span className="wr-life-label">Delivered</span>
      </li>
      <li className="wr-life is-active">
        <span className="wr-life-icon">
          <FaCheck />
        </span>
        <span className="wr-life-label">Read</span>
      </li>
    </ol>

    <p className="wr-deliver-note">
      Read in 32 seconds. The owner knows the week — without chasing it.
    </p>
  </div>
);

const Act = () => (
  <div className="wr-act">
    <button type="button" className="wr-act-btn is-fired" disabled>
      <FaBolt aria-hidden="true" />
      Sent
    </button>

    <div className="wr-act-confirm is-shown">
      <FaCheckCircle className="wr-act-confirm-icon" aria-hidden="true" />
      <div>
        <p className="wr-act-confirm-title">Done — follow-ups sent to all 3.</p>
        <p className="wr-act-confirm-detail">
          Each got a warm, personalized nudge with a link to accept. Any
          replies land back in your inbox.
        </p>
      </div>
    </div>
  </div>
);

const snippets: Record<string, JSX.Element> = {
  rawdata: <RawData />,
  report: <Report />,
  deliver: <Deliver />,
  act: <Act />,
};

const WeeklyReportsShowcase = ({ snippet }: { snippet: string }) =>
  snippets[snippet] ?? null;

export default WeeklyReportsShowcase;

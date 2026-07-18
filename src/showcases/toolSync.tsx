import { FaFileImport, FaSyncAlt, FaCheckCircle } from "react-icons/fa";
import "../demos/toolSync/sync.css";

/**
 * Static "product-shot" snippets for the tool-sync detail page.
 * Reuses the demo's real `.tts-*` classes (styled by sync.css, colored by
 * the enclosing .demo-scope) with fixed sample content — no provider, no
 * interactivity. One snippet per key.
 */

const Intake = () => (
  <div className="tts-intake">
    <div className="tts-intake-head">
      <FaFileImport className="tts-intake-icon" aria-hidden="true" />
      <span className="tts-intake-title">New booking</span>
      <span className="tts-intake-source">from the scheduling tool</span>
    </div>
    <dl className="tts-fields">
      <div className="tts-field">
        <dt className="tts-field-label">Customer</dt>
        <dd className="tts-field-value">D. Ortega</dd>
      </div>
      <div className="tts-field">
        <dt className="tts-field-label">Address</dt>
        <dd className="tts-field-value">88 Redwood Ct</dd>
      </div>
      <div className="tts-field">
        <dt className="tts-field-label">Service</dt>
        <dd className="tts-field-value">Drain cleaning</dd>
      </div>
      <div className="tts-field">
        <dt className="tts-field-label">Price</dt>
        <dd className="tts-field-value">$210</dd>
      </div>
    </dl>
    <p className="tts-flow-label">Needs to reach</p>
    <div className="tts-tools">
      <div className="tts-tool-chip">
        <span className="tts-tool-name">Ledgerbook</span>
        <span className="tts-tool-kind">Accounting</span>
      </div>
      <div className="tts-tool-chip">
        <span className="tts-tool-name">Pipeline</span>
        <span className="tts-tool-kind">CRM</span>
      </div>
      <div className="tts-tool-chip">
        <span className="tts-tool-name">Calendar</span>
        <span className="tts-tool-kind">Scheduling</span>
      </div>
      <div className="tts-tool-chip">
        <span className="tts-tool-name">CrewHQ</span>
        <span className="tts-tool-kind">Field app</span>
      </div>
    </div>
  </div>
);

const Mapping = () => (
  <div className="tts-mappings">
    <div className="tts-map-card">
      <div className="tts-map-head">
        <span className="tts-map-tool">Ledgerbook</span>
        <span className="tts-map-kind">Accounting</span>
      </div>
      <dl className="tts-map-fields">
        <div className="tts-map-field">
          <dt className="tts-map-label">Customer</dt>
          <dd className="tts-map-value">David Ortega</dd>
        </div>
        <div className="tts-map-field">
          <dt className="tts-map-label">Item</dt>
          <dd className="tts-map-value">Drain cleaning</dd>
        </div>
        <div className="tts-map-field">
          <dt className="tts-map-label">Invoice</dt>
          <dd className="tts-map-value">Draft #2210</dd>
        </div>
      </dl>
    </div>
    <div className="tts-map-card">
      <div className="tts-map-head">
        <span className="tts-map-tool">CrewHQ</span>
        <span className="tts-map-kind">Field app</span>
      </div>
      <dl className="tts-map-fields">
        <div className="tts-map-field">
          <dt className="tts-map-label">Work order</dt>
          <dd className="tts-map-value">Drain — Ortega</dd>
        </div>
        <div className="tts-map-field">
          <dt className="tts-map-label">Address</dt>
          <dd className="tts-map-value">88 Redwood Ct</dd>
        </div>
        <div className="tts-map-field">
          <dt className="tts-map-label">Window</dt>
          <dd className="tts-map-value">1–3 PM</dd>
        </div>
      </dl>
    </div>
  </div>
);

const Sync = () => (
  <div className="tts-sync">
    <div className="tts-sync-head">
      <FaSyncAlt aria-hidden="true" /> Written to all 4 tools
    </div>
    <div className="tts-sync-rows">
      <div className="tts-sync-row is-synced">
        <span className="tts-sync-tool">Ledgerbook</span>
        <span className="tts-sync-detail">Customer matched · draft invoice #2210</span>
        <span className="tts-sync-status">
          <FaCheckCircle aria-hidden="true" /> Synced
        </span>
      </div>
      <div className="tts-sync-row is-synced">
        <span className="tts-sync-tool">Pipeline</span>
        <span className="tts-sync-detail">Deal marked Won on the existing contact</span>
        <span className="tts-sync-status">
          <FaCheckCircle aria-hidden="true" /> Synced
        </span>
      </div>
      <div className="tts-sync-row is-synced">
        <span className="tts-sync-tool">Calendar</span>
        <span className="tts-sync-detail">Visit booked Tue 1–3 PM</span>
        <span className="tts-sync-status">
          <FaCheckCircle aria-hidden="true" /> Synced
        </span>
      </div>
      <div className="tts-sync-row is-synced">
        <span className="tts-sync-tool">CrewHQ</span>
        <span className="tts-sync-detail">Work order created for Route 2</span>
        <span className="tts-sync-status">
          <FaCheckCircle aria-hidden="true" /> Synced
        </span>
      </div>
    </div>
    <p className="tts-sync-note">One entry became four correct records — no duplicate, no retyping.</p>
  </div>
);

const Results = () => (
  <div className="tts-step">
    <div className="tts-tally">
      <div className="tts-tally-item">
        <span className="tts-tally-num">4</span>
        <span className="tts-tally-label">Tools in sync</span>
      </div>
      <div className="tts-tally-item tts-tally-item-hl">
        <span className="tts-tally-num">~9 min</span>
        <span className="tts-tally-label">Double-entry saved</span>
      </div>
      <div className="tts-tally-item">
        <span className="tts-tally-num">18</span>
        <span className="tts-tally-label">Fields mapped</span>
      </div>
      <div className="tts-tally-item">
        <span className="tts-tally-num">1</span>
        <span className="tts-tally-label">Duplicates prevented</span>
      </div>
    </div>
    <p className="tts-takeaway">
      One booking flowed into accounting, CRM, calendar, and the crew app —
      correctly shaped for each, with a duplicate customer caught before it
      doubled up.
    </p>
  </div>
);

const snippets: Record<string, JSX.Element> = {
  intake: <Intake />,
  mapping: <Mapping />,
  sync: <Sync />,
  results: <Results />,
};

const ToolSyncShowcase = ({ snippet }: { snippet: string }) =>
  snippets[snippet] ?? null;

export default ToolSyncShowcase;

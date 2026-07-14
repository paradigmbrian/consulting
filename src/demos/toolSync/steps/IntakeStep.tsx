import { FaFileImport } from "react-icons/fa";
import type { WorkflowProvider } from "../types";

const IntakeStep = ({ provider }: { provider: WorkflowProvider }) => {
  const business = provider.getBusiness();
  const job = provider.getJob();
  const tools = provider.getTools();

  const fields = [
    { label: "Customer", value: job.customer },
    { label: "Address", value: job.address },
    { label: "Service", value: job.service },
    { label: "Price", value: job.price },
    { label: "Date", value: job.date },
    { label: "Phone", value: job.phone },
  ];

  return (
    <div className="tts-step">
      <h3 className="tts-heading">One job, four tools — and a lot of retyping</h3>
      <p className="tts-sub">
        A job just came into {business.name}'s booking tool. To actually run it,
        the same details have to land in four other apps — normally typed in by
        hand, four times over.
      </p>

      <div className="tts-intake">
        <div className="tts-intake-head">
          <FaFileImport className="tts-intake-icon" aria-hidden="true" />
          <span className="tts-intake-title">New booking</span>
          <span className="tts-intake-source">from the scheduling tool</span>
        </div>
        <dl className="tts-fields">
          {fields.map((f) => (
            <div key={f.label} className="tts-field">
              <dt className="tts-field-label">{f.label}</dt>
              <dd className="tts-field-value">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <p className="tts-flow-label">Needs to reach</p>
      <div className="tts-tools">
        {tools.map((t) => (
          <div key={t.name} className="tts-tool-chip">
            <span className="tts-tool-name">{t.name}</span>
            <span className="tts-tool-kind">{t.kind}</span>
          </div>
        ))}
      </div>

      <p className="tts-note">
        Four apps, none of them talking — where double entry and duplicate
        customers creep in.
      </p>
    </div>
  );
};

export default IntakeStep;

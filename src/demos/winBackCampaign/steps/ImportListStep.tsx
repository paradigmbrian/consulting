import { FaDatabase } from "react-icons/fa";
import type { WorkflowProvider } from "../types";

const ImportListStep = ({ provider }: { provider: WorkflowProvider }) => {
  const practice = provider.getPractice();
  const patients = provider.getPatients();
  return (
    <div className="wb-step">
      <h3 className="wb-heading">Import the past-patient list</h3>
      <p className="wb-sub">
        Pull {practice.name}'s patient history straight from{" "}
        {practice.listSource} — no manual export gymnastics.
      </p>

      <div className="wb-source">
        <FaDatabase className="wb-source-icon" />
        <div>
          <p className="wb-source-name">{practice.listSource}</p>
          <p className="wb-source-meta">
            {practice.listSize.toLocaleString()} patient records · target:{" "}
            {practice.winBackWindow.toLowerCase()}
          </p>
        </div>
      </div>

      <table className="wb-table">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Last visit</th>
            <th>Last service</th>
            <th>Contact</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.lastVisitLabel}</td>
              <td>{p.lastService}</td>
              <td className="wb-mono">{p.contact}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="wb-note">Showing 4 of {practice.listSize.toLocaleString()} records.</p>
    </div>
  );
};

export default ImportListStep;

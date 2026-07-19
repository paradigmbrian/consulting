import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import TechnicalConsulting from "./components/TechnicalConsulting";
import AutomatedWorkflows from "./components/AutomatedWorkflows";
import WorkflowDemo from "./components/workflows/WorkflowDemo";
import WorkflowPage from "./components/workflows/WorkflowPage";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<AutomatedWorkflows />} />
          <Route
            path="/services/automated-workflows"
            element={<Navigate to="/" replace />}
          />
          <Route
            path="/services/technical-consulting"
            element={<TechnicalConsulting />}
          />
          <Route
            path="/services/automated-workflows/:slug"
            element={<WorkflowPage />}
          />
        </Route>
        <Route
          path="/services/automated-workflows/:slug/demo"
          element={<WorkflowDemo />}
        />
      </Routes>
    </>
  );
}

export default App;

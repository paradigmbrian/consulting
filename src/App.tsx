import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home";
import TechnicalConsulting from "./components/TechnicalConsulting";
import AutomatedWorkflows from "./components/AutomatedWorkflows";
import AiIntegration from "./components/AiIntegration";
import WorkflowDemo from "./components/workflows/WorkflowDemo";
import WorkflowPage from "./components/workflows/WorkflowPage";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route
            path="/services/automated-workflows"
            element={<AutomatedWorkflows />}
          />
          <Route
            path="/services/technical-consulting"
            element={<TechnicalConsulting />}
          />
          <Route
            path="/services/automated-workflows/:slug"
            element={<WorkflowPage />}
          />
          <Route
            path="/services/ai-integration"
            element={<AiIntegration />}
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

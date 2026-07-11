import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import LandingPage from "./components/LandingPage";
import TechnicalConsulting from "./components/TechnicalConsulting";
import AutomatedWorkflows from "./components/AutomatedWorkflows";
import DemoPage from "./demos/commercialCleaning/DemoPage";
import WinBackDemo from "./demos/winBackCampaign/WinBackDemo";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/services/technical-consulting"
          element={<TechnicalConsulting />}
        />
        <Route
          path="/services/automated-workflows"
          element={<AutomatedWorkflows />}
        />
      </Route>
      <Route path="/demos/commercial-cleaning" element={<DemoPage />} />
      <Route path="/demos/win-back-campaign" element={<WinBackDemo />} />
    </Routes>
  );
}

export default App;

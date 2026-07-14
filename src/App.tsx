import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import LandingPage from "./components/LandingPage";
import TechnicalConsulting from "./components/TechnicalConsulting";
import AutomatedWorkflows from "./components/AutomatedWorkflows";
import DemoPage from "./demos/commercialCleaning/DemoPage";
import WinBackDemo from "./demos/winBackCampaign/WinBackDemo";
import MissedCallTextBackDemo from "./demos/missedCallTextBack/MissedCallTextBackDemo";
import ReviewGenerationDemo from "./demos/reviewGeneration/ReviewGenerationDemo";
import AutomatedQuotingDemo from "./demos/automatedQuoting/AutomatedQuotingDemo";
import InvoiceRemindersDemo from "./demos/invoiceReminders/InvoiceRemindersDemo";
import WeeklyReportsDemo from "./demos/weeklyReports/WeeklyReportsDemo";
import OnboardingDemo from "./demos/newCustomerOnboarding/OnboardingDemo";
import JobDispatchDemo from "./demos/jobDispatch/JobDispatchDemo";

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
      <Route
        path="/demos/missed-call-text-back"
        element={<MissedCallTextBackDemo />}
      />
      <Route
        path="/demos/review-generation"
        element={<ReviewGenerationDemo />}
      />
      <Route
        path="/demos/automated-quoting"
        element={<AutomatedQuotingDemo />}
      />
      <Route
        path="/demos/invoice-reminders"
        element={<InvoiceRemindersDemo />}
      />
      <Route
        path="/demos/weekly-reports"
        element={<WeeklyReportsDemo />}
      />
      <Route path="/demos/onboarding" element={<OnboardingDemo />} />
      <Route path="/demos/dispatch" element={<JobDispatchDemo />} />
    </Routes>
  );
}

export default App;

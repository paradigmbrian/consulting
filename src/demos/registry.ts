import { lazy } from "react";
import type { ComponentType, LazyExoticComponent } from "react";

export const demoRegistry: Record<
  string,
  LazyExoticComponent<ComponentType>
> = {
  "win-back-campaigns": lazy(() => import("./winBackCampaign/WinBackDemo")),
  "missed-call-text-back": lazy(
    () => import("./missedCallTextBack/MissedCallTextBackDemo"),
  ),
  "review-generation": lazy(
    () => import("./reviewGeneration/ReviewGenerationDemo"),
  ),
  "automated-quoting": lazy(
    () => import("./automatedQuoting/AutomatedQuotingDemo"),
  ),
  "invoice-reminders": lazy(
    () => import("./invoiceReminders/InvoiceRemindersDemo"),
  ),
  "new-customer-onboarding": lazy(
    () => import("./newCustomerOnboarding/OnboardingDemo"),
  ),
  "job-dispatch": lazy(() => import("./jobDispatch/JobDispatchDemo")),
  "weekly-owner-reports": lazy(() => import("./weeklyReports/WeeklyReportsDemo")),
  "tool-sync": lazy(() => import("./toolSync/ToolSyncDemo")),
};

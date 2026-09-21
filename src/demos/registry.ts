import dynamic from "next/dynamic";
import type { ComponentType } from "react";

/**
 * slug → demo. `next/dynamic` gives each demo its own client chunk, so a demo's
 * JavaScript loads only on its own page, and the demo is still prerendered.
 */
export const demoRegistry: Record<string, ComponentType> = {
  "win-back-campaigns": dynamic(() => import("./winBackCampaign/WinBackDemo")),
  "missed-call-text-back": dynamic(
    () => import("./missedCallTextBack/MissedCallTextBackDemo"),
  ),
  "review-generation": dynamic(
    () => import("./reviewGeneration/ReviewGenerationDemo"),
  ),
  "automated-quoting": dynamic(
    () => import("./automatedQuoting/AutomatedQuotingDemo"),
  ),
  "invoice-reminders": dynamic(
    () => import("./invoiceReminders/InvoiceRemindersDemo"),
  ),
  "new-customer-onboarding": dynamic(
    () => import("./newCustomerOnboarding/OnboardingDemo"),
  ),
  "job-dispatch": dynamic(() => import("./jobDispatch/JobDispatchDemo")),
  "weekly-owner-reports": dynamic(
    () => import("./weeklyReports/WeeklyReportsDemo"),
  ),
  "tool-sync": dynamic(() => import("./toolSync/ToolSyncDemo")),
};

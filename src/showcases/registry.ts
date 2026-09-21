import type { ComponentType } from "react";
import ReviewGeneration from "./reviewGeneration";
import WinBackCampaign from "./winBackCampaign";
import MissedCallTextBack from "./missedCallTextBack";
import JobDispatch from "./jobDispatch";
import NewCustomerOnboarding from "./newCustomerOnboarding";
import WeeklyReports from "./weeklyReports";
import InvoiceReminders from "./invoiceReminders";
import ToolSync from "./toolSync";
import AutomatedQuoting from "./automatedQuoting";

/**
 * slug → showcase module. Each module renders ONE static snippet, selected by
 * the `snippet` key. They are pure markup, so they render on the server and
 * ship no JavaScript.
 */
export const showcaseRegistry: Record<
  string,
  ComponentType<{ snippet: string }>
> = {
  "review-generation": ReviewGeneration,
  "win-back-campaigns": WinBackCampaign,
  "missed-call-text-back": MissedCallTextBack,
  "job-dispatch": JobDispatch,
  "new-customer-onboarding": NewCustomerOnboarding,
  "weekly-owner-reports": WeeklyReports,
  "invoice-reminders": InvoiceReminders,
  "tool-sync": ToolSync,
  "automated-quoting": AutomatedQuoting,
};

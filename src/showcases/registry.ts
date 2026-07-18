import { lazy } from "react";
import type { ComponentType, LazyExoticComponent } from "react";

/**
 * slug → lazily-imported showcase module. Each module renders ONE static
 * snippet, selected by the `snippet` key. Lazy so a demo's CSS ships only on
 * its own detail page, mirroring `src/demos/registry.ts`. Workflows are added
 * here (with `lazy(() => import("./<dir>"))`) as their detail pages are
 * redesigned (Tasks 3–4).
 */
export const showcaseRegistry: Record<
  string,
  LazyExoticComponent<ComponentType<{ snippet: string }>>
> = {
  "review-generation": lazy(() => import("./reviewGeneration")),
  "win-back-campaigns": lazy(() => import("./winBackCampaign")),
  "missed-call-text-back": lazy(() => import("./missedCallTextBack")),
  "job-dispatch": lazy(() => import("./jobDispatch")),
  "new-customer-onboarding": lazy(() => import("./newCustomerOnboarding")),
  "weekly-owner-reports": lazy(() => import("./weeklyReports")),
  "invoice-reminders": lazy(() => import("./invoiceReminders")),
  "tool-sync": lazy(() => import("./toolSync")),
  "automated-quoting": lazy(() => import("./automatedQuoting")),
};

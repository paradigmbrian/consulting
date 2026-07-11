# Commercial-Cleaning Prospecting Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a self-contained, fully-scripted `/demos/commercial-cleaning` product-tour route to the existing Paradigm Shift website that walks a prospect through a 6-step outbound lead-gen workflow with a mocked send/reply, using zero backend.

**Architecture:** Client-side React SPA addition. Introduce `react-router-dom` so the current landing page becomes the `/` route and the demo gets its own route. The demo is a step state machine (`DefineTarget → Discover → EnrichQualify → Personalize → Send → Results`) driven by a `DemoController` context. All persuasive content is read through a `WorkflowProvider` interface whose only implementation today is a `ScriptedWorkflowProvider` backed by a typed content module — so a future `LiveWorkflowProvider` can swap in without touching the UI. The mocked send is a timed sub-state machine (`idle → sending → delivered → opened → replied`) using `setTimeout` + CSS transitions, with timers cleared on unmount/restart and collapsed to instant when `prefers-reduced-motion` is set.

**Tech Stack:** React 18 + TypeScript, Vite 5, `react-router-dom` v6 (new), vanilla CSS with custom properties (paired `.tsx` + `.css`), `react-icons` (existing).

## Global Constraints

- **No backend, no network calls** — all demo data is bundled and read synchronously (except `send()` which returns a resolved `Promise`).
- **Stack/convention match:** vanilla CSS with custom properties, paired `.tsx` + `.css` per component, reuse existing tokens from `src/index.css` (`--color-primary` `#2777B4`, `--spacing-*`, `.container`, `.btn`/`.btn-primary`/`.btn-large` classes).
- **Calendly CTA URL (verbatim):** `https://calendly.com/brian-paradigmshiftdev/30min` — open in new tab with `target="_blank" rel="noopener noreferrer"`.
- **Routing namespace:** demo lives at `/demos/commercial-cleaning`; future demos slot under `/demos/`.
- **All demo code under** `src/demos/commercialCleaning/`.
- **Responsive** at existing breakpoints: `768px` and `968px`.
- **Respect `prefers-reduced-motion`** — collapse animations/timers to instant state changes.
- **TypeScript is strict** (`noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`). All code must compile clean.
- **No test framework exists and the spec defers adding one.** Per the user's CLAUDE.md (user instructions outrank the TDD default), each task's Definition of Done is: `npm run lint` (zero warnings), `npm run build` (green), and the specified manual check. Adding Vitest is explicitly out of scope for this phase.
- **Commit after each task** (the user runs git writes — the plan shows the suggested command; do not execute git writes yourself unless the executing skill/user authorizes it).

---

## File Structure

**New files (all under `src/demos/commercialCleaning/`):**
- `types.ts` — shared TypeScript types + the `WorkflowProvider` interface.
- `script.ts` — the authored content (company, prospects, enrichments, emails, reply, results summary) + featured-prospect helper.
- `ScriptedWorkflowProvider.ts` — implements `WorkflowProvider` over `script.ts`.
- `DemoController.tsx` — React context + `useDemo()` hook holding the step + send sub-state machine.
- `usePrefersReducedMotion.ts` — small hook reading the media query.
- `DemoPage.tsx` / `DemoPage.css` — page shell: header, step progress indicator, persistent CTA, Back/Next nav, renders the active step.
- `steps/DefineTargetStep.tsx` / `.css`
- `steps/DiscoverStep.tsx` / `.css`
- `steps/EnrichQualifyStep.tsx` / `.css`
- `steps/PersonalizeStep.tsx` / `.css`
- `steps/SendStep.tsx` / `.css`
- `steps/ResultsStep.tsx` / `.css`

**Modified files:**
- `package.json` — add `react-router-dom` dependency.
- `src/main.tsx` — wrap app in `<BrowserRouter>`.
- `src/App.tsx` — become the router: `/` → extracted `Home`, `/demos/commercial-cleaning` → `DemoPage`.
- `src/components/Home.tsx` (new) — holds the current landing-page section composition extracted from `App.tsx`.
- `CLAUDE.md` — update the "No routing" note.
- `netlify.toml` — **already contains the SPA redirect; verify only, no change needed.**

---

## Task 1: Routing scaffold (router + Home extraction)

**Files:**
- Modify: `package.json` (add dependency)
- Modify: `src/main.tsx`
- Modify: `src/App.tsx`
- Create: `src/components/Home.tsx`

**Interfaces:**
- Consumes: existing section components (`Hero`, `WhoIsFor`, … `Footer`).
- Produces: route `/` renders `<Home />`; route `/demos/commercial-cleaning` renders a placeholder `<DemoPage />` (real page built in Task 5). To keep this task self-contained and compiling, add a temporary minimal `DemoPage` placeholder file that Task 5 replaces.

- [ ] **Step 1: Install react-router-dom**

Run:
```bash
npm install react-router-dom@^6.22.0
```
Expected: `package.json` `dependencies` gains `"react-router-dom": "^6.22.0"`; install succeeds.

- [ ] **Step 2: Create the Home component (extract current App body)**

Create `src/components/Home.tsx`:
```tsx
import Hero from "./Hero";
import WhoIsFor from "./WhoIsFor";
import Problem from "./Problem";
import Offer from "./Offer";
import HowItWorks from "./HowItWorks";
import WhyWorkWithMe from "./WhyWorkWithMe";
import CTA from "./CTA";
import Footer from "./Footer";

const Home = () => {
  return (
    <>
      <Hero />
      <WhoIsFor />
      <Problem />
      <Offer />
      <HowItWorks />
      <WhyWorkWithMe />
      <CTA />
      <Footer />
    </>
  );
};

export default Home;
```

- [ ] **Step 3: Create a temporary DemoPage placeholder**

Create `src/demos/commercialCleaning/DemoPage.tsx` (Task 5 replaces this entirely):
```tsx
const DemoPage = () => {
  return <main style={{ padding: "4rem" }}>Demo coming soon.</main>;
};

export default DemoPage;
```

- [ ] **Step 4: Convert App.tsx into the router**

Replace the entire contents of `src/App.tsx`:
```tsx
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import DemoPage from "./demos/commercialCleaning/DemoPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/demos/commercial-cleaning" element={<DemoPage />} />
    </Routes>
  );
}

export default App;
```

- [ ] **Step 5: Wrap the app in BrowserRouter**

Replace the entire contents of `src/main.tsx`:
```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
```

- [ ] **Step 6: Verify lint + build**

Run:
```bash
npm run lint && npm run build
```
Expected: zero warnings, build green.

- [ ] **Step 7: Manual route check**

Run:
```bash
npm run dev
```
Visit `http://localhost:5173/` (landing page renders identically to before) and `http://localhost:5173/demos/commercial-cleaning` ("Demo coming soon." renders). Stop the dev server.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json src/App.tsx src/main.tsx src/components/Home.tsx src/demos/commercialCleaning/DemoPage.tsx
git commit -m "feat(demo): add react-router-dom and route scaffold"
```

---

## Task 2: Content model — types, script, and ScriptedWorkflowProvider

**Files:**
- Create: `src/demos/commercialCleaning/types.ts`
- Create: `src/demos/commercialCleaning/script.ts`
- Create: `src/demos/commercialCleaning/ScriptedWorkflowProvider.ts`

**Interfaces:**
- Consumes: nothing (pure data + provider).
- Produces (relied on by Tasks 3–7):
  - Types: `Icp`, `Company`, `Prospect`, `Enrichment`, `DraftEmail`, `SendResult`, `Reply`, `ResultsSummary`, `WorkflowProvider`.
  - `scriptedWorkflowProvider: WorkflowProvider` — singleton instance.
  - `WorkflowProvider` methods (exact signatures): `getCompany(): Company`, `getICP(): Icp`, `getTargets(): Prospect[]`, `getEnrichment(prospectId: string): Enrichment`, `getEmail(prospectId: string): DraftEmail`, `send(email: DraftEmail): Promise<SendResult>`, `getReply(prospectId: string): Reply`, `getResults(): ResultsSummary`, `getFeaturedProspectId(): string`.

- [ ] **Step 1: Define the shared types and provider interface**

Create `src/demos/commercialCleaning/types.ts`:
```ts
export interface Icp {
  facilityTypes: string[];
  serviceRadiusMiles: number;
  serviceAreaLabel: string;
}

export interface Company {
  name: string;
  tagline: string;
  services: string[];
  serviceArea: string;
  icp: Icp;
}

/** A candidate surfaced during discovery (pre-enrichment). */
export interface Prospect {
  id: string;
  name: string;
  facilityType: string;
  address: string;
  website: string;
  /** Buy-signal / match reasons shown in the Discover step. */
  matchSignals: string[];
}

/** Enrichment + qualify result for a single prospect. */
export interface Enrichment {
  prospectId: string;
  contactName: string;
  contactTitle: string;
  email: string;
  phone: string;
  employeeEstimate: string;
  facilityDetail: string;
  qualified: boolean;
  /** Present only when `qualified` is false. */
  dropReason?: string;
}

export interface DraftEmail {
  prospectId: string;
  subject: string;
  body: string;
  footer: string;
}

export interface SendResult {
  ok: boolean;
  messageId: string;
}

export interface Reply {
  prospectId: string;
  fromName: string;
  subject: string;
  body: string;
  receivedLabel: string;
}

export interface ResultsSummary {
  sent: number;
  opened: number;
  replied: number;
  takeaway: string;
}

export interface WorkflowProvider {
  getCompany(): Company;
  getICP(): Icp;
  getTargets(): Prospect[];
  getEnrichment(prospectId: string): Enrichment;
  getEmail(prospectId: string): DraftEmail;
  send(email: DraftEmail): Promise<SendResult>;
  getReply(prospectId: string): Reply;
  getResults(): ResultsSummary;
  /** First qualified prospect — the one Personalize/Send/Results focus on. */
  getFeaturedProspectId(): string;
}
```

- [ ] **Step 2: Author the script content module**

Create `src/demos/commercialCleaning/script.ts`. Copy is placeholder-quality but realistic; Brian replaces the prose later. Provide 9 prospects (6 qualified, 3 dropped), enrichment for all 9, one featured email, and one reply.
```ts
import type {
  Company,
  Prospect,
  Enrichment,
  DraftEmail,
  Reply,
  ResultsSummary,
} from "./types";

export const company: Company = {
  name: "Summit Commercial Cleaning",
  tagline: "Recurring janitorial for facilities that can't afford to look unkempt.",
  services: [
    "Nightly office janitorial",
    "Medical-grade clinic sanitation",
    "Floor care & carpet extraction",
    "Restroom restocking & disinfection",
  ],
  serviceArea: "Greater Austin, TX (30-mile radius)",
  icp: {
    facilityTypes: ["Offices", "Clinics", "Gyms", "Daycares", "Retail"],
    serviceRadiusMiles: 30,
    serviceAreaLabel: "Greater Austin, TX",
  },
};

export const prospects: Prospect[] = [
  {
    id: "p1",
    name: "Lakeline Dental Group",
    facilityType: "Dental clinic",
    address: "13740 Research Blvd, Austin, TX 78750",
    website: "lakelinedental.com",
    matchSignals: [
      "Physical clinic in service area",
      "No in-house janitorial listed",
      "Medical facility — needs compliant sanitation",
    ],
  },
  {
    id: "p2",
    name: "Northcross Family YMCA",
    facilityType: "Gym / community center",
    address: "2913 W Anderson Ln, Austin, TX 78757",
    website: "northcrossy.org",
    matchSignals: [
      "High-traffic facility within radius",
      "Multiple restrooms & locker rooms",
    ],
  },
  {
    id: "p3",
    name: "Bright Beginnings Daycare",
    facilityType: "Daycare",
    address: "8500 N Mopac Expy, Austin, TX 78759",
    website: "brightbeginningsatx.com",
    matchSignals: [
      "Licensed childcare — strict cleaning needs",
      "Single facility owner-operated",
    ],
  },
  {
    id: "p4",
    name: "Mueller Eye Associates",
    facilityType: "Optometry clinic",
    address: "1801 E 51st St, Austin, TX 78723",
    website: "muellereye.com",
    matchSignals: ["Clinic in service area", "No janitorial vendor found"],
  },
  {
    id: "p5",
    name: "Cedar Park Coworking",
    facilityType: "Office / coworking",
    address: "715 Discovery Blvd, Cedar Park, TX 78613",
    website: "cedarparkcowork.com",
    matchSignals: [
      "Multi-tenant office space",
      "Shared common areas & kitchens",
    ],
  },
  {
    id: "p6",
    name: "Barton Springs Pediatrics",
    facilityType: "Pediatric clinic",
    address: "3705 Medical Pkwy, Austin, TX 78705",
    website: "bartonspringspeds.com",
    matchSignals: ["Medical facility in radius", "Multi-room clinic"],
  },
  {
    id: "p7",
    name: "The Hartwell Residence",
    facilityType: "Private residence",
    address: "4402 Rollingwood Dr, Austin, TX 78746",
    website: "—",
    matchSignals: ["Address matched in radius"],
  },
  {
    id: "p8",
    name: "SparkleRight Janitorial",
    facilityType: "Cleaning company",
    address: "9600 Escarpment Blvd, Austin, TX 78749",
    website: "sparklerightatx.com",
    matchSignals: ["Facility-services keyword match"],
  },
  {
    id: "p9",
    name: "Riverside Distribution Center",
    facilityType: "Warehouse",
    address: "4900 E Riverside Dr, Austin, TX 78741",
    website: "riversidedc.com",
    matchSignals: ["Large facility in radius"],
  },
];

export const enrichments: Enrichment[] = [
  {
    prospectId: "p1",
    contactName: "Dr. Amelia Reyes",
    contactTitle: "Practice Owner",
    email: "areyes@lakelinedental.com",
    phone: "(512) 555-0142",
    employeeEstimate: "12–18 staff",
    facilityDetail: "~4,200 sq ft, 6 operatories + waiting room",
    qualified: true,
  },
  {
    prospectId: "p2",
    contactName: "Marcus Bell",
    contactTitle: "Facilities Director",
    email: "mbell@northcrossy.org",
    phone: "(512) 555-0188",
    employeeEstimate: "40+ staff",
    facilityDetail: "~22,000 sq ft, gym floor + 4 restrooms + locker rooms",
    qualified: true,
  },
  {
    prospectId: "p3",
    contactName: "Tanya Okafor",
    contactTitle: "Owner / Director",
    email: "tanya@brightbeginningsatx.com",
    phone: "(512) 555-0119",
    employeeEstimate: "8–12 staff",
    facilityDetail: "~3,000 sq ft, 6 classrooms + kitchen",
    qualified: true,
  },
  {
    prospectId: "p4",
    contactName: "Dr. Steven Liu",
    contactTitle: "Owner",
    email: "sliu@muellereye.com",
    phone: "(512) 555-0173",
    employeeEstimate: "6–10 staff",
    facilityDetail: "~2,800 sq ft, exam rooms + optical floor",
    qualified: true,
  },
  {
    prospectId: "p5",
    contactName: "Priya Nair",
    contactTitle: "Operations Manager",
    email: "priya@cedarparkcowork.com",
    phone: "(512) 555-0160",
    employeeEstimate: "Property mgmt, ~200 members",
    facilityDetail: "~15,000 sq ft, open floor + 8 conference rooms",
    qualified: true,
  },
  {
    prospectId: "p6",
    contactName: "Dr. Renee Caldwell",
    contactTitle: "Managing Partner",
    email: "rcaldwell@bartonspringspeds.com",
    phone: "(512) 555-0205",
    employeeEstimate: "15–20 staff",
    facilityDetail: "~5,000 sq ft, 8 exam rooms + lab",
    qualified: true,
  },
  {
    prospectId: "p7",
    contactName: "—",
    contactTitle: "—",
    email: "—",
    phone: "—",
    employeeEstimate: "—",
    facilityDetail: "Single-family home",
    qualified: false,
    dropReason: "Residential address — outside commercial ICP.",
  },
  {
    prospectId: "p8",
    contactName: "—",
    contactTitle: "—",
    email: "info@sparklerightatx.com",
    phone: "(512) 555-0191",
    employeeEstimate: "25+ staff",
    facilityDetail: "Janitorial services firm",
    qualified: false,
    dropReason: "Direct competitor — not a buyer.",
  },
  {
    prospectId: "p9",
    contactName: "—",
    contactTitle: "—",
    email: "—",
    phone: "(512) 555-0210",
    employeeEstimate: "Unknown",
    facilityDetail: "~80,000 sq ft warehouse",
    qualified: false,
    dropReason: "No reachable decision-maker found after enrichment.",
  },
];

/** The qualified prospect Personalize/Send/Results focus on. */
export const featuredProspectId = "p1";

export const emails: DraftEmail[] = [
  {
    prospectId: "p1",
    subject: "Quick question about nightly cleaning at Lakeline Dental",
    body: [
      "Hi Dr. Reyes,",
      "",
      "I run Summit Commercial Cleaning here in north Austin, and I work with a few dental practices off Research Blvd on their nightly janitorial — operatory wipe-downs, restroom disinfection, and floor care that keeps an inspection-ready clinic.",
      "",
      "I noticed Lakeline has six operatories and a busy waiting room. For practices that size we usually handle a nightly turn so your team walks into a spotless office every morning without anyone staying late to do it.",
      "",
      "Would it be worth a 15-minute call to see if we're a fit? Happy to put together a quick walk-through quote.",
      "",
      "Best,",
      "Brian — Summit Commercial Cleaning",
      "(512) 555-0100",
    ].join("\n"),
    footer:
      "Summit Commercial Cleaning · 13740 Research Blvd, Austin, TX 78750 · You're receiving this one-time outreach because of your business listing. Reply STOP to opt out and we won't contact you again.",
  },
];

export const reply: Reply = {
  prospectId: "p1",
  fromName: "Dr. Amelia Reyes",
  subject: "Re: Quick question about nightly cleaning at Lakeline Dental",
  body: [
    "Hi Brian,",
    "",
    "Good timing — our current cleaner has been inconsistent and I've been meaning to look around. Six operatories is right, and inspection-readiness is exactly my concern.",
    "",
    "Thursday afternoon works for a walk-through. What time suits you?",
    "",
    "Thanks,",
    "Amelia",
  ].join("\n"),
  receivedLabel: "2 days later",
};

export const results: ResultsSummary = {
  sent: 6,
  opened: 4,
  replied: 1,
  takeaway:
    "Six qualified facilities reached, four opens, one booked walk-through — from a single scripted pass. This is exactly what we'd run for your business.",
};
```

- [ ] **Step 3: Implement ScriptedWorkflowProvider**

Create `src/demos/commercialCleaning/ScriptedWorkflowProvider.ts`:
```ts
import type {
  Company,
  Prospect,
  Enrichment,
  DraftEmail,
  SendResult,
  Reply,
  ResultsSummary,
  WorkflowProvider,
} from "./types";
import {
  company,
  prospects,
  enrichments,
  emails,
  reply,
  results,
  featuredProspectId,
} from "./script";

class ScriptedWorkflowProvider implements WorkflowProvider {
  getCompany(): Company {
    return company;
  }

  getICP() {
    return company.icp;
  }

  getTargets(): Prospect[] {
    return prospects;
  }

  getEnrichment(prospectId: string): Enrichment {
    const found = enrichments.find((e) => e.prospectId === prospectId);
    if (!found) {
      throw new Error(`No enrichment for prospect ${prospectId}`);
    }
    return found;
  }

  getEmail(prospectId: string): DraftEmail {
    const found = emails.find((e) => e.prospectId === prospectId);
    if (!found) {
      throw new Error(`No email for prospect ${prospectId}`);
    }
    return found;
  }

  send(email: DraftEmail): Promise<SendResult> {
    return Promise.resolve({ ok: true, messageId: `mock-${email.prospectId}` });
  }

  getReply(prospectId: string): Reply {
    if (reply.prospectId !== prospectId) {
      throw new Error(`No reply for prospect ${prospectId}`);
    }
    return reply;
  }

  getResults(): ResultsSummary {
    return results;
  }

  getFeaturedProspectId(): string {
    return featuredProspectId;
  }
}

export const scriptedWorkflowProvider: WorkflowProvider =
  new ScriptedWorkflowProvider();
```

- [ ] **Step 4: Verify lint + build**

Run:
```bash
npm run lint && npm run build
```
Expected: zero warnings, build green. (No UI consumes this yet; this confirms types compile.)

- [ ] **Step 5: Commit**

```bash
git add src/demos/commercialCleaning/types.ts src/demos/commercialCleaning/script.ts src/demos/commercialCleaning/ScriptedWorkflowProvider.ts
git commit -m "feat(demo): add content model, types, and ScriptedWorkflowProvider"
```

---

## Task 3: DemoController state machine + reduced-motion hook

**Files:**
- Create: `src/demos/commercialCleaning/usePrefersReducedMotion.ts`
- Create: `src/demos/commercialCleaning/DemoController.tsx`

**Interfaces:**
- Consumes: nothing (self-contained state).
- Produces (relied on by Tasks 4–7):
  - `usePrefersReducedMotion(): boolean`
  - `STEPS: readonly StepId[]` where `type StepId = "define" | "discover" | "enrich" | "personalize" | "send" | "results"`
  - `type SendStatus = "idle" | "sending" | "delivered" | "opened" | "replied"`
  - `<DemoProvider>` component (wraps the page)
  - `useDemo()` returning:
    - `stepIndex: number`
    - `stepId: StepId`
    - `sendStatus: SendStatus`
    - `next(): void`, `back(): void`, `reset(): void`
    - `startSend(): void` — drives `sending → delivered → opened` via timers (instant if reduced motion)
    - `markReplied(): void` — sets `sendStatus` to `"replied"`
    - `canBack: boolean`, `canNext: boolean`

- [ ] **Step 1: Create the reduced-motion hook**

Create `src/demos/commercialCleaning/usePrefersReducedMotion.ts`:
```ts
import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia(QUERY).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia(QUERY);
    const onChange = () => setReduced(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
```

- [ ] **Step 2: Create the DemoController context + machine**

Create `src/demos/commercialCleaning/DemoController.tsx`:
```tsx
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

export const STEPS = [
  "define",
  "discover",
  "enrich",
  "personalize",
  "send",
  "results",
] as const;

export type StepId = (typeof STEPS)[number];

export type SendStatus =
  | "idle"
  | "sending"
  | "delivered"
  | "opened"
  | "replied";

/** Timings for the mocked send lifecycle (ms). */
const SENDING_MS = 1100;
const DELIVERED_MS = 1100;

interface DemoContextValue {
  stepIndex: number;
  stepId: StepId;
  sendStatus: SendStatus;
  next: () => void;
  back: () => void;
  reset: () => void;
  startSend: () => void;
  markReplied: () => void;
  canBack: boolean;
  canNext: boolean;
}

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [sendStatus, setSendStatus] = useState<SendStatus>("idle");
  const reducedMotion = usePrefersReducedMotion();
  const timers = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const next = useCallback(() => {
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  }, []);

  const back = useCallback(() => {
    setStepIndex((i) => Math.max(i - 1, 0));
  }, []);

  const reset = useCallback(() => {
    clearTimers();
    setSendStatus("idle");
    setStepIndex(0);
  }, [clearTimers]);

  const startSend = useCallback(() => {
    clearTimers();
    if (reducedMotion) {
      setSendStatus("opened");
      return;
    }
    setSendStatus("sending");
    timers.current.push(
      window.setTimeout(() => setSendStatus("delivered"), SENDING_MS),
    );
    timers.current.push(
      window.setTimeout(
        () => setSendStatus("opened"),
        SENDING_MS + DELIVERED_MS,
      ),
    );
  }, [clearTimers, reducedMotion]);

  const markReplied = useCallback(() => {
    setSendStatus("replied");
  }, []);

  const value = useMemo<DemoContextValue>(
    () => ({
      stepIndex,
      stepId: STEPS[stepIndex],
      sendStatus,
      next,
      back,
      reset,
      startSend,
      markReplied,
      canBack: stepIndex > 0,
      canNext: stepIndex < STEPS.length - 1,
    }),
    [stepIndex, sendStatus, next, back, reset, startSend, markReplied],
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo(): DemoContextValue {
  const ctx = useContext(DemoContext);
  if (!ctx) {
    throw new Error("useDemo must be used within a DemoProvider");
  }
  return ctx;
}
```

- [ ] **Step 3: Verify lint + build**

Run:
```bash
npm run lint && npm run build
```
Expected: zero warnings, build green.

- [ ] **Step 4: Commit**

```bash
git add src/demos/commercialCleaning/usePrefersReducedMotion.ts src/demos/commercialCleaning/DemoController.tsx
git commit -m "feat(demo): add DemoController state machine and reduced-motion hook"
```

---

## Task 4: Demo page shell (header, progress, nav, persistent CTA)

**Files:**
- Replace: `src/demos/commercialCleaning/DemoPage.tsx` (overwrites Task 1 placeholder)
- Create: `src/demos/commercialCleaning/DemoPage.css`

**Interfaces:**
- Consumes: `DemoProvider`, `useDemo`, `STEPS`/`StepId` from `DemoController`; `scriptedWorkflowProvider` from `ScriptedWorkflowProvider`.
- Produces (relied on by Tasks 5–7): the page renders the active step by `stepId` via a `switch`. Each step component takes a single prop `{ provider: WorkflowProvider }`. Until a step exists it renders a small inline `<p>` stub — Tasks 5–7 replace each stub with the real import. The shell owns Back/Next, the step progress indicator, the "Restart demo" button, and the persistent Calendly CTA.

- [ ] **Step 1: Write the page shell**

Replace the entire contents of `src/demos/commercialCleaning/DemoPage.tsx`:
```tsx
import { FaCalendarAlt } from "react-icons/fa";
import { DemoProvider, useDemo, STEPS, type StepId } from "./DemoController";
import { scriptedWorkflowProvider } from "./ScriptedWorkflowProvider";
import "./DemoPage.css";

const provider = scriptedWorkflowProvider;

const STEP_LABELS: Record<StepId, string> = {
  define: "Define target",
  discover: "Discover",
  enrich: "Enrich & qualify",
  personalize: "Personalize",
  send: "Send",
  results: "Reply & results",
};

const CALENDLY_URL = "https://calendly.com/brian-paradigmshiftdev/30min";

function StepProgress() {
  const { stepIndex } = useDemo();
  return (
    <ol className="demo-progress" aria-label="Demo progress">
      {STEPS.map((id, i) => (
        <li
          key={id}
          className={
            "demo-progress-item" +
            (i === stepIndex ? " is-active" : "") +
            (i < stepIndex ? " is-complete" : "")
          }
        >
          <span className="demo-progress-dot">{i + 1}</span>
          <span className="demo-progress-label">{STEP_LABELS[id]}</span>
        </li>
      ))}
    </ol>
  );
}

function StepBody() {
  const { stepId } = useDemo();
  switch (stepId) {
    // Tasks 5–7 replace each stub with the real step component.
    case "define":
      return <p className="demo-stub">Define target step.</p>;
    case "discover":
      return <p className="demo-stub">Discover step.</p>;
    case "enrich":
      return <p className="demo-stub">Enrich &amp; qualify step.</p>;
    case "personalize":
      return <p className="demo-stub">Personalize step.</p>;
    case "send":
      return <p className="demo-stub">Send step.</p>;
    case "results":
      return <p className="demo-stub">Reply &amp; results step.</p>;
    default:
      return null;
  }
}

function DemoNav() {
  const { back, next, reset, canBack, canNext } = useDemo();
  return (
    <div className="demo-nav">
      <button
        className="demo-btn demo-btn-ghost"
        onClick={back}
        disabled={!canBack}
      >
        ← Back
      </button>
      <button className="demo-btn demo-btn-ghost" onClick={reset}>
        Restart demo
      </button>
      <button
        className="demo-btn demo-btn-primary"
        onClick={next}
        disabled={!canNext}
      >
        Next →
      </button>
    </div>
  );
}

function DemoShell() {
  const company = provider.getCompany();
  return (
    <main className="demo">
      <div className="container">
        <header className="demo-header">
          <p className="demo-eyebrow">Paradigm Shift — Workflow Demo</p>
          <h1 className="demo-title">
            Outbound lead-gen for {company.name}
          </h1>
          <p className="demo-lede">
            A click-through of how the workflow finds, qualifies, personalizes,
            and reaches out to local leads — end to end.
          </p>
          <a
            href={CALENDLY_URL}
            className="demo-cta"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaCalendarAlt className="demo-cta-icon" />
            Book a 30-minute call
          </a>
        </header>

        <StepProgress />

        <section className="demo-stage">
          <StepBody />
        </section>

        <DemoNav />
      </div>
    </main>
  );
}

const DemoPage = () => {
  return (
    <DemoProvider>
      <DemoShell />
    </DemoProvider>
  );
};

export default DemoPage;
```

- [ ] **Step 2: Write the page CSS**

Create `src/demos/commercialCleaning/DemoPage.css`:
```css
.demo {
  min-height: 100vh;
  padding: var(--spacing-lg) 0 var(--spacing-xl);
  background-color: var(--color-bg-light);
}

.demo-header {
  text-align: center;
  margin-bottom: var(--spacing-lg);
}

.demo-eyebrow {
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-primary);
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
}

.demo-title {
  margin-bottom: var(--spacing-sm);
}

.demo-lede {
  max-width: 640px;
  margin: 0 auto var(--spacing-md);
}

.demo-cta {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  background: var(--color-primary);
  color: #fff;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(39, 119, 180, 0.25);
}

.demo-cta:hover {
  background: var(--color-primary-dark);
  color: #fff;
  transform: translateY(-1px);
}

.demo-cta-icon {
  font-size: 1rem;
}

/* Progress indicator */
.demo-progress {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  justify-content: center;
  list-style: none;
  margin-bottom: var(--spacing-lg);
}

.demo-progress-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-text-light);
  font-size: 0.875rem;
}

.demo-progress-dot {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid var(--color-border);
  background: #fff;
  font-weight: 700;
  font-size: 0.8rem;
}

.demo-progress-item.is-active .demo-progress-dot {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.demo-progress-item.is-active {
  color: var(--color-text);
  font-weight: 600;
}

.demo-progress-item.is-complete .demo-progress-dot {
  border-color: var(--color-success);
  background: var(--color-success);
  color: #fff;
}

/* Stage */
.demo-stage {
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  padding: var(--spacing-lg);
  min-height: 320px;
  box-shadow: 0 8px 30px rgba(15, 23, 42, 0.06);
}

.demo-stub {
  text-align: center;
  color: var(--color-text-light);
}

/* Nav */
.demo-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
}

.demo-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
}

.demo-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.demo-btn-ghost {
  background: transparent;
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.demo-btn-ghost:hover:not(:disabled) {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.demo-btn-primary {
  background: var(--color-primary);
  color: #fff;
}

.demo-btn-primary:hover:not(:disabled) {
  background: var(--color-primary-dark);
}

@media (max-width: 768px) {
  .demo-stage {
    padding: var(--spacing-md);
  }

  .demo-progress-label {
    display: none;
  }

  .demo-nav {
    flex-wrap: wrap;
  }
}
```

- [ ] **Step 3: Verify lint + build**

Run:
```bash
npm run lint && npm run build
```
Expected: zero warnings, build green.

- [ ] **Step 4: Manual shell check**

Run `npm run dev`, visit `/demos/commercial-cleaning`. Confirm: header + Calendly CTA render; the 6-item progress indicator shows; Back is disabled on step 1; clicking Next advances the active dot and reveals each stub through to "Reply & results"; Next disabled on the last step; "Restart demo" returns to step 1. Stop the server.

- [ ] **Step 5: Commit**

```bash
git add src/demos/commercialCleaning/DemoPage.tsx src/demos/commercialCleaning/DemoPage.css
git commit -m "feat(demo): add demo page shell with progress, nav, and CTA"
```

---

## Task 5: Steps 1–2 — Define target & Discover

**Files:**
- Create: `src/demos/commercialCleaning/steps/DefineTargetStep.tsx` / `.css`
- Create: `src/demos/commercialCleaning/steps/DiscoverStep.tsx` / `.css`
- Modify: `src/demos/commercialCleaning/DemoPage.tsx` (swap two stubs for real components)

**Interfaces:**
- Consumes: `WorkflowProvider` (`getCompany`, `getICP`, `getTargets`), `usePrefersReducedMotion`.
- Produces: `DefineTargetStep` and `DiscoverStep`, each `({ provider }: { provider: WorkflowProvider })`.

- [ ] **Step 1: Build DefineTargetStep**

Create `src/demos/commercialCleaning/steps/DefineTargetStep.tsx`:
```tsx
import { FaMapMarkerAlt, FaBuilding } from "react-icons/fa";
import type { WorkflowProvider } from "../types";
import "./DefineTargetStep.css";

const DefineTargetStep = ({ provider }: { provider: WorkflowProvider }) => {
  const company = provider.getCompany();
  const icp = provider.getICP();
  return (
    <div className="define-step">
      <h2 className="step-heading">Step 1 — Define the target</h2>
      <p className="step-sub">
        Before any outreach, the workflow locks onto exactly who {company.name}{" "}
        wants as customers.
      </p>

      <div className="define-grid">
        <div className="define-card">
          <FaBuilding className="define-icon" />
          <h3>Ideal facility types</h3>
          <ul className="define-chips">
            {icp.facilityTypes.map((t) => (
              <li key={t} className="define-chip">
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="define-card">
          <FaMapMarkerAlt className="define-icon" />
          <h3>Service area</h3>
          <p className="define-area">{icp.serviceAreaLabel}</p>
          <p className="define-radius">
            {icp.serviceRadiusMiles}-mile service radius
          </p>
        </div>
      </div>
    </div>
  );
};

export default DefineTargetStep;
```

Create `src/demos/commercialCleaning/steps/DefineTargetStep.css`:
```css
.step-heading {
  text-align: center;
  margin-bottom: var(--spacing-xs);
}

.step-sub {
  text-align: center;
  max-width: 560px;
  margin: 0 auto var(--spacing-lg);
}

.define-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-md);
  max-width: 720px;
  margin: 0 auto;
}

@media (min-width: 768px) {
  .define-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.define-card {
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  padding: var(--spacing-md);
  text-align: center;
  background: var(--color-bg-light);
}

.define-icon {
  font-size: 1.75rem;
  color: var(--color-primary);
  margin-bottom: var(--spacing-sm);
}

.define-chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  justify-content: center;
  list-style: none;
  margin-top: var(--spacing-sm);
}

.define-chip {
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
  color: var(--color-text);
}

.define-area {
  font-weight: 600;
  color: var(--color-text);
  margin-top: var(--spacing-sm);
}

.define-radius {
  font-size: 0.9rem;
}
```

- [ ] **Step 2: Build DiscoverStep (animated reveal)**

Create `src/demos/commercialCleaning/steps/DiscoverStep.tsx`:
```tsx
import { useEffect, useRef, useState } from "react";
import { FaMapMarkerAlt, FaGlobe } from "react-icons/fa";
import type { WorkflowProvider } from "../types";
import { usePrefersReducedMotion } from "../usePrefersReducedMotion";
import "./DiscoverStep.css";

const REVEAL_INTERVAL_MS = 350;

const DiscoverStep = ({ provider }: { provider: WorkflowProvider }) => {
  const targets = provider.getTargets();
  const reduced = usePrefersReducedMotion();
  const [revealed, setRevealed] = useState(reduced ? targets.length : 0);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (reduced) {
      setRevealed(targets.length);
      return;
    }
    setRevealed(0);
    for (let i = 1; i <= targets.length; i++) {
      timers.current.push(
        window.setTimeout(() => setRevealed(i), REVEAL_INTERVAL_MS * i),
      );
    }
    const snapshot = timers.current;
    return () => snapshot.forEach((id) => window.clearTimeout(id));
  }, [targets.length, reduced]);

  return (
    <div className="discover-step">
      <h2 className="step-heading">Step 2 — Discover local businesses</h2>
      <p className="step-sub">
        The workflow scans the service area and surfaces facilities that match
        the buy-signals — physical location, no in-house janitorial, inside the
        radius.
      </p>

      <p className="discover-count">
        {revealed} / {targets.length} matched
      </p>

      <ul className="discover-list">
        {targets.map((p, i) => (
          <li
            key={p.id}
            className={
              "discover-card" + (i < revealed ? " is-revealed" : "")
            }
          >
            <div className="discover-card-head">
              <h3>{p.name}</h3>
              <span className="discover-type">{p.facilityType}</span>
            </div>
            <p className="discover-meta">
              <FaMapMarkerAlt /> {p.address}
            </p>
            <p className="discover-meta">
              <FaGlobe /> {p.website}
            </p>
            <ul className="discover-signals">
              {p.matchSignals.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DiscoverStep;
```

Create `src/demos/commercialCleaning/steps/DiscoverStep.css`:
```css
.discover-count {
  text-align: center;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: var(--spacing-md);
}

.discover-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-sm);
  list-style: none;
}

@media (min-width: 768px) {
  .discover-list {
    grid-template-columns: 1fr 1fr;
  }
}

.discover-card {
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  padding: var(--spacing-md);
  background: #fff;
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.discover-card.is-revealed {
  opacity: 1;
  transform: translateY(0);
}

.discover-card-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-xs);
}

.discover-card-head h3 {
  font-size: 1.05rem;
}

.discover-type {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-primary);
  white-space: nowrap;
}

.discover-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: 0.85rem;
  margin-bottom: 0.25rem;
}

.discover-signals {
  margin-top: var(--spacing-sm);
  padding-left: 1.1rem;
  font-size: 0.85rem;
  color: var(--color-text-light);
}

@media (prefers-reduced-motion: reduce) {
  .discover-card {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
```

- [ ] **Step 3: Wire the two steps into the page**

In `src/demos/commercialCleaning/DemoPage.tsx`, add imports near the top (after the existing imports):
```tsx
import DefineTargetStep from "./steps/DefineTargetStep";
import DiscoverStep from "./steps/DiscoverStep";
```
Then in `StepBody`'s `switch`, replace the `define` and `discover` cases:
```tsx
    case "define":
      return <DefineTargetStep provider={provider} />;
    case "discover":
      return <DiscoverStep provider={provider} />;
```

- [ ] **Step 4: Verify lint + build**

Run:
```bash
npm run lint && npm run build
```
Expected: zero warnings, build green.

- [ ] **Step 5: Manual check**

`npm run dev` → `/demos/commercial-cleaning`. Step 1 shows ICP facility chips + service area. Step 2 reveals all 9 prospect cards one-by-one with the running count reaching `9 / 9`. Stop the server.

- [ ] **Step 6: Commit**

```bash
git add src/demos/commercialCleaning/steps/DefineTargetStep.tsx src/demos/commercialCleaning/steps/DefineTargetStep.css src/demos/commercialCleaning/steps/DiscoverStep.tsx src/demos/commercialCleaning/steps/DiscoverStep.css src/demos/commercialCleaning/DemoPage.tsx
git commit -m "feat(demo): add Define target and Discover steps"
```

---

## Task 6: Steps 3–4 — Enrich & qualify, Personalize

**Files:**
- Create: `src/demos/commercialCleaning/steps/EnrichQualifyStep.tsx` / `.css`
- Create: `src/demos/commercialCleaning/steps/PersonalizeStep.tsx` / `.css`
- Modify: `src/demos/commercialCleaning/DemoPage.tsx` (swap two stubs)

**Interfaces:**
- Consumes: `WorkflowProvider` (`getTargets`, `getEnrichment`, `getEmail`, `getFeaturedProspectId`), `usePrefersReducedMotion`.
- Produces: `EnrichQualifyStep` and `PersonalizeStep`, each `({ provider }: { provider: WorkflowProvider })`.

- [ ] **Step 1: Build EnrichQualifyStep (drop-offs with reasons)**

Create `src/demos/commercialCleaning/steps/EnrichQualifyStep.tsx`:
```tsx
import { FaCheckCircle, FaTimesCircle, FaUser, FaPhone } from "react-icons/fa";
import type { WorkflowProvider } from "../types";
import "./EnrichQualifyStep.css";

const EnrichQualifyStep = ({ provider }: { provider: WorkflowProvider }) => {
  const targets = provider.getTargets();
  const rows = targets.map((p) => ({
    prospect: p,
    enrichment: provider.getEnrichment(p.id),
  }));
  const qualified = rows.filter((r) => r.enrichment.qualified);
  const dropped = rows.filter((r) => !r.enrichment.qualified);

  return (
    <div className="enrich-step">
      <h2 className="step-heading">Step 3 — Enrich &amp; qualify</h2>
      <p className="step-sub">
        Contact and facility details fill in per prospect — and the workflow
        drops the ones that aren't a fit. It targets, it doesn't spray.
      </p>

      <p className="enrich-summary">
        <span className="enrich-pill enrich-pill-ok">
          {qualified.length} qualified
        </span>
        <span className="enrich-pill enrich-pill-drop">
          {dropped.length} dropped
        </span>
      </p>

      <ul className="enrich-list">
        {rows.map(({ prospect, enrichment }) => (
          <li
            key={prospect.id}
            className={
              "enrich-card" +
              (enrichment.qualified ? " is-qualified" : " is-dropped")
            }
          >
            <div className="enrich-card-head">
              {enrichment.qualified ? (
                <FaCheckCircle className="enrich-status-ok" />
              ) : (
                <FaTimesCircle className="enrich-status-drop" />
              )}
              <h3>{prospect.name}</h3>
            </div>

            {enrichment.qualified ? (
              <div className="enrich-details">
                <p>
                  <FaUser /> {enrichment.contactName} — {enrichment.contactTitle}
                </p>
                <p>
                  <FaPhone /> {enrichment.phone}
                </p>
                <p className="enrich-facility">{enrichment.facilityDetail}</p>
              </div>
            ) : (
              <p className="enrich-reason">Dropped — {enrichment.dropReason}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EnrichQualifyStep;
```

Create `src/demos/commercialCleaning/steps/EnrichQualifyStep.css`:
```css
.enrich-summary {
  display: flex;
  gap: var(--spacing-sm);
  justify-content: center;
  margin-bottom: var(--spacing-md);
}

.enrich-pill {
  padding: 0.25rem 0.85rem;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.85rem;
}

.enrich-pill-ok {
  background: rgba(16, 185, 129, 0.12);
  color: var(--color-success);
}

.enrich-pill-drop {
  background: rgba(100, 116, 139, 0.12);
  color: var(--color-secondary);
}

.enrich-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-sm);
  list-style: none;
}

@media (min-width: 768px) {
  .enrich-list {
    grid-template-columns: 1fr 1fr;
  }
}

.enrich-card {
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  padding: var(--spacing-md);
  background: #fff;
}

.enrich-card.is-dropped {
  background: var(--color-bg-light);
  opacity: 0.85;
}

.enrich-card-head {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-sm);
}

.enrich-card-head h3 {
  font-size: 1.02rem;
}

.enrich-status-ok {
  color: var(--color-success);
}

.enrich-status-drop {
  color: var(--color-secondary);
}

.enrich-details p {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: 0.85rem;
  margin-bottom: 0.25rem;
}

.enrich-facility {
  color: var(--color-text-light);
}

.enrich-reason {
  font-size: 0.9rem;
  color: var(--color-secondary);
  font-style: italic;
}
```

- [ ] **Step 2: Build PersonalizeStep (email "writes in")**

Create `src/demos/commercialCleaning/steps/PersonalizeStep.tsx`:
```tsx
import { useEffect, useRef, useState } from "react";
import type { WorkflowProvider } from "../types";
import { usePrefersReducedMotion } from "../usePrefersReducedMotion";
import "./PersonalizeStep.css";

const CHARS_PER_TICK = 4;
const TICK_MS = 16;

const PersonalizeStep = ({ provider }: { provider: WorkflowProvider }) => {
  const prospectId = provider.getFeaturedProspectId();
  const email = provider.getEmail(prospectId);
  const enrichment = provider.getEnrichment(prospectId);
  const reduced = usePrefersReducedMotion();

  const [typed, setTyped] = useState(reduced ? email.body.length : 0);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (reduced) {
      setTyped(email.body.length);
      return;
    }
    setTyped(0);
    timer.current = window.setInterval(() => {
      setTyped((n) => {
        const next = n + CHARS_PER_TICK;
        if (next >= email.body.length && timer.current !== null) {
          window.clearInterval(timer.current);
          timer.current = null;
          return email.body.length;
        }
        return next;
      });
    }, TICK_MS);
    return () => {
      if (timer.current !== null) window.clearInterval(timer.current);
    };
  }, [email.body.length, reduced]);

  const isDone = typed >= email.body.length;

  return (
    <div className="personalize-step">
      <h2 className="step-heading">Step 4 — Personalize the outreach</h2>
      <p className="step-sub">
        For each qualified prospect, a tailored cold email is written —
        referencing specifics about them, not a generic blast. Here's{" "}
        {enrichment.contactName} at the top of the list.
      </p>

      <div className="email-card">
        <div className="email-meta">
          <p>
            <span className="email-label">To:</span> {enrichment.contactName}{" "}
            &lt;{enrichment.email}&gt;
          </p>
          <p>
            <span className="email-label">Subject:</span> {email.subject}
          </p>
        </div>
        <pre className={"email-body" + (isDone ? "" : " is-typing")}>
          {email.body.slice(0, typed)}
        </pre>
        <p className="email-footer">{email.footer}</p>
      </div>
    </div>
  );
};

export default PersonalizeStep;
```

Create `src/demos/commercialCleaning/steps/PersonalizeStep.css`:
```css
.email-card {
  max-width: 640px;
  margin: 0 auto;
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  overflow: hidden;
  background: #fff;
}

.email-meta {
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-bg-light);
}

.email-meta p {
  font-size: 0.9rem;
  color: var(--color-text);
  margin-bottom: 0.25rem;
  word-break: break-word;
}

.email-label {
  font-weight: 700;
  color: var(--color-text-light);
  margin-right: 0.35rem;
}

.email-body {
  padding: var(--spacing-md);
  margin: 0;
  font-family: var(--font-sans);
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--color-text);
  white-space: pre-wrap;
  min-height: 14rem;
}

.email-body.is-typing::after {
  content: "▋";
  color: var(--color-primary);
  animation: email-caret 1s steps(1) infinite;
}

@keyframes email-caret {
  50% {
    opacity: 0;
  }
}

.email-footer {
  padding: var(--spacing-sm) var(--spacing-md) var(--spacing-md);
  font-size: 0.7rem;
  color: var(--color-text-light);
  border-top: 1px solid var(--color-border);
}

@media (prefers-reduced-motion: reduce) {
  .email-body.is-typing::after {
    content: "";
    animation: none;
  }
}
```

- [ ] **Step 3: Wire the two steps into the page**

In `src/demos/commercialCleaning/DemoPage.tsx`, add imports:
```tsx
import EnrichQualifyStep from "./steps/EnrichQualifyStep";
import PersonalizeStep from "./steps/PersonalizeStep";
```
Replace the `enrich` and `personalize` cases in `StepBody`'s `switch`:
```tsx
    case "enrich":
      return <EnrichQualifyStep provider={provider} />;
    case "personalize":
      return <PersonalizeStep provider={provider} />;
```

- [ ] **Step 4: Verify lint + build**

Run:
```bash
npm run lint && npm run build
```
Expected: zero warnings, build green.

- [ ] **Step 5: Manual check**

`npm run dev` → step 3 shows `6 qualified / 3 dropped`, with the 3 dropped cards stating residential / competitor / no-decision-maker reasons. Step 4 types the email in with a caret, then settles showing subject, body, and CAN-SPAM footer. Stop the server.

- [ ] **Step 6: Commit**

```bash
git add src/demos/commercialCleaning/steps/EnrichQualifyStep.tsx src/demos/commercialCleaning/steps/EnrichQualifyStep.css src/demos/commercialCleaning/steps/PersonalizeStep.tsx src/demos/commercialCleaning/steps/PersonalizeStep.css src/demos/commercialCleaning/DemoPage.tsx
git commit -m "feat(demo): add Enrich & qualify and Personalize steps"
```

---

## Task 7: Steps 5–6 — Send (mocked) & Reply/Results

**Files:**
- Create: `src/demos/commercialCleaning/steps/SendStep.tsx` / `.css`
- Create: `src/demos/commercialCleaning/steps/ResultsStep.tsx` / `.css`
- Modify: `src/demos/commercialCleaning/DemoPage.tsx` (swap final two stubs)

**Interfaces:**
- Consumes: `WorkflowProvider` (`getFeaturedProspectId`, `getEnrichment`, `getEmail`, `send`, `getReply`, `getResults`), `useDemo` (`sendStatus`, `startSend`, `markReplied`), `usePrefersReducedMotion`.
- Produces: `SendStep` and `ResultsStep`, each `({ provider }: { provider: WorkflowProvider })`.

- [ ] **Step 1: Build SendStep (timed lifecycle in faux outbox)**

Create `src/demos/commercialCleaning/steps/SendStep.tsx`:
```tsx
import { useEffect, useRef } from "react";
import { FaPaperPlane, FaInbox, FaCheck, FaEnvelopeOpen } from "react-icons/fa";
import type { WorkflowProvider } from "../types";
import { useDemo, type SendStatus } from "../DemoController";
import "./SendStep.css";

const ORDER: SendStatus[] = ["sending", "delivered", "opened"];

function statusRank(s: SendStatus): number {
  if (s === "idle") return -1;
  if (s === "replied") return ORDER.length - 1; // treat as "opened or beyond"
  return ORDER.indexOf(s);
}

const SendStep = ({ provider }: { provider: WorkflowProvider }) => {
  const prospectId = provider.getFeaturedProspectId();
  const enrichment = provider.getEnrichment(prospectId);
  const email = provider.getEmail(prospectId);
  const { sendStatus, startSend } = useDemo();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    // Fire-and-forget mocked network send; the timed lifecycle is driven by the controller.
    void provider.send(email);
    startSend();
  }, [provider, email, startSend]);

  const rank = statusRank(sendStatus);

  const stages = [
    { id: "sending", label: "Sending", icon: <FaPaperPlane /> },
    { id: "delivered", label: "Delivered", icon: <FaCheck /> },
    { id: "opened", label: "Opened", icon: <FaEnvelopeOpen /> },
  ];

  return (
    <div className="send-step">
      <h2 className="step-heading">Step 5 — Send</h2>
      <p className="step-sub">
        The email goes out to {enrichment.contactName}. Watch it move through
        the lifecycle — sent, delivered, opened.
      </p>

      <div className="send-outbox">
        <div className="send-envelope">
          <FaInbox className="send-envelope-icon" />
          <div>
            <p className="send-envelope-to">{enrichment.email}</p>
            <p className="send-envelope-subject">{email.subject}</p>
          </div>
        </div>

        <ol className="send-stages">
          {stages.map((stage, i) => (
            <li
              key={stage.id}
              className={
                "send-stage" +
                (rank >= i ? " is-active" : "") +
                (rank > i ? " is-done" : "")
              }
            >
              <span className="send-stage-icon">{stage.icon}</span>
              <span className="send-stage-label">{stage.label}</span>
            </li>
          ))}
        </ol>

        {sendStatus === "opened" && (
          <p className="send-done-note">
            Opened — when a prospect engages, that's your signal. Continue to see
            what comes back.
          </p>
        )}
      </div>
    </div>
  );
};

export default SendStep;
```

Create `src/demos/commercialCleaning/steps/SendStep.css`:
```css
.send-outbox {
  max-width: 560px;
  margin: 0 auto;
}

.send-envelope {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  padding: var(--spacing-md);
  background: #fff;
  margin-bottom: var(--spacing-lg);
}

.send-envelope-icon {
  font-size: 1.5rem;
  color: var(--color-primary);
}

.send-envelope-to {
  font-weight: 600;
  color: var(--color-text);
  font-size: 0.9rem;
}

.send-envelope-subject {
  font-size: 0.85rem;
}

.send-stages {
  display: flex;
  justify-content: space-between;
  gap: var(--spacing-sm);
  list-style: none;
}

.send-stage {
  flex: 1;
  text-align: center;
  opacity: 0.4;
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.send-stage.is-active {
  opacity: 1;
}

.send-stage-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid var(--color-border);
  background: #fff;
  color: var(--color-text-light);
  font-size: 1.1rem;
  margin-bottom: var(--spacing-xs);
  transition: all 0.4s ease;
}

.send-stage.is-active .send-stage-icon {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.send-stage.is-done .send-stage-icon {
  border-color: var(--color-success);
  background: var(--color-success);
  color: #fff;
}

.send-stage-label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
}

.send-done-note {
  text-align: center;
  margin-top: var(--spacing-lg);
  color: var(--color-text-light);
}

@media (prefers-reduced-motion: reduce) {
  .send-stage,
  .send-stage-icon {
    transition: none;
  }
}
```

- [ ] **Step 2: Build ResultsStep (reply lands + tally)**

Create `src/demos/commercialCleaning/steps/ResultsStep.tsx`:
```tsx
import { useEffect, useRef, useState } from "react";
import { FaReply } from "react-icons/fa";
import type { WorkflowProvider } from "../types";
import { useDemo } from "../DemoController";
import { usePrefersReducedMotion } from "../usePrefersReducedMotion";
import "./ResultsStep.css";

const REPLY_DELAY_MS = 700;

const ResultsStep = ({ provider }: { provider: WorkflowProvider }) => {
  const prospectId = provider.getFeaturedProspectId();
  const reply = provider.getReply(prospectId);
  const results = provider.getResults();
  const { markReplied } = useDemo();
  const reduced = usePrefersReducedMotion();
  const [showReply, setShowReply] = useState(reduced);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (reduced) {
      setShowReply(true);
      markReplied();
      return;
    }
    timer.current = window.setTimeout(() => {
      setShowReply(true);
      markReplied();
    }, REPLY_DELAY_MS);
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, [reduced, markReplied]);

  return (
    <div className="results-step">
      <h2 className="step-heading">Step 6 — Reply &amp; results</h2>
      <p className="step-sub">
        {reply.receivedLabel}, a reply lands in the inbox.
      </p>

      <div className={"reply-card" + (showReply ? " is-shown" : "")}>
        <div className="reply-head">
          <FaReply className="reply-icon" />
          <div>
            <p className="reply-from">{reply.fromName}</p>
            <p className="reply-subject">{reply.subject}</p>
          </div>
        </div>
        <pre className="reply-body">{reply.body}</pre>
      </div>

      <div className="results-tally">
        <div className="tally-item">
          <span className="tally-num">{results.sent}</span>
          <span className="tally-label">Sent</span>
        </div>
        <div className="tally-item">
          <span className="tally-num">{results.opened}</span>
          <span className="tally-label">Opened</span>
        </div>
        <div className="tally-item tally-item-hl">
          <span className="tally-num">{results.replied}</span>
          <span className="tally-label">Replied</span>
        </div>
      </div>

      <p className="results-takeaway">{results.takeaway}</p>
    </div>
  );
};

export default ResultsStep;
```

Create `src/demos/commercialCleaning/steps/ResultsStep.css`:
```css
.reply-card {
  max-width: 560px;
  margin: 0 auto var(--spacing-lg);
  border: 1px solid var(--color-border);
  border-left: 4px solid var(--color-success);
  border-radius: 0.75rem;
  padding: var(--spacing-md);
  background: #fff;
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.reply-card.is-shown {
  opacity: 1;
  transform: translateY(0);
}

.reply-head {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
}

.reply-icon {
  color: var(--color-success);
  font-size: 1.25rem;
}

.reply-from {
  font-weight: 700;
  color: var(--color-text);
}

.reply-subject {
  font-size: 0.85rem;
}

.reply-body {
  margin: 0;
  font-family: var(--font-sans);
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--color-text);
  white-space: pre-wrap;
}

.results-tally {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.tally-item {
  text-align: center;
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--color-bg-light);
}

.tally-item-hl {
  border-color: var(--color-success);
  background: rgba(16, 185, 129, 0.08);
}

.tally-num {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text);
}

.tally-label {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-light);
}

.results-takeaway {
  max-width: 560px;
  margin: 0 auto;
  text-align: center;
  font-weight: 600;
  color: var(--color-text);
}

@media (prefers-reduced-motion: reduce) {
  .reply-card {
    transition: none;
  }
}
```

- [ ] **Step 3: Wire the final two steps into the page**

In `src/demos/commercialCleaning/DemoPage.tsx`, add imports:
```tsx
import SendStep from "./steps/SendStep";
import ResultsStep from "./steps/ResultsStep";
```
Replace the `send` and `results` cases in `StepBody`'s `switch`:
```tsx
    case "send":
      return <SendStep provider={provider} />;
    case "results":
      return <ResultsStep provider={provider} />;
```

- [ ] **Step 4: Verify lint + build**

Run:
```bash
npm run lint && npm run build
```
Expected: zero warnings, build green.

- [ ] **Step 5: Manual check (full lifecycle + cleanup)**

`npm run dev` → step 5: on entry the lifecycle animates Sending → Delivered → Opened. Step 6: after a beat the reply card slides in and the tally reads Sent 6 / Opened 4 / Replied 1 with the takeaway line. Click "Restart demo" mid-send (step 5) and confirm no stray transitions occur and the demo returns to step 1. Re-walk forward once more to confirm timers re-arm correctly. Stop the server.

- [ ] **Step 6: Commit**

```bash
git add src/demos/commercialCleaning/steps/SendStep.tsx src/demos/commercialCleaning/steps/SendStep.css src/demos/commercialCleaning/steps/ResultsStep.tsx src/demos/commercialCleaning/steps/ResultsStep.css src/demos/commercialCleaning/DemoPage.tsx
git commit -m "feat(demo): add Send and Reply/Results steps"
```

---

## Task 8: Docs update + full-walkthrough verification

**Files:**
- Modify: `CLAUDE.md` (project file)
- Verify only: `netlify.toml`

**Interfaces:** none (documentation + final gate).

- [ ] **Step 1: Update the "No routing" note in CLAUDE.md**

In `/Users/brian/Development/paradigm/consulting-website/CLAUDE.md`, under "Key Details", replace the line:
```
- **No routing** — single scrolling page, no React Router
```
with:
```
- **Routing** — `react-router-dom` v6. `/` → landing page (`components/Home.tsx`); `/demos/commercial-cleaning` → scripted product-tour demo (`src/demos/commercialCleaning/`). Netlify SPA fallback in `netlify.toml`.
```

Also under "Project Structure", add a note after the `src/` tree:
```
src/demos/commercialCleaning/  # Scripted commercial-cleaning prospecting demo (route /demos/commercial-cleaning)
```

- [ ] **Step 2: Confirm the Netlify SPA redirect exists**

Run:
```bash
cat netlify.toml
```
Expected: contains a `[[redirects]]` block with `from = "/*"`, `to = "/index.html"`, `status = 200`. (Already present — no edit needed. If missing, add it.)

- [ ] **Step 3: Final lint + build gate**

Run:
```bash
npm run lint && npm run build
```
Expected: zero warnings, build green.

- [ ] **Step 4: Full manual walkthrough (desktop + mobile widths)**

Run `npm run dev`. With browser devtools, test at desktop width and at a ≤768px mobile width:
- Landing page `/` unchanged.
- `/demos/commercial-cleaning`: all six steps render and read correctly; progress indicator tracks; Back/Next bounds hold (Back disabled on step 1, Next disabled on step 6); persistent Calendly CTA visible and opens in a new tab; "Restart demo" returns to step 1 and clears any in-flight send.
- Toggle OS "reduce motion" on and reload: reveals/typing/lifecycle collapse to instant final states; no animation runs.
- Direct-load `/demos/commercial-cleaning` (deep link) resolves via the SPA fallback (test against `npm run preview` build output, since the dev server always serves index).

Run the preview deep-link check:
```bash
npm run build && npm run preview
```
Visit `http://localhost:4173/demos/commercial-cleaning` directly — page loads (no 404). Stop the server.

- [ ] **Step 5: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update routing notes for commercial-cleaning demo"
```

---

## Self-Review (completed against the spec)

- **§4 single route `/demos/commercial-cleaning`, 6-step walkthrough, no network** → Tasks 1, 4–7. ✓
- **§5 routing + `/` refactor + Netlify SPA fallback** → Task 1 (router/Home), Task 8 Step 2 (redirect already present). ✓
- **§5 step state machine + DemoController + timed send sub-machine with setTimeout/CSS** → Task 3 (`DemoController`), Tasks 5–7 (CSS transitions). ✓
- **§5 phase-2 seam: `WorkflowProvider` interface, `ScriptedWorkflowProvider`** → Task 2 (interface superset of the spec's, UI reads only through it). ✓
- **§6 six steps incl. drop-offs with reasons, personalized email + footer, mocked send lifecycle, simulated reply + tally** → Tasks 5–7. ✓
- **§6 navigation: Back/Next, progress indicator, Restart, persistent CTA** → Task 4. ✓
- **§7 content model: 1 company, ~8–10 prospects (9, mixed), email(s) + footer, 1 reply** → Task 2 `script.ts`. ✓
- **§8 vanilla CSS, paired files, reuse tokens, react-icons, responsive** → all step/page tasks. ✓
- **§9 edge cases: no network paths, nav bounds, timer cleanup on unmount/restart, prefers-reduced-motion** → Task 3 (`clearTimers`, bounds), Task 8 Step 4 (reduced-motion check). ✓
- **§10 DoD: lint zero-warnings, build green, manual walkthrough desktop+mobile; Vitest optional/deferred** → every task gates on lint+build; Task 8 full walkthrough. ✓
- **§11 affected files** → all covered; `CLAUDE.md` note updated in Task 8. ✓

**Type consistency:** `WorkflowProvider` method names and the `StepId`/`SendStatus` unions are defined once (Tasks 2–3) and referenced verbatim in Tasks 4–7. Each step component uses the uniform `({ provider }: { provider: WorkflowProvider })` prop shape.

**Note on the spec's `WorkflowProvider` sketch:** the plan's interface adds `getCompany()`, `getResults()`, and `getFeaturedProspectId()` beyond the spec's six methods. These are additive conveniences the UI needs; the spec's listed methods are all present with the same intent. Flag for Brian if he'd rather keep the interface to the spec's exact six.

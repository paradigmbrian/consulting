# New-Customer Onboarding Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the interactive "New-Customer Onboarding" click-through demo (eighth in the suite) on the shared demo engine, and link it from its example card on the Automated Workflows page.

**Architecture:** A new thin folder `src/demos/newCustomerOnboarding/` mirroring `src/demos/weeklyReports/` — a scripted `WorkflowProvider` feeds six step components rendered through the shared `DemoProvider → SendLifecycleProvider → DemoShell` composition. Two steps are AI-powered and render the shared `AiPanel`; the `deliver` step reuses the shared send lifecycle; the `schedule` step is a self-contained timed reveal. No engine/shared changes.

**Tech Stack:** React 18 + TypeScript, Vite 5, vanilla CSS with `--demo-*`/`--spacing-*` custom properties, `react-icons/fa`, `react-router-dom` v6.

## Global Constraints

- **Spec:** `docs/superpowers/specs/2026-07-13-new-customer-onboarding-demo-design.md`. Every task's requirements implicitly include it.
- **No engine/shared changes.** Only add files under `src/demos/newCustomerOnboarding/` plus two one-line edits (`src/App.tsx`, `src/components/AutomatedWorkflows.tsx`).
- **Route:** `/demos/onboarding`. **Folder:** `src/demos/newCustomerOnboarding/`. **CSS prefix:** `nco-*`.
- **Two AI steps** (`isAi: true`) are `compose` and `packet` — `AiStep = "compose" | "packet"`.
- **Read-only git.** Do NOT run any git write command (no `add`/`commit`). Each task ends by verifying the build; leave changes in the working tree. Commit commands are surfaced to the user at the end.
- **No test framework exists.** The per-task test cycle is `npm run build` (tsc + Vite — must pass with no errors and no unused imports). `npm run lint` (zero warnings) is the final gate in Task 8.
- **Styling tokens** come from the scoped `.demo` palette: `--demo-text`, `--demo-muted`, `--demo-surface-2`, `--demo-border`, `--demo-success`, `--demo-accent`, `--demo-accent-bright`, and `--spacing-xs/sm/md`. Amber accent literal is `#f4b740` (matches sibling demos). Do not introduce new global tokens.
- **Copy values are illustrative and tunable**, but the `WorkflowProvider` interface (Task 1) is fixed — later tasks depend on its exact method and property names.

---

### Task 1: Data layer — types, script, provider, base CSS

**Files:**
- Create: `src/demos/newCustomerOnboarding/types.ts`
- Create: `src/demos/newCustomerOnboarding/script.ts`
- Create: `src/demos/newCustomerOnboarding/provider.ts`
- Create: `src/demos/newCustomerOnboarding/onboarding.css`

**Interfaces:**
- Consumes: nothing (first task).
- Produces: the `WorkflowProvider` interface and all data types; `scriptedWorkflowProvider: WorkflowProvider`. Every step component (Tasks 2–7) imports `WorkflowProvider` (and, where noted, `PacketStatus`) from `./types` and receives the provider as a prop. `onboarding.css` is imported once by `OnboardingDemo.tsx` (Task 8); Tasks 2–7 append to it.

- [ ] **Step 1: Verify the react-icons/fa exports this feature uses all exist**

Run:
```bash
node -e "const fa=require('react-icons/fa'); ['FaUserPlus','FaPenFancy','FaClipboardCheck','FaPaperPlane','FaCalendarCheck','FaChartLine','FaCheck','FaClock','FaEnvelopeOpenText','FaCheckCircle','FaUserCircle'].forEach(n=>{if(!fa[n])throw new Error('MISSING '+n); }); console.log('all icons present');"
```
Expected: `all icons present`. (If any is missing, stop and report — do not substitute silently.)

- [ ] **Step 2: Create `types.ts`**

```ts
export type AiStep = "compose" | "packet";
export type PacketStatus = "ready" | "collected" | "requested";

export interface Business {
  name: string;
  service: string;
  context: string;
}

export interface Signup {
  customerName: string;
  address: string;
  serviceBooked: string;
  bookedVia: string;
  intakeFacts: string[];
}

export interface Welcome {
  greeting: string;
  body: string[];
  whatToExpect: string[];
}

export interface PacketItem {
  label: string;
  detail: string;
  status: PacketStatus;
}

export interface Delivery {
  recipientName: string;
  channel: string;
  sentLabel: string;
}

export interface FirstVisit {
  slotLabel: string;
  tech: string;
  confirmation: string;
  detail: string;
}

export interface ResultsSummary {
  customersOnboarded: number;
  avgTimeToFirstVisit: string;
  agreementsSigned: string;
  hoursSaved: string;
  takeaway: string;
}

export interface AiReasoning {
  step: AiStep;
  title: string;
  lines: string[];
}

export interface WorkflowProvider {
  getBusiness(): Business;
  getSignup(): Signup;
  getWelcome(): Welcome;
  getPacket(): PacketItem[];
  getDelivery(): Delivery;
  getFirstVisit(): FirstVisit;
  getResults(): ResultsSummary;
  getAiReasoning(step: AiStep): AiReasoning;
}
```

- [ ] **Step 3: Create `script.ts`**

```ts
import type {
  Business,
  Signup,
  Welcome,
  PacketItem,
  Delivery,
  FirstVisit,
  ResultsSummary,
  AiStep,
  AiReasoning,
} from "./types";

export const business: Business = {
  name: "Clearwater Pool Care",
  service: "Weekly pool cleaning & maintenance",
  context:
    "Every new customer used to mean 20 minutes of welcome email, chasing a signed agreement, and hunting for a gate code before the first visit.",
};

export const signup: Signup = {
  customerName: "Marcus Bell",
  address: "14 Aldercreek Dr",
  serviceBooked: "Weekly pool service — in-ground",
  bookedVia: "Website booking form · Sat 4:12 PM",
  intakeFacts: [
    "In-ground pool, ~18,000 gal",
    "Saltwater system",
    "Prefers morning visits",
    "Card entered at booking",
  ],
};

export const welcome: Welcome = {
  greeting: "Welcome to Clearwater, Marcus!",
  body: [
    "Thanks for choosing Clearwater Pool Care — your weekly service is all set, and we'll keep your water clear and balanced so you never have to think about it.",
    "Your regular technician will be Diego, who runs the Aldercreek route. He'll test and balance your water, clean the pool, and check your saltwater system on every visit.",
  ],
  whatToExpect: [
    "A dependable weekly visit — same day each week, no need to be home.",
    "A photo and quick service summary texted to you after every clean.",
    "Balanced water and a healthy salt system, checked every single time.",
  ],
};

export const packet: PacketItem[] = [
  {
    label: "Service agreement",
    detail: "Weekly terms & auto-pay — one tap to sign",
    status: "requested",
  },
  {
    label: "Gate / pool access",
    detail: "Gate code or access notes so Diego can reach the pool",
    status: "requested",
  },
  {
    label: "Equipment profile",
    detail: "In-ground · ~18,000 gal · saltwater — pulled from your booking",
    status: "ready",
  },
  {
    label: "Billing on file",
    detail: "Card saved at booking — weekly auto-pay ready",
    status: "collected",
  },
  {
    label: "First-visit window",
    detail: "Proposed and confirmed automatically",
    status: "ready",
  },
];

export const delivery: Delivery = {
  recipientName: "Marcus",
  channel: "Text + email",
  sentLabel: "Sat 4:14 PM",
};

export const firstVisit: FirstVisit = {
  slotLabel: "Thursday, Jul 17 · 8:00–9:30 AM",
  tech: "Diego R.",
  confirmation: "First visit booked — Thursday 8:00 AM.",
  detail:
    "Added to Diego's Aldercreek route. Marcus gets a reminder the day before, and you never touched the calendar.",
};

export const results: ResultsSummary = {
  customersOnboarded: 34,
  avgTimeToFirstVisit: "3.5 days",
  agreementsSigned: "94% same-day",
  hoursSaved: "~11 hrs/mo",
  takeaway:
    "Thirty-four new customers welcomed the moment they booked — agreements signed same-day, first visits on the calendar in under four days, and not one evening lost to welcome emails. Every pool starts on the right foot.",
};

export const aiReasoning: Record<AiStep, AiReasoning> = {
  compose: {
    step: "compose",
    title: "Claude — composing Marcus's welcome",
    lines: [
      "Pulling the booking: weekly service, in-ground saltwater pool, prefers mornings.",
      "Greeting Marcus by name and confirming exactly what he signed up for.",
      "Assigning a regular tech — Diego, Aldercreek route — so it feels personal, not corporate.",
      "Setting three clear expectations for a recurring service he shouldn't have to think about.",
      "Keeping it warm and under a 20-second read — the voice of an owner who cares.",
    ],
  },
  packet: {
    step: "packet",
    title: "Claude — assembling the onboarding packet",
    lines: [
      "Listing everything a new weekly customer needs before the first visit.",
      "Auto-filling what the booking already gave us: equipment profile and card on file.",
      "Flagging what only Marcus can provide: a signed agreement and gate/pool access.",
      "Turning the agreement into a one-tap sign and requesting the gate code in the same message.",
      "Tracking each item's status so nothing has to be chased by hand.",
    ],
  },
};
```

- [ ] **Step 4: Create `provider.ts`**

```ts
import type {
  Business,
  Signup,
  Welcome,
  PacketItem,
  Delivery,
  FirstVisit,
  ResultsSummary,
  AiStep,
  AiReasoning,
  WorkflowProvider,
} from "./types";
import {
  business,
  signup,
  welcome,
  packet,
  delivery,
  firstVisit,
  results,
  aiReasoning,
} from "./script";

class ScriptedWorkflowProvider implements WorkflowProvider {
  getBusiness(): Business {
    return business;
  }

  getSignup(): Signup {
    return signup;
  }

  getWelcome(): Welcome {
    return welcome;
  }

  getPacket(): PacketItem[] {
    return packet;
  }

  getDelivery(): Delivery {
    return delivery;
  }

  getFirstVisit(): FirstVisit {
    return firstVisit;
  }

  getResults(): ResultsSummary {
    return results;
  }

  getAiReasoning(step: AiStep): AiReasoning {
    return aiReasoning[step];
  }
}

export const scriptedWorkflowProvider: WorkflowProvider =
  new ScriptedWorkflowProvider();
```

- [ ] **Step 5: Create `onboarding.css` with the base classes**

```css
.nco-step {
  color: var(--demo-text);
}

.nco-heading {
  font-size: 1.15rem;
  margin: 0 0 var(--spacing-xs);
}

.nco-sub {
  color: var(--demo-muted);
  margin: 0 0 var(--spacing-md);
  max-width: 60ch;
}

.nco-note {
  color: var(--demo-muted);
  font-size: 0.85rem;
  margin: var(--spacing-md) 0 0;
}

/* Reveal wrapper (shared by the compose + packet steps) */
.nco-reveal {
  opacity: 0;
  transform: translateY(6px);
  transition: opacity 0.4s ease, transform 0.4s ease;
  margin-top: var(--spacing-md);
}
.nco-reveal.is-shown {
  opacity: 1;
  transform: none;
}
```

- [ ] **Step 6: Verify the build**

Run: `npm run build`
Expected: PASS — no TypeScript errors. (The new files are not yet imported anywhere, so this only type-checks them. Unused `PacketStatus` etc. are fine because they are exported types.)

---

### Task 2: SignupStep — the raw booking (step 1)

**Files:**
- Create: `src/demos/newCustomerOnboarding/steps/SignupStep.tsx`
- Modify (append): `src/demos/newCustomerOnboarding/onboarding.css`

**Interfaces:**
- Consumes: `WorkflowProvider` from `../types`; `provider.getBusiness()`, `provider.getSignup()`.
- Produces: `default` export `SignupStep`, a component taking `{ provider: WorkflowProvider }`, rendered by Task 8 for `case "signup"`.

- [ ] **Step 1: Create `steps/SignupStep.tsx`**

```tsx
import { FaUserPlus } from "react-icons/fa";
import type { WorkflowProvider } from "../types";

const SignupStep = ({ provider }: { provider: WorkflowProvider }) => {
  const business = provider.getBusiness();
  const signup = provider.getSignup();

  return (
    <div className="nco-step">
      <h3 className="nco-heading">
        A new customer just booked — the clock starts now
      </h3>
      <p className="nco-sub">
        {signup.customerName} signed up for {business.name} through the website.
        It's a bare form submission — a name, an address, and a few facts.
        Turning that into a welcomed, ready-to-serve customer used to cost the
        owner 20 minutes.
      </p>

      <div className="nco-booking">
        <div className="nco-booking-head">
          <FaUserPlus className="nco-booking-icon" aria-hidden="true" />
          <div className="nco-booking-headmeta">
            <p className="nco-booking-name">{signup.customerName}</p>
            <p className="nco-booking-address">{signup.address}</p>
          </div>
          <span className="nco-booking-via">{signup.bookedVia}</span>
        </div>

        <div className="nco-booking-service">
          <span className="nco-booking-label">Booked</span>
          <span className="nco-booking-value">{signup.serviceBooked}</span>
        </div>

        <ul className="nco-facts">
          {signup.intakeFacts.map((f) => (
            <li key={f} className="nco-fact">
              {f}
            </li>
          ))}
        </ul>
      </div>

      <p className="nco-note">
        Raw and impersonal — exactly where onboarding usually stalls.
      </p>
    </div>
  );
};

export default SignupStep;
```

- [ ] **Step 2: Append the booking-card styles to `onboarding.css`**

```css
/* Booking card (step 1) — the raw form submission */
.nco-booking {
  padding: var(--spacing-md);
  background: var(--demo-surface-2);
  border: 1px solid var(--demo-border);
  border-radius: 0.6rem;
}
.nco-booking-head {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--demo-border);
}
.nco-booking-icon {
  flex: 0 0 auto;
  font-size: 1.4rem;
  color: var(--demo-accent-bright);
}
.nco-booking-headmeta {
  min-width: 0;
  flex: 1 1 auto;
}
.nco-booking-name {
  margin: 0;
  font-weight: 700;
  color: var(--demo-text);
}
.nco-booking-address {
  margin: 0.1rem 0 0;
  font-size: 0.85rem;
  color: var(--demo-muted);
}
.nco-booking-via {
  flex: 0 0 auto;
  font-size: 0.75rem;
  color: var(--demo-muted);
  text-align: right;
}
.nco-booking-service {
  display: flex;
  align-items: baseline;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) 0;
}
.nco-booking-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--demo-muted);
}
.nco-booking-value {
  font-weight: 700;
  color: var(--demo-text);
}
.nco-facts {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}
.nco-fact {
  font-size: 0.8rem;
  color: var(--demo-text);
  padding: 0.25rem 0.6rem;
  background: var(--demo-surface-2);
  border: 1px solid var(--demo-border);
  border-radius: 999px;
}

@media (max-width: 640px) {
  .nco-booking-head {
    flex-wrap: wrap;
  }
  .nco-booking-via {
    text-align: left;
  }
}
```

- [ ] **Step 3: Verify the build**

Run: `npm run build`
Expected: PASS — no TypeScript errors, no unused imports.

---

### Task 3: ComposeStep — AI writes the welcome (step 2, the hero)

**Files:**
- Create: `src/demos/newCustomerOnboarding/steps/ComposeStep.tsx`
- Modify (append): `src/demos/newCustomerOnboarding/onboarding.css`

**Interfaces:**
- Consumes: `WorkflowProvider` from `../types`; `provider.getWelcome()`, `provider.getAiReasoning("compose")`; shared `AiPanel` (`{ title, lines, onComplete }`) and `usePrefersReducedMotion()`.
- Produces: `default` export `ComposeStep`, rendered by Task 8 for `case "compose"`.

- [ ] **Step 1: Create `steps/ComposeStep.tsx`**

```tsx
import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import type { WorkflowProvider } from "../types";
import { usePrefersReducedMotion } from "../../shared/usePrefersReducedMotion";
import AiPanel from "../../shared/AiPanel";

const ComposeStep = ({ provider }: { provider: WorkflowProvider }) => {
  const welcome = provider.getWelcome();
  const reasoning = provider.getAiReasoning("compose");
  const reduced = usePrefersReducedMotion();
  const [revealed, setRevealed] = useState(reduced);

  return (
    <div className="nco-step">
      <h3 className="nco-heading">It writes a real welcome — not a template</h3>
      <p className="nco-sub">
        Claude reads what the customer actually booked, then writes a warm,
        personal welcome and a tailored "what to expect" — the kind of message
        an owner wishes they had time to send every time.
      </p>

      <AiPanel
        title={reasoning.title}
        lines={reasoning.lines}
        onComplete={() => setRevealed(true)}
      />

      <div className={"nco-reveal" + (revealed ? " is-shown" : "")}>
        <div className="nco-welcome">
          <p className="nco-welcome-greeting">{welcome.greeting}</p>
          {welcome.body.map((p) => (
            <p key={p} className="nco-welcome-body">
              {p}
            </p>
          ))}
          <div className="nco-expect">
            <p className="nco-expect-label">What to expect</p>
            <ul className="nco-expect-list">
              {welcome.whatToExpect.map((e) => (
                <li key={e} className="nco-expect-item">
                  <FaCheck className="nco-expect-icon" aria-hidden="true" />
                  <span>{e}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComposeStep;
```

- [ ] **Step 2: Append the welcome-card styles to `onboarding.css`**

```css
/* Welcome letter card (step 2) — the hero artifact */
.nco-welcome {
  padding: var(--spacing-md);
  background: var(--demo-surface-2);
  border: 1px solid var(--demo-border);
  border-left: 3px solid var(--demo-accent-bright);
  border-radius: 0.6rem;
}
.nco-welcome-greeting {
  font-size: 1.05rem;
  font-weight: 700;
  margin: 0 0 var(--spacing-sm);
  color: var(--demo-text);
}
.nco-welcome-body {
  margin: 0 0 var(--spacing-sm);
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--demo-text);
}
.nco-expect {
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-sm);
  border-top: 1px solid var(--demo-border);
}
.nco-expect-label {
  margin: 0 0 var(--spacing-sm);
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--demo-accent-bright);
  font-weight: 700;
}
.nco-expect-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}
.nco-expect-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  font-size: 0.9rem;
  line-height: 1.4;
  color: var(--demo-text);
}
.nco-expect-icon {
  flex: 0 0 auto;
  margin-top: 0.15rem;
  color: var(--demo-success);
}
```

- [ ] **Step 3: Verify the build**

Run: `npm run build`
Expected: PASS — no TypeScript errors, no unused imports.

---

### Task 4: PacketStep — AI assembles the checklist (step 3)

**Files:**
- Create: `src/demos/newCustomerOnboarding/steps/PacketStep.tsx`
- Modify (append): `src/demos/newCustomerOnboarding/onboarding.css`

**Interfaces:**
- Consumes: `WorkflowProvider` and `PacketStatus` from `../types`; `provider.getPacket()`, `provider.getAiReasoning("packet")`; shared `AiPanel` and `usePrefersReducedMotion()`.
- Produces: `default` export `PacketStep`, rendered by Task 8 for `case "packet"`.

- [ ] **Step 1: Create `steps/PacketStep.tsx`**

```tsx
import { useState } from "react";
import { FaCheck, FaClock } from "react-icons/fa";
import type { WorkflowProvider, PacketStatus } from "../types";
import { usePrefersReducedMotion } from "../../shared/usePrefersReducedMotion";
import AiPanel from "../../shared/AiPanel";

const STATUS_LABEL: Record<PacketStatus, string> = {
  ready: "Ready",
  collected: "On file",
  requested: "Requested",
};

const PacketStep = ({ provider }: { provider: WorkflowProvider }) => {
  const packet = provider.getPacket();
  const reasoning = provider.getAiReasoning("packet");
  const reduced = usePrefersReducedMotion();
  const [revealed, setRevealed] = useState(reduced);

  return (
    <div className="nco-step">
      <h3 className="nco-heading">
        It assembles exactly what this customer needs
      </h3>
      <p className="nco-sub">
        Claude sorts what's already known from what only the customer can
        provide — then turns the gaps into one-tap requests. Nothing gets chased
        by hand.
      </p>

      <AiPanel
        title={reasoning.title}
        lines={reasoning.lines}
        onComplete={() => setRevealed(true)}
      />

      <div className={"nco-reveal" + (revealed ? " is-shown" : "")}>
        <div className="nco-packet">
          {packet.map((item) => (
            <div key={item.label} className="nco-packet-item">
              <div className="nco-packet-main">
                <span className="nco-packet-label">{item.label}</span>
                <span className="nco-packet-detail">{item.detail}</span>
              </div>
              <span className={"nco-pill nco-pill-" + item.status}>
                {item.status === "requested" ? (
                  <FaClock aria-hidden="true" />
                ) : (
                  <FaCheck aria-hidden="true" />
                )}
                {STATUS_LABEL[item.status]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PacketStep;
```

- [ ] **Step 2: Append the packet-checklist styles to `onboarding.css`**

```css
/* Packet checklist (step 3) — items with a status pill */
.nco-packet {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}
.nco-packet-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--demo-surface-2);
  border: 1px solid var(--demo-border);
  border-radius: 0.5rem;
}
.nco-packet-main {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
}
.nco-packet-label {
  font-weight: 700;
  color: var(--demo-text);
}
.nco-packet-detail {
  font-size: 0.8rem;
  color: var(--demo-muted);
}
.nco-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}
.nco-pill-ready,
.nco-pill-collected {
  color: var(--demo-success);
  background: rgba(16, 185, 129, 0.12);
}
.nco-pill-requested {
  color: #f4b740;
  background: rgba(244, 183, 64, 0.12);
}

@media (max-width: 640px) {
  .nco-packet-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.4rem;
  }
  .nco-pill {
    white-space: normal;
  }
}
```

- [ ] **Step 3: Verify the build**

Run: `npm run build`
Expected: PASS — no TypeScript errors, no unused imports.

---

### Task 5: DeliverStep — send lifecycle to "read" (step 4)

**Files:**
- Create: `src/demos/newCustomerOnboarding/steps/DeliverStep.tsx`
- Modify (append): `src/demos/newCustomerOnboarding/onboarding.css`

**Interfaces:**
- Consumes: `WorkflowProvider` from `../types`; `provider.getDelivery()`; shared `useSendLifecycle()` and `SendStatus` from `../../shared/SendLifecycleProvider`.
- Produces: `default` export `DeliverStep`, rendered by Task 8 for `case "deliver"`. Relies on `OnboardingDemo` wrapping the shell in `SendLifecycleProvider` (Task 8). Never calls `markReplied` — this flow ends at "read".

- [ ] **Step 1: Create `steps/DeliverStep.tsx`**

```tsx
import { useEffect, useRef } from "react";
import { FaPaperPlane, FaCheck, FaEnvelopeOpenText } from "react-icons/fa";
import type { WorkflowProvider } from "../types";
import {
  useSendLifecycle,
  type SendStatus,
} from "../../shared/SendLifecycleProvider";

const ORDER: SendStatus[] = ["sending", "delivered", "opened"];

function statusRank(s: SendStatus): number {
  if (s === "idle") return -1;
  if (s === "replied") return ORDER.length - 1;
  return ORDER.indexOf(s);
}

const DeliverStep = ({ provider }: { provider: WorkflowProvider }) => {
  const delivery = provider.getDelivery();
  const { status, start } = useSendLifecycle();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    start();
  }, [start]);

  const rank = statusRank(status);
  const lifecycle = [
    { id: "sending", label: "Sending", icon: <FaPaperPlane /> },
    { id: "delivered", label: "Delivered", icon: <FaCheck /> },
    { id: "opened", label: "Read", icon: <FaEnvelopeOpenText /> },
  ];

  return (
    <div className="nco-step">
      <h3 className="nco-heading">
        It reaches the customer — minutes after booking
      </h3>
      <p className="nco-sub">
        The welcome and packet link go out to {delivery.recipientName} as a text
        and an email. No waiting, no owner effort — just a warm start.
      </p>

      <div className="nco-deliver">
        <div className="nco-deliver-meta">
          <span className="nco-deliver-to">To {delivery.recipientName}</span>
          <span className="nco-deliver-channel">
            {delivery.channel} · {delivery.sentLabel}
          </span>
        </div>

        <ol className="nco-lifecycle">
          {lifecycle.map((stage, i) => (
            <li
              key={stage.id}
              className={
                "nco-life" +
                (rank >= i ? " is-active" : "") +
                (rank > i ? " is-done" : "")
              }
            >
              <span className="nco-life-icon">{stage.icon}</span>
              <span className="nco-life-label">{stage.label}</span>
            </li>
          ))}
        </ol>

        {status === "opened" && (
          <p className="nco-deliver-note">
            Opened and read. {delivery.recipientName} feels taken care of before
            anyone's even shown up.
          </p>
        )}
      </div>
    </div>
  );
};

export default DeliverStep;
```

- [ ] **Step 2: Append the deliver-lifecycle styles to `onboarding.css`**

```css
/* Deliver (step 4) — send lifecycle strip, ends at "read" */
.nco-deliver {
  padding: var(--spacing-md);
  background: var(--demo-surface-2);
  border: 1px solid var(--demo-border);
  border-radius: 0.6rem;
}
.nco-deliver-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-md);
}
.nco-deliver-to {
  font-weight: 700;
  color: var(--demo-text);
}
.nco-deliver-channel {
  font-size: 0.8rem;
  color: var(--demo-muted);
}
.nco-lifecycle {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: var(--spacing-sm);
}
.nco-life {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  padding: var(--spacing-sm);
  border: 1px solid var(--demo-border);
  border-radius: 0.5rem;
  color: var(--demo-muted);
  opacity: 0.5;
  transition: opacity 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}
.nco-life.is-active {
  opacity: 1;
  color: var(--demo-text);
  border-color: var(--demo-accent-bright);
}
.nco-life.is-done {
  color: var(--demo-success);
  border-color: var(--demo-success);
}
.nco-life-icon {
  font-size: 1.1rem;
}
.nco-life-label {
  font-size: 0.8rem;
}
.nco-deliver-note {
  margin: var(--spacing-md) 0 0;
  font-size: 0.85rem;
  color: var(--demo-success);
}
```

- [ ] **Step 3: Verify the build**

Run: `npm run build`
Expected: PASS — no TypeScript errors, no unused imports.

---

### Task 6: ScheduleStep — auto-book first visit, timed reveal (step 5)

**Files:**
- Create: `src/demos/newCustomerOnboarding/steps/ScheduleStep.tsx`
- Modify (append): `src/demos/newCustomerOnboarding/onboarding.css`

**Interfaces:**
- Consumes: `WorkflowProvider` from `../types`; `provider.getFirstVisit()`; shared `usePrefersReducedMotion()`.
- Produces: `default` export `ScheduleStep`, rendered by Task 8 for `case "schedule"`. Self-contained timed reveal — does NOT use the send lifecycle. Reduced-motion shows the booked state instantly. The `setTimeout` must be cleaned up on unmount.

- [ ] **Step 1: Create `steps/ScheduleStep.tsx`**

```tsx
import { useEffect, useState } from "react";
import { FaCalendarCheck, FaCheckCircle, FaUserCircle } from "react-icons/fa";
import type { WorkflowProvider } from "../types";
import { usePrefersReducedMotion } from "../../shared/usePrefersReducedMotion";

const BOOK_DELAY_MS = 1100;

const ScheduleStep = ({ provider }: { provider: WorkflowProvider }) => {
  const visit = provider.getFirstVisit();
  const reduced = usePrefersReducedMotion();
  const [booked, setBooked] = useState(reduced);

  useEffect(() => {
    if (reduced) {
      setBooked(true);
      return;
    }
    const t = window.setTimeout(() => setBooked(true), BOOK_DELAY_MS);
    return () => window.clearTimeout(t);
  }, [reduced]);

  return (
    <div className="nco-step">
      <h3 className="nco-heading">
        And it books the first visit — automatically
      </h3>
      <p className="nco-sub">
        The last step handles itself: the automation finds the first open slot
        on the right route and puts it on the calendar. The owner never touches
        it.
      </p>

      <div className="nco-schedule">
        <div className={"nco-slot" + (booked ? " is-booked" : "")}>
          <FaCalendarCheck className="nco-slot-icon" aria-hidden="true" />
          <div className="nco-slot-meta">
            <span className="nco-slot-when">{visit.slotLabel}</span>
            <span className="nco-slot-tech">
              <FaUserCircle aria-hidden="true" /> {visit.tech}
            </span>
          </div>
          <span className="nco-slot-status">{booked ? "Booked" : "Booking…"}</span>
        </div>

        <div className={"nco-confirm" + (booked ? " is-shown" : "")}>
          <FaCheckCircle className="nco-confirm-icon" aria-hidden="true" />
          <div>
            <p className="nco-confirm-title">{visit.confirmation}</p>
            <p className="nco-confirm-detail">{visit.detail}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleStep;
```

- [ ] **Step 2: Append the schedule styles to `onboarding.css`**

```css
/* Schedule (step 5) — first-visit slot + confirmation payoff (timed reveal) */
.nco-schedule {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}
.nco-slot {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: var(--demo-surface-2);
  border: 1px solid var(--demo-border);
  border-radius: 0.6rem;
  transition: border-color 0.3s ease;
}
.nco-slot.is-booked {
  border-color: var(--demo-success);
}
.nco-slot-icon {
  flex: 0 0 auto;
  font-size: 1.4rem;
  color: var(--demo-accent-bright);
}
.nco-slot.is-booked .nco-slot-icon {
  color: var(--demo-success);
}
.nco-slot-meta {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
  flex: 1 1 auto;
}
.nco-slot-when {
  font-weight: 700;
  color: var(--demo-text);
}
.nco-slot-tech {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8rem;
  color: var(--demo-muted);
}
.nco-slot-status {
  flex: 0 0 auto;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--demo-muted);
}
.nco-slot.is-booked .nco-slot-status {
  color: var(--demo-success);
}
.nco-confirm {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: var(--demo-surface-2);
  border: 1px solid var(--demo-success);
  border-radius: 0.6rem;
  opacity: 0;
  transform: translateY(6px);
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.nco-confirm.is-shown {
  opacity: 1;
  transform: none;
}
.nco-confirm-icon {
  flex: 0 0 auto;
  margin-top: 0.15rem;
  font-size: 1.3rem;
  color: var(--demo-success);
}
.nco-confirm-title {
  margin: 0 0 0.2rem;
  font-weight: 700;
  color: var(--demo-text);
}
.nco-confirm-detail {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.4;
  color: var(--demo-muted);
}
```

- [ ] **Step 3: Verify the build**

Run: `npm run build`
Expected: PASS — no TypeScript errors, no unused imports.

---

### Task 7: ResultsStep — recap tally (step 6)

**Files:**
- Create: `src/demos/newCustomerOnboarding/steps/ResultsStep.tsx`
- Modify (append): `src/demos/newCustomerOnboarding/onboarding.css`

**Interfaces:**
- Consumes: `WorkflowProvider` from `../types`; `provider.getResults()`.
- Produces: `default` export `ResultsStep`, rendered by Task 8 for `case "results"`. `customersOnboarded` is a number — coerce with `String()` before rendering.

- [ ] **Step 1: Create `steps/ResultsStep.tsx`**

```tsx
import type { WorkflowProvider } from "../types";

const ResultsStep = ({ provider }: { provider: WorkflowProvider }) => {
  const results = provider.getResults();
  const tally = [
    { num: String(results.customersOnboarded), label: "Customers onboarded" },
    {
      num: results.avgTimeToFirstVisit,
      label: "Avg time to first visit",
      hl: true,
    },
    { num: results.agreementsSigned, label: "Agreements signed" },
    { num: results.hoursSaved, label: "Owner time saved" },
  ];

  return (
    <div className="nco-step">
      <h3 className="nco-heading">
        Every new customer, welcomed the moment they book
      </h3>
      <p className="nco-sub">
        A personal welcome, the right paperwork, and a first visit on the
        calendar — all handled before the owner would've even opened their
        laptop.
      </p>

      <div className="nco-tally">
        {tally.map((t) => (
          <div
            key={t.label}
            className={"nco-tally-item" + (t.hl ? " nco-tally-item-hl" : "")}
          >
            <span className="nco-tally-num">{t.num}</span>
            <span className="nco-tally-label">{t.label}</span>
          </div>
        ))}
      </div>

      <p className="nco-takeaway">{results.takeaway}</p>
    </div>
  );
};

export default ResultsStep;
```

- [ ] **Step 2: Append the tally styles to `onboarding.css`**

```css
/* Results (step 6) — recap tally + takeaway */
.nco-tally {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}
.nco-tally-item {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: var(--spacing-md);
  background: var(--demo-surface-2);
  border: 1px solid var(--demo-border);
  border-radius: 0.5rem;
  text-align: center;
}
.nco-tally-item-hl {
  border-color: var(--demo-accent-bright);
}
.nco-tally-num {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--demo-text);
}
.nco-tally-item-hl .nco-tally-num {
  color: var(--demo-accent-bright);
}
.nco-tally-label {
  font-size: 0.75rem;
  color: var(--demo-muted);
}
.nco-takeaway {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--demo-text);
  max-width: 65ch;
}

@media (max-width: 640px) {
  .nco-tally {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
```

- [ ] **Step 3: Verify the build**

Run: `npm run build`
Expected: PASS — no TypeScript errors, no unused imports.

---

### Task 8: Compose the demo + wire the route and card

**Files:**
- Create: `src/demos/newCustomerOnboarding/steps.ts`
- Create: `src/demos/newCustomerOnboarding/OnboardingDemo.tsx`
- Modify: `src/App.tsx` (add import + one `<Route>`)
- Modify: `src/components/AutomatedWorkflows.tsx` (add `to` on the existing card)

**Interfaces:**
- Consumes: all six step components (Tasks 2–7); `scriptedWorkflowProvider` (Task 1); shared `DemoProvider`, `SendLifecycleProvider`, `DemoShell`, and `DemoStep`.
- Produces: `default` export `OnboardingDemo`; the `/demos/onboarding` route; the linked example card. This is the integration task — after it, the demo is reachable and complete.

- [ ] **Step 1: Create `steps.ts`**

```ts
import {
  FaUserPlus,
  FaPenFancy,
  FaClipboardCheck,
  FaPaperPlane,
  FaCalendarCheck,
  FaChartLine,
} from "react-icons/fa";
import type { DemoStep } from "../shared/types";

export const steps: DemoStep[] = [
  { id: "signup", label: "New customer booked", Icon: FaUserPlus },
  { id: "compose", label: "Write the welcome", Icon: FaPenFancy, isAi: true },
  {
    id: "packet",
    label: "Assemble the packet",
    Icon: FaClipboardCheck,
    isAi: true,
  },
  { id: "deliver", label: "Send to the customer", Icon: FaPaperPlane },
  { id: "schedule", label: "Book the first visit", Icon: FaCalendarCheck },
  { id: "results", label: "Results", Icon: FaChartLine },
];
```

- [ ] **Step 2: Create `OnboardingDemo.tsx`**

```tsx
import type { ReactNode } from "react";
import { DemoProvider } from "../shared/DemoController";
import { SendLifecycleProvider } from "../shared/SendLifecycleProvider";
import DemoShell from "../shared/DemoShell";
import { steps } from "./steps";
import { scriptedWorkflowProvider } from "./provider";
import SignupStep from "./steps/SignupStep";
import ComposeStep from "./steps/ComposeStep";
import PacketStep from "./steps/PacketStep";
import DeliverStep from "./steps/DeliverStep";
import ScheduleStep from "./steps/ScheduleStep";
import ResultsStep from "./steps/ResultsStep";
import "./onboarding.css";

const provider = scriptedWorkflowProvider;

function renderStage(stepId: string): ReactNode {
  switch (stepId) {
    case "signup":
      return <SignupStep provider={provider} />;
    case "compose":
      return <ComposeStep provider={provider} />;
    case "packet":
      return <PacketStep provider={provider} />;
    case "deliver":
      return <DeliverStep provider={provider} />;
    case "schedule":
      return <ScheduleStep provider={provider} />;
    case "results":
      return <ResultsStep provider={provider} />;
    default:
      return null;
  }
}

const OnboardingDemo = () => {
  const business = provider.getBusiness();
  return (
    <DemoProvider steps={steps}>
      <SendLifecycleProvider>
        <DemoShell
          eyebrow="Paradigm Shift — Automation Demo"
          title={`New-customer onboarding for ${business.name}`}
          lede="A click-through of how a bare booking becomes a welcomed customer — a personal welcome written, the right paperwork assembled, and the first visit booked, all on its own."
          renderStage={renderStage}
        />
      </SendLifecycleProvider>
    </DemoProvider>
  );
};

export default OnboardingDemo;
```

- [ ] **Step 3: Add the import to `src/App.tsx`**

Add after the existing `WeeklyReportsDemo` import (currently line 12):

```tsx
import OnboardingDemo from "./demos/newCustomerOnboarding/OnboardingDemo";
```

- [ ] **Step 4: Add the route to `src/App.tsx`**

Add immediately after the existing `/demos/weekly-reports` `<Route>` element, and — like the other demo routes — **outside** the `Layout` route:

```tsx
<Route path="/demos/onboarding" element={<OnboardingDemo />} />
```

Verify placement: it must be a sibling of the other `/demos/*` routes (not nested inside the `Layout` route element).

- [ ] **Step 5: Wire the example card in `src/components/AutomatedWorkflows.tsx`**

Find the existing "New-Customer Onboarding" entry (`icon: FaUserPlus`, `description: "Welcome, docs, and scheduling handled"`) and add a `to` field so the card becomes a `<Link>`:

```tsx
  {
    icon: FaUserPlus,
    title: "New-Customer Onboarding",
    description: "Welcome, docs, and scheduling handled",
    to: "/demos/onboarding",
  },
```

Do not change any other card, copy, or ordering.

- [ ] **Step 6: Verify the build**

Run: `npm run build`
Expected: PASS — no TypeScript errors, no unused imports.

- [ ] **Step 7: Run the linter (final gate)**

Run: `npm run lint`
Expected: PASS — zero warnings.

- [ ] **Step 8: Manual smoke (dev server)**

Run: `npm run dev`, then open `http://localhost:5173/demos/onboarding` (note the actual port Vite prints).
Verify:
- All 6 steps advance via the flow rail and Next/Back.
- `signup` shows the booking card (name, address, service, intake facts).
- `compose` plays the AI panel, then reveals the welcome letter card (greeting, body, "what to expect" checks).
- `packet` plays the AI panel, then reveals the checklist with status pills (2 amber "Requested", 3 green).
- `deliver` animates the send lifecycle to "Read".
- `schedule` shows "Booking…" then reveals the confirmation card after a beat.
- `results` renders the 4-item tally + takeaway.
- No horizontal scroll at mobile widths (≤640px).
- The example card on `/services/automated-workflows` links here.

(If the Chrome automation extension is unavailable, record this smoke as owed and note it — do not block on it.)

---

## Self-Review

**1. Spec coverage:**
- 6-step flow (`signup`/`compose`/`packet`/`deliver`/`schedule`/`results`) → Tasks 2–7 + Task 8 `steps.ts`. ✅
- Two `isAi` steps `compose`+`packet` rendering `AiPanel` → Tasks 3, 4; `AiStep` type → Task 1. ✅
- `deliver` reuses send lifecycle, ends at "read" (no `markReplied`) → Task 5. ✅
- `schedule` self-contained timed reveal, no send lifecycle → Task 6. ✅
- `WorkflowProvider` interface + all supporting types → Task 1 `types.ts`. ✅
- All mock data (business, signup, welcome, packet, delivery, firstVisit, results, aiReasoning) → Task 1 `script.ts`. ✅
- Bespoke UI (booking card, welcome card, packet checklist w/ pills, deliver strip, schedule confirm, tally) → CSS appended in Tasks 2–7. ✅
- Status pills: `ready`/`collected` green, `requested` amber `#f4b740` → Task 4 CSS. ✅
- Route `/demos/onboarding` outside `Layout`; card `to` → Task 8. ✅
- Responsive media queries (768/640) + no mobile horizontal scroll → CSS in Tasks 2, 4, 7 + smoke in Task 8. ✅
- Verification: `npm run build` per task, `npm run lint` final → every task + Task 8 Step 7. ✅

**2. Placeholder scan:** No TBD/TODO/"handle edge cases"/"similar to Task N". Every code step contains full code. ✅

**3. Type consistency:** Method names (`getBusiness`/`getSignup`/`getWelcome`/`getPacket`/`getDelivery`/`getFirstVisit`/`getResults`/`getAiReasoning`) and property names are identical across `types.ts` (Task 1), `provider.ts` (Task 1), and every consumer (Tasks 2–8). `AiStep` values `"compose"`/`"packet"` match `getAiReasoning` calls and `steps.ts` `isAi` flags. `PacketStatus` values `"ready"`/`"collected"`/`"requested"` match the `STATUS_LABEL` record, the CSS class suffixes (`.nco-pill-ready/-collected/-requested`), and the `script.ts` data. `SendStatus` usage mirrors the shared provider. ✅

## Notes on read-only git

This plan performs **no** git writes. After all tasks pass build + lint, surface these commit commands for the user to run:

```bash
git add src/demos/newCustomerOnboarding src/App.tsx src/components/AutomatedWorkflows.tsx \
  docs/superpowers/plans/2026-07-13-new-customer-onboarding-demo.md \
  docs/superpowers/specs/2026-07-13-new-customer-onboarding-demo-design.md
git commit -m "feat: add new-customer onboarding interactive demo"
```

(The two wiring files may also carry edits from earlier uncommitted demos in the working tree; staging them commits those too — the user decides how to slice.)

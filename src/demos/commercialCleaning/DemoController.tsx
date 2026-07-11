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
  goTo: (index: number) => void;
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
    clearTimers();
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  }, [clearTimers]);

  const back = useCallback(() => {
    clearTimers();
    setStepIndex((i) => Math.max(i - 1, 0));
  }, [clearTimers]);

  const goTo = useCallback(
    (index: number) => {
      clearTimers();
      setStepIndex(Math.min(Math.max(index, 0), STEPS.length - 1));
    },
    [clearTimers],
  );

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
      goTo,
      reset,
      startSend,
      markReplied,
      canBack: stepIndex > 0,
      canNext: stepIndex < STEPS.length - 1,
    }),
    [stepIndex, sendStatus, next, back, goTo, reset, startSend, markReplied],
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDemo(): DemoContextValue {
  const ctx = useContext(DemoContext);
  if (!ctx) {
    throw new Error("useDemo must be used within a DemoProvider");
  }
  return ctx;
}

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { DemoStep } from "./types";

interface DemoContextValue {
  steps: DemoStep[];
  stepIndex: number;
  stepId: string;
  next: () => void;
  back: () => void;
  goTo: (index: number) => void;
  reset: () => void;
  /** Increments on every reset() — lets sibling providers reset in response. */
  resetNonce: number;
  canBack: boolean;
  canNext: boolean;
}

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({
  steps,
  children,
}: {
  steps: DemoStep[];
  children: ReactNode;
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const [resetNonce, setResetNonce] = useState(0);
  const last = steps.length - 1;

  const next = useCallback(
    () => setStepIndex((i) => Math.min(i + 1, last)),
    [last],
  );
  const back = useCallback(() => setStepIndex((i) => Math.max(i - 1, 0)), []);
  const goTo = useCallback(
    (index: number) => setStepIndex(Math.min(Math.max(index, 0), last)),
    [last],
  );
  const reset = useCallback(() => {
    setStepIndex(0);
    setResetNonce((n) => n + 1);
  }, []);

  const value = useMemo<DemoContextValue>(
    () => ({
      steps,
      stepIndex,
      stepId: steps[stepIndex].id,
      next,
      back,
      goTo,
      reset,
      resetNonce,
      canBack: stepIndex > 0,
      canNext: stepIndex < last,
    }),
    [steps, stepIndex, next, back, goTo, reset, resetNonce, last],
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

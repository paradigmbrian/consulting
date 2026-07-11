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
import { useDemo } from "./DemoController";

export type SendStatus =
  | "idle"
  | "sending"
  | "delivered"
  | "opened"
  | "replied";

/** Timings for the mocked send lifecycle (ms). */
const SENDING_MS = 1100;
const DELIVERED_MS = 1100;

interface SendLifecycleValue {
  status: SendStatus;
  start: () => void;
  markReplied: () => void;
}

const Ctx = createContext<SendLifecycleValue | null>(null);

export function SendLifecycleProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<SendStatus>("idle");
  const reduced = usePrefersReducedMotion();
  const timers = useRef<number[]>([]);
  const { resetNonce } = useDemo();

  const clear = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }, []);

  useEffect(() => clear, [clear]);

  // Reset only on an explicit demo restart (not on back-navigation).
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    clear();
    setStatus("idle");
  }, [resetNonce, clear]);

  const start = useCallback(() => {
    clear();
    if (reduced) {
      setStatus("opened");
      return;
    }
    setStatus("sending");
    timers.current.push(
      window.setTimeout(() => setStatus("delivered"), SENDING_MS),
    );
    timers.current.push(
      window.setTimeout(
        () => setStatus("opened"),
        SENDING_MS + DELIVERED_MS,
      ),
    );
  }, [clear, reduced]);

  const markReplied = useCallback(() => setStatus("replied"), []);

  const value = useMemo<SendLifecycleValue>(
    () => ({ status, start, markReplied }),
    [status, start, markReplied],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSendLifecycle(): SendLifecycleValue {
  const ctx = useContext(Ctx);
  if (!ctx) {
    throw new Error(
      "useSendLifecycle must be used within a SendLifecycleProvider",
    );
  }
  return ctx;
}

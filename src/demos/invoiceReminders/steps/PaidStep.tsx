import { useEffect, useRef, useState } from "react";
import { FaMoneyBillWave, FaUserShield } from "react-icons/fa";
import type { WorkflowProvider } from "../types";
import { useSendLifecycle } from "../../shared/SendLifecycleProvider";
import { usePrefersReducedMotion } from "../../shared/usePrefersReducedMotion";
import InvoiceCard from "./InvoiceCard";

const PAID_DELAY_MS = 700;

const PaidStep = ({ provider }: { provider: WorkflowProvider }) => {
  const invoice = provider.getInvoice();
  const payment = provider.getPayment();
  const ownerFlag = provider.getOwnerFlag();
  const { markReplied } = useSendLifecycle();
  const reduced = usePrefersReducedMotion();
  const [shown, setShown] = useState(reduced);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (reduced) {
      setShown(true);
      markReplied();
      return;
    }
    timer.current = window.setTimeout(() => {
      setShown(true);
      markReplied();
    }, PAID_DELAY_MS);
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, [reduced, markReplied]);

  return (
    <div className="inv-step">
      <h3 className="inv-heading">Paid — without a single awkward call</h3>
      <p className="inv-sub">
        {payment.customerName} tapped the link and paid right after the firm
        reminder. The invoice closes itself out.
      </p>

      <InvoiceCard invoice={invoice} paid />

      <div className={"inv-paid-reveal" + (shown ? " is-shown" : "")}>
        <div className="inv-payment">
          <FaMoneyBillWave className="inv-payment-icon" />
          <div>
            <p className="inv-payment-title">
              {payment.amount} paid · {payment.method}
            </p>
            <p className="inv-payment-meta">
              {payment.paidLabel} · {payment.daysToPay} to pay
            </p>
          </div>
        </div>

        <div className="inv-safety">
          <FaUserShield className="inv-safety-icon" />
          <div>
            <p className="inv-safety-title">{ownerFlag.summary}</p>
            <p className="inv-safety-note">{ownerFlag.note}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaidStep;

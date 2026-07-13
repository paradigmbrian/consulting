import type { WorkflowProvider } from "../types";
import InvoiceCard from "./InvoiceCard";

const OverdueStep = ({ provider }: { provider: WorkflowProvider }) => {
  const business = provider.getBusiness();
  const invoice = provider.getInvoice();

  return (
    <div className="inv-step">
      <h3 className="inv-heading">An invoice quietly slips past due</h3>
      <p className="inv-sub">
        {business.name} does the work and sends the invoice — but follow-up
        slips, and this is exactly where money leaks. Here's one starting to age.
      </p>

      <InvoiceCard invoice={invoice} />

      <p className="inv-note">
        {invoice.customerName} is a good customer who's just late — he needs a
        nudge, not a lecture.
      </p>
    </div>
  );
};

export default OverdueStep;

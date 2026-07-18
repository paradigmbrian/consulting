import { FaFileInvoiceDollar, FaUserClock, FaMoneyBillWave } from "react-icons/fa";
import "../demos/invoiceReminders/invoices.css";

/**
 * Static "product-shot" snippets for the invoice-reminders detail page.
 * Reuses the demo's real `.inv-*` classes (styled by invoices.css, colored by
 * the enclosing .demo-scope) with fixed sample content — no provider, no
 * interactivity. One snippet per key.
 */

const Invoice = () => (
  <div className="inv-invoice">
    <div className="inv-invoice-head">
      <FaFileInvoiceDollar className="inv-invoice-icon" />
      <div className="inv-invoice-headmeta">
        <p className="inv-invoice-customer">Marcus Bell · #1042</p>
        <p className="inv-invoice-job">Panel upgrade + kitchen circuits</p>
      </div>
      <span className="inv-invoice-stamp inv-invoice-stamp-overdue">
        6 days overdue
      </span>
    </div>
    <div className="inv-invoice-rows">
      <div className="inv-invoice-field">
        <span className="inv-invoice-label">Amount</span>
        <span className="inv-invoice-value inv-invoice-amount">$2,450</span>
      </div>
      <div className="inv-invoice-field">
        <span className="inv-invoice-label">Issued</span>
        <span className="inv-invoice-value">Jun 26</span>
      </div>
      <div className="inv-invoice-field">
        <span className="inv-invoice-label">Due</span>
        <span className="inv-invoice-value">Jul 3 · net 7</span>
      </div>
    </div>
  </div>
);

const Ladder = () => (
  <div className="inv-ladder">
    <div className="inv-rung">
      <span className="inv-rung-index">1</span>
      <div className="inv-rung-body">
        <div className="inv-rung-top">
          <span className="inv-rung-label">Friendly heads-up</span>
          <span className="inv-rung-timing">Day before due</span>
        </div>
        <p className="inv-rung-meta">Warm, informational · Text + email</p>
      </div>
    </div>
    <div className="inv-rung">
      <span className="inv-rung-index">2</span>
      <div className="inv-rung-body">
        <div className="inv-rung-top">
          <span className="inv-rung-label">Gentle nudge</span>
          <span className="inv-rung-timing">+3 days overdue</span>
        </div>
        <p className="inv-rung-meta">Friendly, no pressure · Text</p>
      </div>
    </div>
    <div className="inv-rung">
      <span className="inv-rung-index">3</span>
      <div className="inv-rung-body">
        <div className="inv-rung-top">
          <span className="inv-rung-label">Firm reminder</span>
          <span className="inv-rung-timing">+10 days overdue</span>
        </div>
        <p className="inv-rung-meta">Clear &amp; professional · Email + text</p>
      </div>
    </div>
    <div className="inv-rung inv-rung-owner">
      <span className="inv-rung-index">
        <FaUserClock />
      </span>
      <div className="inv-rung-body">
        <div className="inv-rung-top">
          <span className="inv-rung-label">Flag for the owner</span>
          <span className="inv-rung-timing">+14 days, still unpaid</span>
        </div>
        <p className="inv-rung-meta">Hand off to a human · Owner alert</p>
      </div>
    </div>
  </div>
);

const Messages = () => (
  <div className="inv-messages">
    <div className="inv-message">
      <div className="inv-message-head">
        <span className="inv-message-rung">Friendly heads-up</span>
        <span className="inv-message-tone">Warm, informational</span>
      </div>
      <p className="inv-message-body">
        Hi Marcus — quick heads-up that your invoice for the panel upgrade
        ($2,450) is due tomorrow. Pay in a tap here: [link]. Thanks again!
      </p>
    </div>
    <div className="inv-message">
      <div className="inv-message-head">
        <span className="inv-message-rung">Gentle nudge</span>
        <span className="inv-message-tone">Friendly, no pressure</span>
      </div>
      <p className="inv-message-body">
        Hi Marcus, just circling back — the $2,450 invoice for your panel
        upgrade is a few days past due. No worries if it slipped your mind;
        you can pay anytime here: [link].
      </p>
    </div>
    <div className="inv-message">
      <div className="inv-message-head">
        <span className="inv-message-rung">Firm reminder</span>
        <span className="inv-message-tone">Clear &amp; professional</span>
      </div>
      <p className="inv-message-body">
        Hi Marcus, following up on invoice #1042 for $2,450, now 10 days past
        due. Please settle it at your earliest convenience: [link].
      </p>
    </div>
  </div>
);

const Results = () => (
  <div className="inv-paid-reveal is-shown">
    <div className="inv-payment">
      <FaMoneyBillWave className="inv-payment-icon" />
      <div>
        <p className="inv-payment-title">$2,450 paid · Card — one-tap link</p>
        <p className="inv-payment-meta">
          Paid ~2 hrs after the firm reminder · 11 days to pay
        </p>
      </div>
    </div>
    <div className="inv-lift">
      <span className="inv-lift-before">31 days</span>
      <span className="inv-lift-arrow">→</span>
      <span className="inv-lift-after">12 days</span>
      <span className="inv-lift-caption">Avg days to get paid</span>
    </div>
  </div>
);

const snippets: Record<string, JSX.Element> = {
  invoice: <Invoice />,
  ladder: <Ladder />,
  messages: <Messages />,
  results: <Results />,
};

const InvoiceRemindersShowcase = ({ snippet }: { snippet: string }) =>
  snippets[snippet] ?? null;

export default InvoiceRemindersShowcase;

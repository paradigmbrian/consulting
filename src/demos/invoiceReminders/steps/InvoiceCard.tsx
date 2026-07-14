import { FaFileInvoiceDollar } from "react-icons/fa";
import type { Invoice } from "../types";

const InvoiceCard = ({
  invoice,
  paid = false,
}: {
  invoice: Invoice;
  paid?: boolean;
}) => (
  <div className={"inv-invoice" + (paid ? " inv-invoice-paid" : "")}>
    <div className="inv-invoice-head">
      <FaFileInvoiceDollar className="inv-invoice-icon" />
      <div className="inv-invoice-headmeta">
        <p className="inv-invoice-customer">
          {invoice.customerName} · {invoice.invoiceNo}
        </p>
        <p className="inv-invoice-job">{invoice.jobDescription}</p>
      </div>
      <span
        className={
          "inv-invoice-stamp" +
          (paid ? " inv-invoice-stamp-paid" : " inv-invoice-stamp-overdue")
        }
      >
        {paid ? "Paid" : `${invoice.daysOverdue} days overdue`}
      </span>
    </div>
    <div className="inv-invoice-rows">
      <div className="inv-invoice-field">
        <span className="inv-invoice-label">Amount</span>
        <span className="inv-invoice-value inv-invoice-amount">
          {invoice.amount}
        </span>
      </div>
      <div className="inv-invoice-field">
        <span className="inv-invoice-label">Issued</span>
        <span className="inv-invoice-value">{invoice.issuedLabel}</span>
      </div>
      <div className="inv-invoice-field">
        <span className="inv-invoice-label">Due</span>
        <span className="inv-invoice-value">{invoice.dueLabel}</span>
      </div>
    </div>
  </div>
);

export default InvoiceCard;

import { FaFileInvoiceDollar } from "react-icons/fa";
import type { Quote } from "../types";

const QuoteCard = ({ quote }: { quote: Quote }) => (
  <div className="qt-quote">
    <div className="qt-quote-head">
      <FaFileInvoiceDollar className="qt-quote-icon" />
      <span className="qt-quote-title">Itemized estimate</span>
    </div>
    <ul className="qt-quote-lines">
      {quote.lineItems.map((item) => (
        <li key={item.label} className="qt-quote-line">
          <div className="qt-quote-line-main">
            <span className="qt-quote-line-label">{item.label}</span>
            <span className="qt-quote-line-detail">{item.detail}</span>
          </div>
          <span className="qt-quote-line-amount">{item.amount}</span>
        </li>
      ))}
    </ul>
    <div className="qt-quote-total">
      <span className="qt-quote-total-label">Total estimate</span>
      <span className="qt-quote-total-amount">{quote.total}</span>
    </div>
    <p className="qt-quote-validity">{quote.validityNote}</p>
  </div>
);

export default QuoteCard;

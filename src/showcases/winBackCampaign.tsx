import {
  FaUserSlash,
  FaTag,
  FaCommentDots,
  FaReply,
  FaCalendarCheck,
} from "react-icons/fa";
import "../demos/winBackCampaign/winback.css";

/**
 * Static "product-shot" snippets for the win-back-campaigns detail page.
 * Reuses the demo's real `.wb-*` classes (styled by winback.css, colored by
 * the enclosing .demo-scope) with fixed sample content — no provider, no
 * interactivity. One snippet per key.
 */

const Segments = () => (
  <div>
    <div className="wb-segments">
      <div className="wb-segment">
        <p className="wb-segment-count">612</p>
        <p className="wb-segment-label">Overdue for service (9–18 mo)</p>
        <p className="wb-segment-crit">Due for a visit, reachable, no active plan</p>
      </div>
      <div className="wb-segment">
        <p className="wb-segment-count">138</p>
        <p className="wb-segment-label">Lapsed after a big job</p>
        <p className="wb-segment-crit">Had major work done, no follow-up booked</p>
      </div>
    </div>
    <div className="wb-dropped">
      <FaUserSlash className="wb-dropped-icon" />
      <div>
        <p className="wb-dropped-count">670 set aside</p>
        <ul className="wb-dropped-reasons">
          <li>No valid phone or email on file</li>
          <li>Serviced within the last 6 months</li>
          <li>Previously opted out of outreach</li>
        </ul>
      </div>
    </div>
  </div>
);

const Offer = () => (
  <div>
    <div className="wb-offer">
      <FaTag className="wb-offer-icon" />
      <div>
        <p className="wb-offer-headline">$59 return tune-up</p>
        <p className="wb-offer-detail">
          Reduced-rate pricing for lapsed customers, valid for 3 weeks, with a
          direct booking link.
        </p>
        <p className="wb-offer-channel">Channel: SMS, with email fallback</p>
      </div>
    </div>
    <div className="wb-message">
      <div className="wb-message-head">
        <FaCommentDots />
        <span>Drafted SMS — featured customer</span>
      </div>
      <p className="wb-message-body">
        Hi Marcus, it's been a while since your last visit with us! Book a $59
        tune-up this month: pdgm.co/book. Reply STOP to opt out.
      </p>
    </div>
  </div>
);

const ReplyBooking = () => (
  <div>
    <div className="wb-reply-card is-shown">
      <div className="wb-reply-head">
        <FaReply className="wb-reply-icon" />
        <div>
          <p className="wb-reply-from">Marcus Bell</p>
          <p className="wb-reply-channel">SMS</p>
        </div>
      </div>
      <p className="wb-reply-body">
        Oh nice, I've been meaning to call. Do you have anything Thursday
        afternoon?
      </p>
    </div>
    <div className="wb-booking is-shown">
      <FaCalendarCheck className="wb-booking-icon" />
      <div>
        <p className="wb-booking-title">Booked — Return tune-up</p>
        <p className="wb-booking-meta">Thu 2:30 PM · $220 job</p>
      </div>
    </div>
  </div>
);

const Results = () => (
  <div>
    <div className="wb-tally">
      <div className="wb-tally-item">
        <span className="wb-tally-num">750</span>
        <span className="wb-tally-label">Contacted</span>
      </div>
      <div className="wb-tally-item">
        <span className="wb-tally-num">731</span>
        <span className="wb-tally-label">Delivered</span>
      </div>
      <div className="wb-tally-item">
        <span className="wb-tally-num">96</span>
        <span className="wb-tally-label">Replied</span>
      </div>
      <div className="wb-tally-item wb-tally-item-hl">
        <span className="wb-tally-num">41</span>
        <span className="wb-tally-label">Booked</span>
      </div>
    </div>
    <p className="wb-revenue">$9,020 booked</p>
    <p className="wb-takeaway">
      41 lapsed customers rebooked from one campaign — off a list you already
      owned, with no ad spend.
    </p>
  </div>
);

const snippets: Record<string, JSX.Element> = {
  segments: <Segments />,
  offer: <Offer />,
  reply: <ReplyBooking />,
  results: <Results />,
};

const WinBackCampaignShowcase = ({ snippet }: { snippet: string }) =>
  snippets[snippet] ?? null;

export default WinBackCampaignShowcase;

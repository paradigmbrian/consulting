import {
  FaUserPlus,
  FaCheck,
  FaClock,
  FaCalendarCheck,
  FaUserCircle,
  FaCheckCircle,
} from "react-icons/fa";
import "../demos/newCustomerOnboarding/onboarding.css";

/**
 * Static "product-shot" snippets for the new-customer-onboarding detail page.
 * Reuses the demo's real `.nco-*` classes (styled by onboarding.css, colored
 * by the enclosing .demo-scope) with fixed sample content — no provider, no
 * interactivity. One snippet per key.
 */

const Booking = () => (
  <div className="nco-booking">
    <div className="nco-booking-head">
      <FaUserPlus className="nco-booking-icon" aria-hidden="true" />
      <div className="nco-booking-headmeta">
        <p className="nco-booking-name">Marcus Bell</p>
        <p className="nco-booking-address">14 Aldercreek Dr</p>
      </div>
      <span className="nco-booking-via">Website booking form · Sat 4:12 PM</span>
    </div>

    <div className="nco-booking-service">
      <span className="nco-booking-label">Booked</span>
      <span className="nco-booking-value">Weekly pool service — in-ground</span>
    </div>

    <ul className="nco-facts">
      <li className="nco-fact">In-ground pool, ~18,000 gal</li>
      <li className="nco-fact">Saltwater system</li>
      <li className="nco-fact">Prefers morning visits</li>
      <li className="nco-fact">Card entered at booking</li>
    </ul>
  </div>
);

const Welcome = () => (
  <div className="nco-welcome">
    <p className="nco-welcome-greeting">Welcome to Clearwater, Marcus!</p>
    <p className="nco-welcome-body">
      Thanks for choosing Clearwater Pool Care — your weekly service is all
      set, and we'll keep your water clear and balanced so you never have to
      think about it.
    </p>
    <p className="nco-welcome-body">
      Your regular technician will be Diego, who runs the Aldercreek route.
      He'll test and balance your water, clean the pool, and check your
      saltwater system on every visit.
    </p>
    <div className="nco-expect">
      <p className="nco-expect-label">What to expect</p>
      <ul className="nco-expect-list">
        <li className="nco-expect-item">
          <FaCheck className="nco-expect-icon" aria-hidden="true" />
          <span>A dependable weekly visit — same day each week, no need to be home.</span>
        </li>
        <li className="nco-expect-item">
          <FaCheck className="nco-expect-icon" aria-hidden="true" />
          <span>A photo and quick service summary texted to you after every clean.</span>
        </li>
        <li className="nco-expect-item">
          <FaCheck className="nco-expect-icon" aria-hidden="true" />
          <span>Balanced water and a healthy salt system, checked every single time.</span>
        </li>
      </ul>
    </div>
  </div>
);

const Packet = () => (
  <div className="nco-packet">
    <div className="nco-packet-item">
      <div className="nco-packet-main">
        <span className="nco-packet-label">Service agreement</span>
        <span className="nco-packet-detail">Weekly terms &amp; auto-pay — one tap to sign</span>
      </div>
      <span className="nco-pill nco-pill-requested">
        <FaClock aria-hidden="true" /> Requested
      </span>
    </div>
    <div className="nco-packet-item">
      <div className="nco-packet-main">
        <span className="nco-packet-label">Gate / pool access</span>
        <span className="nco-packet-detail">Gate code or access notes so Diego can reach the pool</span>
      </div>
      <span className="nco-pill nco-pill-requested">
        <FaClock aria-hidden="true" /> Requested
      </span>
    </div>
    <div className="nco-packet-item">
      <div className="nco-packet-main">
        <span className="nco-packet-label">Equipment profile</span>
        <span className="nco-packet-detail">In-ground · ~18,000 gal · saltwater — pulled from your booking</span>
      </div>
      <span className="nco-pill nco-pill-ready">
        <FaCheck aria-hidden="true" /> Ready
      </span>
    </div>
    <div className="nco-packet-item">
      <div className="nco-packet-main">
        <span className="nco-packet-label">Billing on file</span>
        <span className="nco-packet-detail">Card saved at booking — weekly auto-pay ready</span>
      </div>
      <span className="nco-pill nco-pill-collected">
        <FaCheck aria-hidden="true" /> On file
      </span>
    </div>
  </div>
);

const Schedule = () => (
  <div className="nco-schedule">
    <div className="nco-slot is-booked">
      <FaCalendarCheck className="nco-slot-icon" aria-hidden="true" />
      <div className="nco-slot-meta">
        <span className="nco-slot-when">Thursday, Jul 17 · 8:00–9:30 AM</span>
        <span className="nco-slot-tech">
          <FaUserCircle aria-hidden="true" /> Diego R.
        </span>
      </div>
      <span className="nco-slot-status">Booked</span>
    </div>

    <div className="nco-confirm is-shown">
      <FaCheckCircle className="nco-confirm-icon" aria-hidden="true" />
      <div>
        <p className="nco-confirm-title">First visit booked — Thursday 8:00 AM.</p>
        <p className="nco-confirm-detail">
          Added to Diego's Aldercreek route. Marcus gets a reminder the day
          before, and you never touched the calendar.
        </p>
      </div>
    </div>
  </div>
);

const snippets: Record<string, JSX.Element> = {
  booking: <Booking />,
  welcome: <Welcome />,
  packet: <Packet />,
  schedule: <Schedule />,
};

const NewCustomerOnboardingShowcase = ({ snippet }: { snippet: string }) =>
  snippets[snippet] ?? null;

export default NewCustomerOnboardingShowcase;

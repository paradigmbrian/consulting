import { FaUserPlus } from "react-icons/fa";
import type { WorkflowProvider } from "../types";

const SignupStep = ({ provider }: { provider: WorkflowProvider }) => {
  const business = provider.getBusiness();
  const signup = provider.getSignup();

  return (
    <div className="nco-step">
      <h3 className="nco-heading">
        A new customer just booked — the clock starts now
      </h3>
      <p className="nco-sub">
        {signup.customerName} signed up for {business.name} through the website.
        It's a bare form submission — a name, an address, and a few facts.
        Turning that into a welcomed, ready-to-serve customer used to cost the
        owner 20 minutes.
      </p>

      <div className="nco-booking">
        <div className="nco-booking-head">
          <FaUserPlus className="nco-booking-icon" aria-hidden="true" />
          <div className="nco-booking-headmeta">
            <p className="nco-booking-name">{signup.customerName}</p>
            <p className="nco-booking-address">{signup.address}</p>
          </div>
          <span className="nco-booking-via">{signup.bookedVia}</span>
        </div>

        <div className="nco-booking-service">
          <span className="nco-booking-label">Booked</span>
          <span className="nco-booking-value">{signup.serviceBooked}</span>
        </div>

        <ul className="nco-facts">
          {signup.intakeFacts.map((f) => (
            <li key={f} className="nco-fact">
              {f}
            </li>
          ))}
        </ul>
      </div>

      <p className="nco-note">
        Raw and impersonal — exactly where onboarding usually stalls.
      </p>
    </div>
  );
};

export default SignupStep;

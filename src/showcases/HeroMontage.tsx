import ShowcaseFrame from "./ShowcaseFrame";
import AutomatedQuoting from "./automatedQuoting";
import MissedCall from "./missedCallTextBack";
import WeeklyReports from "./weeklyReports";
import JobDispatch from "./jobDispatch";
import "./heroMontage.css";

/**
 * A two-card product-shot montage for the automation landing heroes. Reuses
 * real demo cards (same authentic approach as the detail pages); both frames
 * carry the "Illustrative" tag via ShowcaseFrame. Two variants so the hero and
 * the proof section each feature different automations instead of repeating.
 */
interface HeroMontageProps {
  variant?: "hero" | "proof";
}

const HeroMontage = ({ variant = "hero" }: HeroMontageProps) => {
  const isProof = variant === "proof";
  return (
    <div className="hero-montage">
      <div className="hero-montage-back">
        <ShowcaseFrame>
          {isProof ? (
            <JobDispatch snippet="assign" />
          ) : (
            <MissedCall snippet="missedcall" />
          )}
        </ShowcaseFrame>
      </div>
      <div className="hero-montage-front">
        <ShowcaseFrame layered>
          {isProof ? (
            <WeeklyReports snippet="report" />
          ) : (
            <AutomatedQuoting snippet="quote" />
          )}
        </ShowcaseFrame>
      </div>
    </div>
  );
};

export default HeroMontage;

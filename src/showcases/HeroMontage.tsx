import ShowcaseFrame from "./ShowcaseFrame";
import ReviewGeneration from "./reviewGeneration";
import MissedCall from "./missedCallTextBack";
import "./heroMontage.css";

/**
 * A two-card product-shot montage for the automation landing/index heroes.
 * Reuses real demo cards (same authentic approach as the detail pages); both
 * frames carry the "Illustrative" tag via ShowcaseFrame.
 */
const HeroMontage = () => (
  <div className="hero-montage">
    <div className="hero-montage-back">
      <ShowcaseFrame>
        <MissedCall snippet="missedcall" />
      </ShowcaseFrame>
    </div>
    <div className="hero-montage-front">
      <ShowcaseFrame layered>
        <ReviewGeneration snippet="review" />
      </ShowcaseFrame>
    </div>
  </div>
);

export default HeroMontage;

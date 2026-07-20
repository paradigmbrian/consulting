import { FaPhone, FaCogs, FaRocket } from "react-icons/fa";
import type { IconType } from "react-icons";
import "./AwHowItWorks.css";

interface Step {
  icon: IconType;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    icon: FaPhone,
    title: "Discovery call (free)",
    description:
      "We map where your time and money are leaking to repetitive work, and find the highest-ROI place to start.",
  },
  {
    icon: FaCogs,
    title: "Build",
    description:
      "We design and build the automation around your existing tools. Fixed scope, agreed up front.",
  },
  {
    icon: FaRocket,
    title: "Handoff or hands-off",
    description:
      "You own and run it, or we maintain and improve it over time. Your call.",
  },
];

interface AwHowItWorksProps {
  title: string;
  as?: "section" | "bare";
}

const AwHowItWorks = ({ title, as = "section" }: AwHowItWorksProps) => {
  const content = (
    <div className="section-content">
      <h2 className="section-title">{title}</h2>
      <div className="aw-steps">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div key={step.title} className="aw-step">
              <div className="aw-step-number">
                <Icon className="aw-step-icon" />
              </div>
              <div className="aw-step-content">
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  if (as === "bare") {
    return content;
  }

  return (
    <section className="aw-how">
      <div className="container">{content}</div>
    </section>
  );
};

export default AwHowItWorks;

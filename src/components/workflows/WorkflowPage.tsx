import { Navigate, useParams } from "react-router-dom";
import { getWorkflow } from "../../data/workflows";
import WorkflowHero from "./WorkflowHero";
import WorkflowStats from "./WorkflowStats";
import WorkflowPains from "./WorkflowPains";
import WorkflowMechanism from "./WorkflowMechanism";
import WorkflowDemoCta from "./WorkflowDemoCta";
import WorkflowFaq from "./WorkflowFaq";
import AwWhyWorkWithMe from "./AwWhyWorkWithMe";
import AwHowItWorks from "./AwHowItWorks";
import AwFinalCta from "./AwFinalCta";
import "./WorkflowPage.css";

const WorkflowPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const workflow = slug ? getWorkflow(slug) : undefined;

  if (!workflow || !workflow.published) {
    return <Navigate to="/services/automated-workflows" replace />;
  }

  return (
    <>
      <WorkflowHero
        headline={workflow.hero.headline}
        subhead={workflow.hero.subhead}
      />
      <WorkflowStats stats={workflow.stats} />
      <WorkflowPains painPoints={workflow.painPoints} />
      <WorkflowMechanism mechanism={workflow.mechanism} />
      {workflow.hasDemo && (
        <WorkflowDemoCta slug={workflow.slug} label={workflow.label} />
      )}
      <AwWhyWorkWithMe />
      <AwHowItWorks title="How we'd work together" />
      <WorkflowFaq faq={workflow.faq} />
      <AwFinalCta />
    </>
  );
};

export default WorkflowPage;

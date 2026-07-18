import { Navigate, useParams } from "react-router-dom";
import { getWorkflow } from "../../data/workflows";
import WorkflowHero from "./WorkflowHero";
import WorkflowProblemSolution from "./WorkflowProblemSolution";
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
        slug={workflow.slug}
        hasDemo={workflow.hasDemo}
        stats={workflow.stats}
      />
      <WorkflowProblemSolution
        painPoints={workflow.painPoints}
        mechanism={workflow.mechanism}
      />
      {workflow.hasDemo && (
        <WorkflowDemoCta slug={workflow.slug} label={workflow.label} />
      )}
      <section className="wf-tail">
        <div className="container">
          <div className="wf-tail-grid">
            <AwWhyWorkWithMe as="bare" />
            <AwHowItWorks title="How we'd work together" as="bare" />
          </div>
        </div>
      </section>
      <WorkflowFaq faq={workflow.faq} />
      <AwFinalCta />
    </>
  );
};

export default WorkflowPage;

import { Suspense, createElement } from "react";
import { Navigate, useParams } from "react-router-dom";
import { getWorkflow } from "../../data/workflows";
import { showcaseRegistry } from "../../showcases/registry";
import ShowcaseFrame from "../../showcases/ShowcaseFrame";
import WorkflowHero from "./WorkflowHero";
import WorkflowFeatureRow from "./WorkflowFeatureRow";
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

  const tail = (
    <>
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

  const Showcase = showcaseRegistry[workflow.slug];
  const shot = (key: string, layered = false) => (
    <ShowcaseFrame layered={layered}>
      <Suspense fallback={<div className="wf-shot-skeleton" />}>
        {createElement(Showcase, { snippet: key })}
      </Suspense>
    </ShowcaseFrame>
  );

  return (
    <>
      <WorkflowHero
        eyebrow={workflow.label}
        headline={workflow.hero.headline}
        subhead={workflow.hero.subhead}
        slug={workflow.slug}
        hasDemo={workflow.hasDemo}
        stats={workflow.stats}
        heroVisual={shot(workflow.showcase.heroSnippet, true)}
      />
      <WorkflowProblemSolution painPoints={workflow.painPoints} mechanism={[]} />
      <section className="wf-features">
        <div className="container">
          {workflow.showcase.rows.map((row) => (
            <WorkflowFeatureRow
              key={row.title}
              eyebrow={row.eyebrow}
              title={row.title}
              body={row.body}
              flip={row.flip}
              visual={shot(row.snippet)}
            />
          ))}
        </div>
      </section>
      {workflow.hasDemo && (
        <WorkflowDemoCta slug={workflow.slug} label={workflow.label} />
      )}
      {tail}
    </>
  );
};

export default WorkflowPage;

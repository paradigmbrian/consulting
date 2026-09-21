import { createElement } from "react";
import type { PublishedWorkflow } from "../../data/workflows";
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
import "../shared-sections.css";
import "./WorkflowPage.css";

interface WorkflowPageProps {
  workflow: PublishedWorkflow;
}

const WorkflowPage = ({ workflow }: WorkflowPageProps) => {
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
      {createElement(Showcase, { snippet: key })}
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
        <WorkflowDemoCta
          slug={workflow.slug}
          label={workflow.label}
          preview={shot(workflow.showcase.heroSnippet, true)}
        />
      )}
      {tail}
    </>
  );
};

export default WorkflowPage;

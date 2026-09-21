import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import WorkflowPage from "@/components/workflows/WorkflowPage";
import { workflowPath } from "@/data/workflowPaths";
import { getWorkflow, type PublishedWorkflow } from "@/data/workflows";
import { publishedWorkflows } from "@/lib/routes";
import {
  faqJsonLd,
  pageMetadata,
  workflowBreadcrumb,
  workflowJsonLd,
  workflowMeta,
} from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return publishedWorkflows().map((w) => ({ slug: w.slug }));
}

function load(slug: string): PublishedWorkflow {
  const workflow = getWorkflow(slug);
  if (!workflow || !workflow.published) notFound();
  return workflow;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const workflow = load((await params).slug);
  return pageMetadata({ ...workflowMeta(workflow), path: workflowPath(workflow.slug) });
}

export default async function Page({ params }: PageProps) {
  const workflow = load((await params).slug);
  return (
    <>
      <WorkflowPage workflow={workflow} />
      <JsonLd data={workflowJsonLd(workflow)} />
      <JsonLd data={workflowBreadcrumb(workflow)} />
      <JsonLd data={faqJsonLd(workflow.faq)} />
    </>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import { workflowDemoPath } from "@/data/workflowPaths";
import type { PublishedWorkflow } from "@/data/workflows";
import { demoRegistry } from "@/demos/registry";
import { demoWorkflows } from "@/lib/routes";
import { demoBreadcrumb, demoMeta, pageMetadata } from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return demoWorkflows().map((w) => ({ slug: w.slug }));
}

function load(slug: string): PublishedWorkflow {
  const workflow = demoWorkflows().find((w) => w.slug === slug);
  if (!workflow || !demoRegistry[slug]) notFound();
  return workflow;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const workflow = load((await params).slug);
  return pageMetadata({ ...demoMeta(workflow), path: workflowDemoPath(workflow.slug) });
}

export default async function Page({ params }: PageProps) {
  const workflow = load((await params).slug);
  const Demo = demoRegistry[workflow.slug];
  return (
    <>
      <Demo />
      <JsonLd data={demoBreadcrumb(workflow)} />
    </>
  );
}

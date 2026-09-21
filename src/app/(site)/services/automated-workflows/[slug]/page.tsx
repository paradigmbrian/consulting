import { notFound } from "next/navigation";
import { getWorkflow, workflows } from "@/data/workflows";
import WorkflowPage from "@/components/workflows/WorkflowPage";

export const dynamicParams = false;

export function generateStaticParams() {
  return workflows.filter((w) => w.published).map((w) => ({ slug: w.slug }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const workflow = getWorkflow(slug);
  if (!workflow || !workflow.published) notFound();
  return <WorkflowPage workflow={workflow} />;
}

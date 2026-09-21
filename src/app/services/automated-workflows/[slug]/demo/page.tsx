import { notFound } from "next/navigation";
import { demoRegistry } from "@/demos/registry";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(demoRegistry).map((slug) => ({ slug }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const Demo = demoRegistry[slug];
  if (!Demo) notFound();
  return <Demo />;
}

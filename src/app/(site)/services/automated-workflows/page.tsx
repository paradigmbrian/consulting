import AutomatedWorkflows from "@/components/AutomatedWorkflows";
import JsonLd from "@/components/JsonLd";
import { automationsFaq } from "@/data/faq";
import { requireService, servicePath } from "@/data/services";
import { faqJsonLd, pageMetadata, serviceJsonLd } from "@/lib/seo";

const service = requireService("automated-workflows");

export const metadata = pageMetadata({
  title: service.metaTitle,
  description: service.metaDescription,
  path: servicePath(service.slug),
});

export default function Page() {
  return (
    <>
      <AutomatedWorkflows />
      <JsonLd data={serviceJsonLd(service)} />
      <JsonLd data={faqJsonLd(automationsFaq)} />
    </>
  );
}

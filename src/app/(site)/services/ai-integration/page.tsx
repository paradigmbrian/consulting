import AiIntegration from "@/components/AiIntegration";
import JsonLd from "@/components/JsonLd";
import { requireService, servicePath } from "@/data/services";
import { pageMetadata, serviceJsonLd } from "@/lib/seo";

const service = requireService("ai-integration");

export const metadata = pageMetadata({
  title: service.metaTitle,
  description: service.metaDescription,
  path: servicePath(service.slug),
});

export default function Page() {
  return (
    <>
      <AiIntegration />
      <JsonLd data={serviceJsonLd(service)} />
    </>
  );
}

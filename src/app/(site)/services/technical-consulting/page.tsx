import TechnicalConsulting from "@/components/TechnicalConsulting";
import JsonLd from "@/components/JsonLd";
import { requireService, servicePath } from "@/data/services";
import { pageMetadata, serviceJsonLd } from "@/lib/seo";

const service = requireService("technical-consulting");

export const metadata = pageMetadata({
  title: service.metaTitle,
  description: service.metaDescription,
  path: servicePath(service.slug),
});

export default function Page() {
  return (
    <>
      <TechnicalConsulting />
      <JsonLd data={serviceJsonLd(service)} />
    </>
  );
}

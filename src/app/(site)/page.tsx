import Home from "@/components/Home";
import { HOME_DESCRIPTION, HOME_TITLE } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  path: "/",
  absoluteTitle: true,
});

export default function Page() {
  return <Home />;
}

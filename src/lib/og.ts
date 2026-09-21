import { publishedServices, requireService, servicePath } from "../data/services";
import { SITE_SHORT_NAME } from "../data/site";
import { workflowDemoPath, workflowPath } from "../data/workflowPaths";
import { demoWorkflows, publishedWorkflows } from "./routes";
import { ogName } from "./seo";

export interface OgCard {
  name: string; // file name, including ".png"
  eyebrow: string;
  title: string;
}

const card = (path: string, eyebrow: string, title: string): OgCard => ({
  name: `${ogName(path)}.png`,
  eyebrow,
  title,
});

/** One social card per indexable route. */
export function ogCards(): OgCard[] {
  const automations = requireService("automated-workflows").name;
  return [
    card("/", SITE_SHORT_NAME, "AI automation and senior engineering for small business"),
    ...publishedServices.map((s) => card(servicePath(s.slug), s.eyebrow, s.name)),
    ...publishedWorkflows().map((w) => card(workflowPath(w.slug), automations, w.label)),
    ...demoWorkflows().map((w) => card(workflowDemoPath(w.slug), "Interactive demo", w.label)),
  ];
}

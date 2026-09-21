import { publishedServices, servicePath } from "../data/services";
import { workflows, type PublishedWorkflow } from "../data/workflows";
import { workflowDemoPath, workflowPath } from "../data/workflowPaths";

export const publishedWorkflows = (): PublishedWorkflow[] =>
  workflows.filter((w): w is PublishedWorkflow => w.published);

export const demoWorkflows = (): PublishedWorkflow[] =>
  publishedWorkflows().filter((w) => w.hasDemo);

/** Every page inside the site layout. */
export const pageRoutes = (): string[] => [
  "/",
  ...publishedServices.map((s) => servicePath(s.slug)),
  ...publishedWorkflows().map((w) => workflowPath(w.slug)),
];

export const demoRoutes = (): string[] =>
  demoWorkflows().map((w) => workflowDemoPath(w.slug));

/** Every indexable URL the build emits. One list for sitemap, OG cards, tests. */
export const allRoutes = (): string[] => [...pageRoutes(), ...demoRoutes()];

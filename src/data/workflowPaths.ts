export const workflowPath = (slug: string): string =>
  `/services/automated-workflows/${slug}`;

export const workflowDemoPath = (slug: string): string =>
  `${workflowPath(slug)}/demo`;

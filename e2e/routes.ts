import { workflows } from "../src/data/workflows";

const published = workflows.filter((w) => w.published);

export const pageRoutes: string[] = [
  "/",
  "/services/automated-workflows",
  "/services/ai-integration",
  "/services/technical-consulting",
  ...published.map((w) => `/services/automated-workflows/${w.slug}`),
];

export const demoRoutes: string[] = published
  .filter((w) => w.hasDemo)
  .map((w) => `/services/automated-workflows/${w.slug}/demo`);

/** "/services/x/y" → "services--x--y"; "/" → "home". */
export const snapshotName = (route: string): string =>
  route === "/" ? "home" : route.slice(1).replaceAll("/", "--");

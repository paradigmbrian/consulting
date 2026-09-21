import { demoRoutes as demos, pageRoutes as pages } from "../src/lib/routes";

export const pageRoutes: string[] = pages();
export const demoRoutes: string[] = demos();

/** "/services/x/y" → "services--x--y"; "/" → "home". */
export const snapshotName = (route: string): string =>
  route === "/" ? "home" : route.slice(1).replaceAll("/", "--");

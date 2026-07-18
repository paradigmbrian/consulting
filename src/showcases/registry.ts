import { lazy } from "react";
import type { ComponentType, LazyExoticComponent } from "react";

/**
 * slug → lazily-imported showcase module. Each module renders ONE static
 * snippet, selected by the `snippet` key. Lazy so a demo's CSS ships only on
 * its own detail page, mirroring `src/demos/registry.ts`. Workflows are added
 * here (with `lazy(() => import("./<dir>"))`) as their detail pages are
 * redesigned (Tasks 3–4).
 */
export const showcaseRegistry: Record<
  string,
  LazyExoticComponent<ComponentType<{ snippet: string }>>
> = {
  "review-generation": lazy(() => import("./reviewGeneration")),
};

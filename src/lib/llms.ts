import { publishedServices, servicePath } from "../data/services";
import { CALENDLY_URL, HOME_DESCRIPTION, SITE_NAME } from "../data/site";
import { workflowDemoPath, workflowPath } from "../data/workflowPaths";
import { demoWorkflows, publishedWorkflows } from "./routes";
import { absoluteUrl } from "./seo";

const link = (name: string, path: string, note: string): string =>
  `- [${name}](${absoluteUrl(path)}): ${note}`;

/** https://llmstxt.org — a plain-markdown map of the site for language models. */
export function buildLlmsTxt(): string {
  const sections: string[] = [
    `# ${SITE_NAME}`,
    `> ${HOME_DESCRIPTION}`,
    [
      "## Services",
      "",
      ...publishedServices.map((s) => link(s.name, servicePath(s.slug), `${s.eyebrow}. ${s.line}`)),
    ].join("\n"),
    [
      "## Automations",
      "",
      ...publishedWorkflows().map((w) => link(w.label, workflowPath(w.slug), w.cardSummary)),
    ].join("\n"),
    [
      "## Interactive demos",
      "",
      ...demoWorkflows().map((w) =>
        link(
          `${w.label} demo`,
          workflowDemoPath(w.slug),
          "A working click-through on a made-up business.",
        ),
      ),
    ].join("\n"),
    ["## Contact", "", `- [Book a 30-minute call](${CALENDLY_URL})`].join("\n"),
  ];
  return sections.join("\n\n");
}

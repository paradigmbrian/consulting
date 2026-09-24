import { parse } from "node-html-parser";

export interface BuiltPage {
  path: string;
  html: string;
}

export interface VerifyInput {
  pages: BuiltPage[];
  sitemapXml: string;
  siteUrl: string;
  /** Does this site-root-relative path ("/og/home.png") exist in the build output? */
  fileExists: (publicPath: string) => boolean;
  /** The built file's text, or null when it does not exist. */
  readFile: (publicPath: string) => string | null;
}

/** Route handlers and static assets nothing else in this gate would notice missing. */
const REQUIRED_FILES = ["llms.txt", "robots.txt", "sitemap.xml", "favicon.ico"];

function duplicates(label: string, values: Map<string, string[]>): string[] {
  return [...values.entries()]
    .filter(([, paths]) => paths.length > 1)
    .map(([value, paths]) => `duplicate ${label} "${value}": ${paths.join(", ")}`);
}

export function verify({
  pages,
  sitemapXml,
  siteUrl,
  fileExists,
  readFile,
}: VerifyInput): string[] {
  const problems: string[] = [];
  const titles = new Map<string, string[]>();
  const descriptions = new Map<string, string[]>();
  const urlOf = (path: string): string => (path === "/" ? siteUrl : `${siteUrl}${path}`);

  for (const { path, html } of pages) {
    const root = parse(html);

    const title = root.querySelector("title")?.text.trim() ?? "";
    if (!title) problems.push(`${path}: missing <title>`);
    else titles.set(title, [...(titles.get(title) ?? []), path]);

    const description =
      root.querySelector('meta[name="description"]')?.getAttribute("content")?.trim() ?? "";
    if (!description) problems.push(`${path}: missing meta description`);
    else {
      descriptions.set(description, [...(descriptions.get(description) ?? []), path]);
      if (description.length < 70 || description.length > 160) {
        problems.push(`${path}: description is ${description.length} chars, expected 70–160`);
      }
    }

    const canonical = root.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? "";
    if (!canonical) problems.push(`${path}: missing canonical`);
    else if (canonical !== urlOf(path)) {
      problems.push(`${path}: canonical is ${canonical}, expected ${urlOf(path)}`);
    }

    const ogImage = root.querySelector('meta[property="og:image"]')?.getAttribute("content") ?? "";
    if (!ogImage) problems.push(`${path}: missing og:image`);
    else {
      const publicPath = new URL(ogImage).pathname;
      if (!fileExists(publicPath)) problems.push(`${path}: og:image ${publicPath} was not built`);
    }

    const h1Count = root.querySelectorAll("h1").length;
    if (h1Count !== 1) problems.push(`${path}: expected exactly one <h1>, found ${h1Count}`);

    root.querySelectorAll('script[type="application/ld+json"]').forEach((script, index) => {
      try {
        JSON.parse(script.text);
      } catch {
        problems.push(`${path}: JSON-LD block ${index + 1} does not parse`);
      }
    });
  }

  problems.push(...duplicates("title", titles), ...duplicates("description", descriptions));

  const inSitemap = new Set([...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
  const built = new Set(pages.map((p) => urlOf(p.path)));
  for (const p of pages) {
    if (!inSitemap.has(urlOf(p.path))) problems.push(`${p.path}: not in sitemap.xml`);
  }
  for (const url of inSitemap) {
    if (!built.has(url)) problems.push(`sitemap.xml lists ${url}, which was not built`);
  }

  for (const file of REQUIRED_FILES) {
    const text = readFile(`/${file}`);
    if (text === null) problems.push(`${file}: not built`);
    else if (!text.trim()) problems.push(`${file}: built empty`);
  }

  return problems;
}

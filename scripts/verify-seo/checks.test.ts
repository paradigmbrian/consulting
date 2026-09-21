import { describe, expect, it } from "vitest";
import { verify, type VerifyInput } from "./checks";

const SITE = "https://example.com";

const page = (path: string, overrides: Partial<Record<string, string>> = {}): string => {
  const url = path === "/" ? SITE : `${SITE}${path}`;
  const parts = {
    title: `<title>Title ${path}</title>`,
    description: `<meta name="description" content="Description ${path}">`,
    canonical: `<link rel="canonical" href="${url}">`,
    og: `<meta property="og:image" content="${SITE}/og/x.png">`,
    body: `<h1>Heading</h1><script type="application/ld+json">{"@type":"WebSite"}</script>`,
    ...overrides,
  };
  return `<html><head>${parts.title}${parts.description}${parts.canonical}${parts.og}</head><body>${parts.body}</body></html>`;
};

const sitemap = (paths: string[]): string =>
  `<urlset>${paths.map((p) => `<url><loc>${p === "/" ? SITE : SITE + p}</loc></url>`).join("")}</urlset>`;

const input = (pages: { path: string; html: string }[], paths?: string[]): VerifyInput => ({
  pages,
  sitemapXml: sitemap(paths ?? pages.map((p) => p.path)),
  siteUrl: SITE,
  fileExists: () => true,
  readFile: () => "content",
});

describe("verify", () => {
  it("passes a good build", () => {
    expect(verify(input([{ path: "/", html: page("/") }, { path: "/a", html: page("/a") }]))).toEqual([]);
  });

  it.each([
    ["title", "missing <title>"],
    ["description", "missing meta description"],
    ["canonical", "missing canonical"],
    ["og", "missing og:image"],
  ])("reports a page with no %s", (part, message) => {
    const problems = verify(input([{ path: "/a", html: page("/a", { [part]: "" }) }]));
    expect(problems).toContain(`/a: ${message}`);
  });

  it("reports a canonical that is not the page's own URL", () => {
    const html = page("/a", { canonical: `<link rel="canonical" href="${SITE}/b">` });
    expect(verify(input([{ path: "/a", html }]))).toContain(
      `/a: canonical is ${SITE}/b, expected ${SITE}/a`,
    );
  });

  it("reports zero or several h1s", () => {
    expect(verify(input([{ path: "/a", html: page("/a", { body: "<p>x</p>" }) }]))).toContain(
      "/a: expected exactly one <h1>, found 0",
    );
    expect(
      verify(input([{ path: "/a", html: page("/a", { body: "<h1>a</h1><h1>b</h1>" }) }])),
    ).toContain("/a: expected exactly one <h1>, found 2");
  });

  it("reports JSON-LD that does not parse", () => {
    const body = `<h1>x</h1><script type="application/ld+json">{oops</script>`;
    expect(verify(input([{ path: "/a", html: page("/a", { body }) }]))).toContain(
      "/a: JSON-LD block 1 does not parse",
    );
  });

  it("reports an og:image whose file was not built", () => {
    const problems = verify({ ...input([{ path: "/a", html: page("/a") }]), fileExists: () => false });
    expect(problems).toContain("/a: og:image /og/x.png was not built");
  });

  it("reports duplicate titles and descriptions across pages", () => {
    const same = { title: "<title>Same</title>", description: `<meta name="description" content="Same">` };
    const problems = verify(
      input([
        { path: "/a", html: page("/a", same) },
        { path: "/b", html: page("/b", same) },
      ]),
    );
    expect(problems).toContain('duplicate title "Same": /a, /b');
    expect(problems).toContain('duplicate description "Same": /a, /b');
  });

  it.each(["llms.txt", "robots.txt", "sitemap.xml"])("reports a missing %s", (file) => {
    const problems = verify({
      ...input([{ path: "/a", html: page("/a") }]),
      readFile: (publicPath) => (publicPath === `/${file}` ? null : "content"),
    });
    expect(problems).toContain(`${file}: not built`);
  });

  it("reports a required artifact that was built empty", () => {
    const problems = verify({
      ...input([{ path: "/a", html: page("/a") }]),
      readFile: (publicPath) => (publicPath === "/llms.txt" ? "  \n" : "content"),
    });
    expect(problems).toContain("llms.txt: built empty");
  });

  it("reports pages missing from the sitemap and sitemap URLs with no page", () => {
    const problems = verify(input([{ path: "/a", html: page("/a") }], ["/b"]));
    expect(problems).toContain("/a: not in sitemap.xml");
    expect(problems).toContain(`sitemap.xml lists ${SITE}/b, which was not built`);
  });
});

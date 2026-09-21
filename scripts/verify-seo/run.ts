import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { SITE_URL } from "../../src/data/site";
import { verify, type BuiltPage } from "./checks";

const OUT = "out";

/** Not part of this site's metadata contract. */
const EXCLUDED_FILES = new Set(["404.html", "_not-found.html"]);
const EXCLUDED_DIRS = new Set(["activebalance", "_next"]);

function htmlFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      return dir === OUT && EXCLUDED_DIRS.has(entry.name) ? [] : htmlFiles(full);
    }
    const isPage = entry.name.endsWith(".html") && !(dir === OUT && EXCLUDED_FILES.has(entry.name));
    return isPage ? [full] : [];
  });
}

/** out/index.html → "/", out/services/x.html → "/services/x" */
function toPath(file: string): string {
  const rel = relative(OUT, file).split(sep).join("/").replace(/\.html$/, "");
  return rel === "index" ? "/" : `/${rel}`;
}

const pages: BuiltPage[] = htmlFiles(OUT).map((file) => ({
  path: toPath(file),
  html: readFileSync(file, "utf8"),
}));

const problems = verify({
  pages,
  sitemapXml: readFileSync(join(OUT, "sitemap.xml"), "utf8"),
  siteUrl: SITE_URL,
  fileExists: (publicPath) => existsSync(join(OUT, publicPath)),
});

if (problems.length > 0) {
  console.error(`SEO gate: ${problems.length} problem(s) in ${pages.length} pages\n`);
  for (const problem of problems) console.error(`  ✗ ${problem}`);
  process.exit(1);
}

console.log(`SEO gate: ${pages.length} pages OK`);

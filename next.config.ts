import type { NextConfig } from "next";

const config: NextConfig = {
  output: "export",
  // Static export has no image optimizer. Spec 2 replaces this with a Netlify
  // Image CDN loader; until then the site has no content images.
  images: { unoptimized: true },
};

export default config;

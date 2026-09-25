import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { SITE_NAME } from "@/data/site";
import { ogCards } from "@/lib/og";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return ogCards().map((card) => ({ name: card.name }));
}

// next/og bundles a single regular weight, so bold needs a font file. Inter 4.1
// (SIL OFL), subset to Latin in src/app/og/fonts/. The subset keeps only
// U+0020–007E, U+00A0–00FF, U+2013–2014, U+2018–2019, U+201C–201D, U+2026.
// Passing `fonts` below replaces next/og's bundled face entirely, so a
// character outside that subset renders blank — re-subset before adding
// copy that needs one. process.cwd() must be the repo root: true for
// `npm run build` run from the root, and true on Netlify with no `base`
// directory configured.
const FONT_DIR = join(process.cwd(), "src/app/og/fonts");
const interBold = await readFile(join(FONT_DIR, "Inter-Bold.ttf"));
const interSemiBold = await readFile(join(FONT_DIR, "Inter-SemiBold.ttf"));

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params;
  const card = ogCards().find((c) => c.name === name);
  if (!card) return new Response("Not found", { status: 404 });

  // next/og resolves no CSS variables, so these hex values are a hand copy of
  // src/index.css: --color-primary #2563eb, --color-text #0f172a,
  // --color-text-light #566072, and the linear-gradient half of --hero-bg.
  // Change a token there and change it here too.
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          fontFamily: "Inter",
          background: "linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)",
        }}
      >
        <div style={{ display: "flex", width: 24, height: "100%", background: "#2563eb" }} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "72px 80px",
            flex: 1,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 34, fontWeight: 600, color: "#2563eb" }}>
              {card.eyebrow}
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 24,
                fontSize: card.title.length > 40 ? 64 : 80,
                fontWeight: 700,
                lineHeight: 1.1,
                color: "#0f172a",
              }}
            >
              {card.title}
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 30, fontWeight: 600, color: "#566072" }}>
            {SITE_NAME}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Inter", data: interBold, weight: 700, style: "normal" },
        { name: "Inter", data: interSemiBold, weight: 600, style: "normal" },
      ],
    },
  );
}

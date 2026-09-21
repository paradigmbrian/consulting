import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/data/site";
import { ogCards } from "@/lib/og";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return ogCards().map((card) => ({ name: card.name }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params;
  const card = ogCards().find((c) => c.name === name);
  if (!card) return new Response("Not found", { status: 404 });

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
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
          <div style={{ display: "flex", fontSize: 30, color: "#566072" }}>{SITE_NAME}</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}

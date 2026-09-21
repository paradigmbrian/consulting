import type { Metadata } from "next";
import type { ReactNode } from "react";
import JsonLd from "@/components/JsonLd";
import { HOME_DESCRIPTION, HOME_TITLE, SITE_SHORT_NAME, SITE_URL } from "@/data/site";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import "../index.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: HOME_TITLE, template: `%s | ${SITE_SHORT_NAME}` },
  description: HOME_DESCRIPTION,
  icons: {
    icon: [
      { url: "/favicon/ps-favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/ps-favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/ps-favicon-1024.png", sizes: "1024x1024", type: "image/png" },
    ],
    apple: [
      { url: "/favicon/ps-favicon-192.png", sizes: "192x192" },
      { url: "/favicon/ps-favicon-512.png", sizes: "512x512" },
    ],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
      </body>
    </html>
  );
}

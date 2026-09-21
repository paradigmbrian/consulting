import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../index.css";

export const metadata: Metadata = {
  title: "AI Automation for Small Business | Paradigm Shift Software Development",
  description:
    "AI-powered automation for small and trades businesses — missed-call text-back, review generation, quoting, invoicing, dispatch and more, built on the tools you already use. See nine working demos.",
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
      <body>{children}</body>
    </html>
  );
}

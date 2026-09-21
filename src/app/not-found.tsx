import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NotFound from "@/components/NotFound";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFoundPage() {
  return (
    <>
      <Header />
      <main>
        <NotFound />
      </main>
      <Footer />
    </>
  );
}

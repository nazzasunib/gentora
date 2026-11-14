import type { Metadata, Viewport } from "next";
import "@fontsource/cormorant-garamond/300.css";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "@fontsource-variable/manrope";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import SearchOverlay from "@/components/layout/SearchOverlay";
import QuickView from "@/components/products/QuickView";
import Toasts from "@/components/layout/Toasts";
import SmoothScroll from "@/components/layout/SmoothScroll";
import Loader from "@/components/layout/Loader";
import { SITE } from "@/lib/utils";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: "GENTORA — Dress Sharp. Lead with Confidence.", template: "%s · GENTORA" },
  description: SITE.description,
  keywords: ["men's formal shirts", "formal pants", "leather belts", "men's watches", "office bags", "Bangladesh", "GENTORA"],
  openGraph: {
    type: "website",
    siteName: "GENTORA",
    title: "GENTORA — Dress Sharp. Lead with Confidence.",
    description: SITE.description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "GENTORA — premium men's fashion" }],
    locale: "en_BD",
  },
  twitter: { card: "summary_large_image", title: "GENTORA", description: SITE.description, images: ["/og.jpg"] },
  icons: { icon: "/icons/favicon.svg" },
};

export const viewport: Viewport = { themeColor: "#F7F5F0", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Loader />
        <SmoothScroll />
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
        <CartDrawer />
        <QuickView />
        <SearchOverlay />
        <Toasts />
      </body>
    </html>
  );
}

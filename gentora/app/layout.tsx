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
  title: { default: "Vesture’s — Dress Sharp. Lead with Confidence.", template: "%s · Vesture’s" },
  description: SITE.description,
  keywords: ["men's formal shirts", "formal pants", "leather belts", "men's watches", "office bags", "Bangladesh", "Vesture’s"],
  openGraph: {
    type: "website",
    siteName: "Vesture’s",
    title: "Vesture’s — Dress Sharp. Lead with Confidence.",
    description: SITE.description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Vesture’s — premium men's fashion" }],
    locale: "en_BD",
  },
  twitter: { card: "summary_large_image", title: "Vesture’s", description: SITE.description, images: ["/og.jpg"] },
  icons: { icon: [{ url: "/favicon.ico", sizes: "32x32" }, { url: "/icons/icon.png", type: "image/png", sizes: "512x512" }], apple: "/icons/apple-icon.png" },
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

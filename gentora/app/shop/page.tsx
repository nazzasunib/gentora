import type { Metadata } from "next";
import { Suspense } from "react";
import ShopClient from "./ShopClient";

export const metadata: Metadata = {
  title: "Shop the Collection",
  description: "Shop GENTORA formal shirts, tailored trousers, leather belts, wristwatches and office bags. Filter by category, search and sort by price.",
  openGraph: { title: "Shop the Collection · GENTORA" },
};

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-ink pt-40" />}>
      <ShopClient />
    </Suspense>
  );
}

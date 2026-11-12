import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { HELP_PAGES } from "@/data/help";
import { SITE } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = ["", "/shop", "/about"].map((p) => ({ url: `${SITE.url}${p}`, priority: p === "" ? 1 : 0.8 }));
  return [
    ...base,
    ...products.map((p) => ({ url: `${SITE.url}/product/${p.slug}`, priority: 0.7 })),
    ...Object.keys(HELP_PAGES).map((k) => ({ url: `${SITE.url}/help/${k}`, priority: 0.3 })),
  ];
}

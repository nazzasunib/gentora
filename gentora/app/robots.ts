import type { MetadataRoute } from "next";
import { SITE } from "@/lib/utils";

export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/checkout", "/cart", "/account", "/studio"] }], sitemap: `${SITE.url}/sitemap.xml` };
}

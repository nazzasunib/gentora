import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { products, getProduct, getCategory } from "@/data/products";
import ProductDetail from "./ProductDetail";
import { SITE } from "@/lib/utils";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return { title: "Product not found" };
  return {
    title: p.name,
    description: `${p.short} ${p.description}`.slice(0, 158),
    openGraph: { title: `${p.name} · GENTORA`, description: p.short, images: p.images[0].startsWith("/") ? [p.images[0]] : undefined },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const related = products.filter((p) => p.id !== product.id && (p.category === product.category || getCategory(p.category)?.group === getCategory(product.category)?.group)).slice(0, 4);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: { "@type": "Brand", name: "GENTORA" },
    category: getCategory(product.category)?.name,
    image: product.images.map((i) => (i.startsWith("/") ? `${SITE.url}${i}` : i)),
    offers: { "@type": "Offer", priceCurrency: "BDT", price: product.price, availability: "https://schema.org/InStock" },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductDetail product={product} related={related} />
    </>
  );
}

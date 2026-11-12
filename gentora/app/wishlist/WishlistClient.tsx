"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import ProductCard from "@/components/products/ProductCard";
import { useShop } from "@/lib/store";
import { useHydrated } from "@/hooks/useHydrated";
import { getProductById } from "@/data/products";

export default function WishlistClient() {
  const hydrated = useHydrated();
  const wishlist = useShop((s) => s.wishlist);
  const items = (hydrated ? wishlist : []).map(getProductById).filter((p): p is NonNullable<typeof p> => !!p);
  return (
    <>
      <PageHeader title="Wishlist" intro="Saved on this device — your wishlist persists between visits." crumbs={[{ label: "Wishlist" }]} />
      <section className="bg-ink pb-32 pt-12">
        <div className="container-site">
          {hydrated && items.length === 0 ? (
            <div className="flex flex-col items-center gap-5 py-24 text-center">
              <Heart size={40} strokeWidth={1} className="text-gold" />
              <p className="font-display text-4xl">Nothing saved yet</p>
              <p className="text-sm text-muted">Tap the heart on any piece to keep it here.</p>
              <Link href="/shop" className="btn-gold mt-2">Explore Collection</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
              {items.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

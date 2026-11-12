"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, Heart, Plus } from "lucide-react";
import type { Product } from "@/lib/types";
import { useShop } from "@/lib/store";
import { useHydrated } from "@/hooks/useHydrated";
import SmartImage from "@/components/ui/SmartImage";
import Price from "@/components/ui/Price";
import { cn, discountPct } from "@/lib/utils";
import { getCategory } from "@/data/products";

export default function ProductCard({ product, index = 0, light = false, priority = false }: { product: Product; index?: number; light?: boolean; priority?: boolean }) {
  const { addToCart, toggleWishlist, wishlist, setQuickView } = useShop();
  const hydrated = useHydrated();
  const wished = hydrated && wishlist.includes(product.id);
  const off = discountPct(product.price, product.compareAt);
  const label = product.compareAt ? `Sale −${off}%` : product.badge;

  const quickAdd = () => {
    if (product.sizes?.length) setQuickView(product.id);
    else addToCart({ productId: product.id, color: product.colors[0]?.name });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.8, delay: (index % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col"
    >
      <div className={cn("relative aspect-[4/5] overflow-hidden", light ? "bg-[#E9E4DA]" : "bg-surface")}>
        <Link href={`/product/${product.slug}`} aria-label={product.name} className="absolute inset-0">
          <SmartImage
            src={product.images[0]}
            alt={product.name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-[1.4s] ease-luxe group-hover:scale-[1.06]"
            fallbackLabel={product.name}
          />
          {product.images[1] && (
            <span className="absolute inset-0 opacity-0 transition-opacity duration-700 ease-luxe group-hover:opacity-100">
              <SmartImage src={product.images[1]} alt="" fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover" fallbackLabel={product.name} />
            </span>
          )}
        </Link>

        {label && (
          <span className={cn("absolute left-3 top-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide2", product.compareAt ? "bg-cream text-ink" : "bg-ink/80 text-gold backdrop-blur")}>
            {label}
          </span>
        )}

        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-pressed={wished}
          aria-label={wished ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-ink/60 text-white backdrop-blur transition-colors hover:text-gold"
        >
          <Heart size={16} strokeWidth={1.5} className={wished ? "fill-gold text-gold" : ""} />
        </button>

        <div className="absolute inset-x-3 bottom-3 grid grid-cols-[auto_1fr] gap-2 transition-all duration-500 ease-luxe lg:translate-y-4 lg:opacity-0 lg:group-focus-within:translate-y-0 lg:group-focus-within:opacity-100 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
          <button type="button" onClick={() => setQuickView(product.id)} aria-label={`Quick view ${product.name}`} className="flex h-10 w-10 items-center justify-center bg-ink/85 text-white backdrop-blur hover:text-gold">
            <Eye size={16} strokeWidth={1.5} />
          </button>
          <button type="button" onClick={quickAdd} className="flex h-10 items-center justify-center gap-2 bg-cream text-[11px] font-bold uppercase tracking-wide2 text-ink transition-colors hover:bg-gold">
            <Plus size={14} /> {product.sizes?.length ? "Select Size" : "Add to Cart"}
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <p className={cn("text-[10px] font-semibold uppercase tracking-wide2", light ? "text-bronze" : "text-muted")}>{getCategory(product.category)?.name}</p>
        <h3 className="mt-1.5 text-[15px] font-medium leading-snug">
          <Link href={`/product/${product.slug}`} className={cn("transition-colors", light ? "text-ink hover:text-bronze" : "hover:text-gold")}>{product.name}</Link>
        </h3>
        <Price price={product.price} compareAt={product.compareAt} className={cn("mt-2", light ? "text-ink" : "")} />
      </div>
    </motion.article>
  );
}

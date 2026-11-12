"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useShop } from "@/lib/store";
import { getProductById, getCategory } from "@/data/products";
import SmartImage from "@/components/ui/SmartImage";
import Price from "@/components/ui/Price";
import Stars from "@/components/ui/Stars";
import PurchasePanel from "./PurchasePanel";
import { cn } from "@/lib/utils";

export default function QuickView() {
  const { quickViewId, setQuickView } = useShop();
  const product = quickViewId ? getProductById(quickViewId) : undefined;
  const [img, setImg] = useState(0);

  useEffect(() => setImg(0), [quickViewId]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setQuickView(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setQuickView]);

  return (
    <AnimatePresence>
      {product && (
        <div className="fixed inset-0 z-[75] flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={`Quick view: ${product.name}`}>
          <motion.div className="absolute inset-0 bg-black/70 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setQuickView(null)} />
          <motion.div
            className="relative grid max-h-[92vh] w-full max-w-5xl overflow-y-auto border border-line bg-surface md:grid-cols-2"
            data-lenis-prevent
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <button onClick={() => setQuickView(null)} aria-label="Close quick view" className="absolute right-3 top-3 z-10 bg-ink/70 p-2 text-white hover:text-gold" autoFocus>
              <X size={18} />
            </button>
            <div className="bg-ink">
              <div className="relative aspect-[4/5]">
                <SmartImage key={product.images[img]} src={product.images[img]} alt={product.name} fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover" fallbackLabel={product.name} />
              </div>
              <div className="flex gap-2 p-3">
                {product.images.map((src, i) => (
                  <button key={src + i} onClick={() => setImg(i)} aria-label={`View image ${i + 1}`} className={cn("relative h-16 w-14 overflow-hidden border", i === img ? "border-gold" : "border-transparent opacity-60 hover:opacity-100")}>
                    <SmartImage src={src} alt="" fill sizes="56px" className="object-cover" fallbackLabel=" " />
                  </button>
                ))}
              </div>
            </div>
            <div className="p-6 sm:p-10">
              <p className="eyebrow">{getCategory(product.category)?.name}</p>
              <h2 className="mt-3 font-display text-4xl font-light">{product.name}</h2>
              <div className="mt-3 flex items-center gap-3"><Stars value={product.rating} /><span className="text-xs text-muted">{product.rating.toFixed(1)}</span></div>
              <Price price={product.price} compareAt={product.compareAt} size="lg" className="mt-5" />
              <p className="mt-5 text-sm leading-relaxed text-muted">{product.description}</p>
              <div className="mt-8"><PurchasePanel product={product} compact onAdded={() => setTimeout(() => setQuickView(null), 600)} /></div>
              <Link href={`/product/${product.slug}`} onClick={() => setQuickView(null)} className="link-underline mt-8 inline-block text-[11px] font-semibold uppercase tracking-wide2 text-gold">
                View full details
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

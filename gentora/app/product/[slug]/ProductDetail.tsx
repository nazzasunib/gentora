"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Minus, Plus, Rotate3d, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import type { Product } from "@/lib/types";
import SmartImage from "@/components/ui/SmartImage";
import Price from "@/components/ui/Price";
import Stars from "@/components/ui/Stars";
import PurchasePanel from "@/components/products/PurchasePanel";
import ProductCard from "@/components/products/ProductCard";
import ErrorBoundary from "@/components/3d/ErrorBoundary";
import { useCanRender3D } from "@/hooks/useCanRender3D";
import { getCategory } from "@/data/products";
import { cn, discountPct, formatBDT, SITE } from "@/lib/utils";

const MiniViewer = dynamic(() => import("@/components/3d/MiniViewer"), { ssr: false, loading: () => <div className="absolute inset-0 animate-shimmer bg-[linear-gradient(90deg,#1a1a1a,#222,#1a1a1a)] bg-[length:200%_100%]" /> });

const MODEL_3D: Record<string, { kind: "watch" | "bag" | "belt"; variant: string }> = {
  p09: { kind: "belt", variant: "brown" }, p10: { kind: "belt", variant: "black" }, p11: { kind: "belt", variant: "tan" },
  p12: { kind: "watch", variant: "steel" }, p13: { kind: "watch", variant: "noir" }, p14: { kind: "watch", variant: "gold" },
  p15: { kind: "bag", variant: "brown" }, p16: { kind: "bag", variant: "black" }, p17: { kind: "bag", variant: "tan" },
};

export default function ProductDetail({ product, related }: { product: Product; related: Product[] }) {
  const [img, setImg] = useState(0);
  const [mode3d, setMode3d] = useState(false);
  const [open, setOpen] = useState<string | null>("details");
  const can3D = useCanRender3D();
  const model = MODEL_3D[product.id];
  const cat = getCategory(product.category)!;
  const off = discountPct(product.price, product.compareAt);

  const sections = [
    { id: "details", title: "Product details", body: <p className="leading-relaxed">{product.description}</p> },
    {
      id: "specs", title: "Specifications", body: (
        <dl className="divide-y divide-line">
          {product.specs.map((s) => (
            <div key={s.label} className="grid grid-cols-[140px_1fr] gap-4 py-3">
              <dt className="text-[11px] uppercase tracking-wide2 text-muted">{s.label}</dt>
              <dd className="text-sm text-white/85">{s.value}</dd>
            </div>
          ))}
        </dl>
      ),
    },
    { id: "delivery", title: "Delivery & returns", body: <p className="leading-relaxed">Delivery across Bangladesh in 2–5 working days. Complimentary delivery on orders over {formatBDT(SITE.freeShippingThreshold)}; otherwise {formatBDT(SITE.shippingFee)}. Unworn items can be returned within 7 days. <Link href="/help/returns" className="text-gold underline-offset-4 hover:underline">Return policy</Link> (demo terms).</p> },
  ];

  return (
    <>
      <div className="bg-ink pt-28 lg:pt-32">
        <div className="container-site">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-wide2 text-muted">
              <li><Link href="/" className="hover:text-gold">Home</Link></li>
              <li className="flex items-center gap-2"><ChevronRight size={12} /><Link href="/shop" className="hover:text-gold">Shop</Link></li>
              <li className="flex items-center gap-2"><ChevronRight size={12} /><Link href={`/shop?category=${cat.id}`} className="hover:text-gold">{cat.name}</Link></li>
              <li className="flex items-center gap-2"><ChevronRight size={12} /><span aria-current="page" className="text-white/80">{product.name}</span></li>
            </ol>
          </nav>

          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            {/* gallery */}
            <div className="lg:col-span-7">
              <div className="flex flex-col-reverse gap-3 sm:flex-row">
                <div className="no-scrollbar flex gap-3 overflow-x-auto sm:w-20 sm:flex-col" role="tablist" aria-label="Product images">
                  {product.images.map((src, i) => (
                    <button key={src + i} role="tab" aria-selected={!mode3d && img === i} aria-label={`Image ${i + 1}`} onClick={() => { setImg(i); setMode3d(false); }}
                      className={cn("relative aspect-[4/5] w-16 shrink-0 overflow-hidden border sm:w-full", !mode3d && img === i ? "border-gold" : "border-transparent opacity-55 hover:opacity-100")}>
                      <SmartImage src={src} alt="" fill sizes="80px" className="object-cover" fallbackLabel=" " />
                    </button>
                  ))}
                  {model && can3D === "yes" && (
                    <button role="tab" aria-selected={mode3d} onClick={() => setMode3d(true)} aria-label="Interactive 3D view"
                      className={cn("flex aspect-[4/5] w-16 shrink-0 flex-col items-center justify-center gap-1 border text-[9px] font-bold uppercase tracking-wide2 sm:w-full", mode3d ? "border-gold text-gold" : "border-white/15 text-white/60 hover:text-gold")}>
                      <Rotate3d size={20} strokeWidth={1.25} /> 3D
                    </button>
                  )}
                </div>
                <div className="group relative aspect-[4/5] flex-1 overflow-hidden bg-surface">
                  <AnimatePresence mode="wait">
                    {mode3d && model ? (
                      <motion.div key="3d" className="dark-zone absolute inset-0 cursor-grab active:cursor-grabbing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ background: "radial-gradient(80% 60% at 50% 40%, #2a2724, #141414 70%)" }}>
                        <ErrorBoundary fallback={<SmartImage src={product.images[0]} alt={product.name} fill className="object-cover" />}>
                          <MiniViewer kind={model.kind} variant={model.variant} />
                        </ErrorBoundary>
                        <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-luxe text-white/50">Drag to rotate</p>
                      </motion.div>
                    ) : (
                      <motion.div key={img} className="absolute inset-0" initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
                        <SmartImage src={product.images[img]} alt={`${product.name} — view ${img + 1}`} fill priority sizes="(max-width:1024px) 100vw, 55vw" className="object-cover transition-transform duration-[1.4s] ease-luxe group-hover:scale-105" fallbackLabel={product.name} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {product.badge && !mode3d && (
                    <span className={cn("absolute left-4 top-4 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide2", product.compareAt ? "bg-cream text-deep" : "bg-ink/80 text-gold")}>{product.compareAt ? `Sale −${off}%` : product.badge}</span>
                  )}
                </div>
              </div>
            </div>

            {/* info */}
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-28">
                <p className="eyebrow">{cat.name}</p>
                <h1 className="h-display mt-4 text-4xl sm:text-5xl">{product.name}</h1>
                <div className="mt-4 flex items-center gap-3"><Stars value={product.rating} /><span className="text-xs text-muted">{product.rating.toFixed(1)} · demo rating</span></div>
                <Price price={product.price} compareAt={product.compareAt} size="lg" className="mt-6" />
                {off > 0 && <p className="mt-1 text-xs text-gold">You save {formatBDT(product.compareAt! - product.price)}</p>}
                <p className="mt-6 text-[15px] leading-relaxed text-white/70">{product.short}</p>
                <div className="mt-8 border-t border-line pt-8"><PurchasePanel product={product} /></div>

                <ul className="mt-8 grid gap-3 text-xs text-muted sm:grid-cols-3">
                  <li className="flex items-center gap-2"><Truck size={15} className="text-gold" /> Free over ৳5,000</li>
                  <li className="flex items-center gap-2"><RotateCcw size={15} className="text-gold" /> 7-day returns</li>
                  <li className="flex items-center gap-2"><ShieldCheck size={15} className="text-gold" /> Quality checked</li>
                </ul>

                <div className="mt-10 border-t border-line">
                  {sections.map((s) => (
                    <div key={s.id} className="border-b border-line">
                      <button onClick={() => setOpen(open === s.id ? null : s.id)} aria-expanded={open === s.id} className="flex w-full items-center justify-between py-5 text-left text-[12px] font-semibold uppercase tracking-wide2 hover:text-gold">
                        {s.title} {open === s.id ? <Minus size={15} /> : <Plus size={15} />}
                      </button>
                      <AnimatePresence initial={false}>
                        {open === s.id && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4 }} className="overflow-hidden">
                            <div className="pb-6 text-sm text-white/70">{s.body}</div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="bg-ink py-28" aria-label="Related products">
          <div className="container-site">
            <div className="mb-12 flex items-end justify-between">
              <h2 className="h-display text-4xl sm:text-5xl">Complete the look</h2>
              <Link href={`/shop?category=${cat.id}`} className="link-underline text-[11px] font-semibold uppercase tracking-wide2 text-gold">View all</Link>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-12 lg:grid-cols-4 lg:gap-x-6">
              {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

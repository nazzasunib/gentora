"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ShoppingBag } from "lucide-react";
import SmartImage from "@/components/ui/SmartImage";
import Reveal, { RevealText } from "@/components/ui/Reveal";
import { officeLook, getProductById, getCategory } from "@/data/products";
import { useShop } from "@/lib/store";
import { formatBDT, cn } from "@/lib/utils";

const HOTSPOTS = [
  { top: "30%", left: "48%" }, // shirt
  { top: "68%", left: "44%" }, // pants
  { top: "52%", left: "47%" }, // belt
  { top: "50%", left: "30%" }, // watch
  { top: "78%", left: "70%" }, // bag
];

export default function OfficeLook() {
  const addMany = useShop((s) => s.addManyToCart);
  const [selected, setSelected] = useState<string[]>(officeLook.items.map((i) => i.productId));
  const [hover, setHover] = useState<number | null>(null);
  const items = officeLook.items.map((i) => ({ ...i, product: getProductById(i.productId)! }));
  const chosen = items.filter((i) => selected.includes(i.productId));
  const total = chosen.reduce((s, i) => s + i.product.price, 0);

  const toggle = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <section className="bg-surface py-28 text-deep lg:py-36" aria-labelledby="look-title">
      <div className="container-site grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="relative min-w-0 lg:col-span-6">
          <div className="sticky top-28">
            <div className="relative aspect-[4/5] overflow-hidden bg-[#E2DBCE]">
              <SmartImage src={officeLook.image} alt="Model wearing the complete GENTORA office look" fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" fallbackLabel="The Complete Office Look" />
              {HOTSPOTS.map((h, i) => (
                <button
                  key={i}
                  type="button"
                  className={cn("absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[11px] font-bold transition-all duration-500", hover === i ? "scale-125 bg-gold text-on-gold" : "bg-deep/80 text-[#C6A46A] backdrop-blur")}
                  style={h}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                  aria-label={items[i].product.name}
                >
                  <span className="absolute inset-0 animate-ping rounded-full bg-gold/30" />
                  {i + 1}
                </button>
              ))}
            </div>
            <p className="mt-3 text-[11px] uppercase tracking-wide2 text-deep/50">Styled look · Hover the markers</p>
          </div>
        </div>

        <div className="min-w-0 lg:col-span-6">
          <Reveal y={12}><p className="eyebrow mb-5 text-bronze">Editorial · Look 01</p></Reveal>
          <h2 id="look-title" className="h-display text-5xl sm:text-6xl lg:text-7xl">
            <RevealText text="THE COMPLETE" /><br /><RevealText text="OFFICE LOOK" className="italic text-bronze" delay={0.15} />
          </h2>
          <Reveal delay={0.15}><p className="mt-6 max-w-md text-[15px] leading-relaxed text-deep/65">Five pieces, one confident silhouette. Remove anything you already own — the total updates instantly.</p></Reveal>

          <ul className="mt-10 divide-y divide-deep/10 border-y border-deep/10">
            {items.map((i, idx) => {
              const on = selected.includes(i.productId);
              return (
                <motion.li key={i.productId} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  onMouseEnter={() => setHover(idx)} onMouseLeave={() => setHover(null)}
                  className={cn("flex items-center gap-3 py-4 transition-colors sm:gap-4", hover === idx && "bg-deep/[0.03]")}>
                  <button type="button" onClick={() => toggle(i.productId)} aria-pressed={on} aria-label={`${on ? "Remove" : "Include"} ${i.product.name}`} className={cn("flex h-6 w-6 shrink-0 items-center justify-center border transition-colors", on ? "border-deep bg-deep text-[#C6A46A]" : "border-deep/30")}>
                    {on && <Check size={13} />}
                  </button>
                  <span className="hidden w-5 font-display text-lg text-bronze sm:inline">{idx + 1}</span>
                  <Link href={`/product/${i.product.slug}`} className="relative h-16 w-14 shrink-0 overflow-hidden bg-[#E2DBCE]">
                    <SmartImage src={i.product.images[0]} alt="" fill sizes="56px" className="object-cover" fallbackLabel=" " />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wide2 text-bronze">{getCategory(i.product.category)?.name}</p>
                    <Link href={`/product/${i.product.slug}`} className="block truncate text-[15px] font-medium hover:text-bronze">{i.product.name}</Link>
                    <p className="text-xs text-deep/50">{[i.color, i.size && `Size ${i.size}`].filter(Boolean).join(" · ")}</p>
                  </div>
                  <span className={cn("text-[15px] font-semibold tabular-nums", !on && "text-deep/35 line-through")}>{formatBDT(i.product.price)}</span>
                </motion.li>
              );
            })}
          </ul>

          <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-wide2 text-deep/50">Look total · {chosen.length} pieces</p>
              <p className="font-display text-5xl">{formatBDT(total)}</p>
            </div>
            <button
              type="button"
              disabled={chosen.length === 0}
              onClick={() => addMany(chosen.map(({ productId, size, color }) => ({ productId, size, color })))}
              className="btn-dark group gap-3 px-9 py-5"
            >
              <ShoppingBag size={16} /> Shop the Look
            </button>
          </div>
          <p className="mt-4 text-xs text-deep/45">Pre-selected sizes: shirt M, trouser 32, belt 34 — adjust them in your cart.</p>
        </div>
      </div>
    </section>
  );
}

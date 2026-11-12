"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Search, X } from "lucide-react";
import { useShop } from "@/lib/store";
import { products, categories } from "@/data/products";
import SmartImage from "@/components/ui/SmartImage";
import Price from "@/components/ui/Price";

export function searchProducts(q: string) {
  const t = q.trim().toLowerCase();
  if (!t) return [];
  return products.filter((p) => {
    const cat = categories.find((c) => c.id === p.category)?.name ?? "";
    return [p.name, p.short, cat, ...p.colors.map((c) => c.name)].join(" ").toLowerCase().includes(t);
  });
}

export default function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useShop();
  const [q, setQ] = useState("");
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const results = useMemo(() => searchProducts(q).slice(0, 6), [q]);

  useEffect(() => {
    if (searchOpen) setTimeout(() => input.current?.focus(), 80);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setSearchOpen(true); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen, setSearchOpen]);

  const close = () => setSearchOpen(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    close();
    router.push(`/shop?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div role="dialog" aria-modal="true" aria-label="Search products" className="fixed inset-0 z-[80] bg-ink/95 backdrop-blur-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="container-site pt-8">
            <div className="flex justify-end">
              <button onClick={close} aria-label="Close search" className="p-2 text-white/70 hover:text-gold"><X size={24} /></button>
            </div>
            <motion.form onSubmit={submit} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="mx-auto mt-10 max-w-3xl">
              <label htmlFor="site-search" className="eyebrow">Search GENTORA</label>
              <div className="mt-4 flex items-center gap-4 border-b border-white/25 pb-4 focus-within:border-gold">
                <Search className="text-gold" size={26} strokeWidth={1.25} />
                <input ref={input} id="site-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Shirts, watches, navy…" className="w-full bg-transparent font-display text-3xl font-light placeholder:text-white/25 focus:outline-none sm:text-5xl" autoComplete="off" />
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {["White shirt", "Trouser", "Watch", "Leather", "Navy"].map((s) => (
                  <button key={s} type="button" className="chip" onClick={() => setQ(s)}>{s}</button>
                ))}
              </div>
              <div className="mt-10" data-lenis-prevent>
                {q && results.length === 0 && <p className="text-muted">No products match “{q}”. Try “shirt” or “watch”.</p>}
                <ul className="grid gap-3 sm:grid-cols-2">
                  {results.map((p) => (
                    <li key={p.id}>
                      <Link href={`/product/${p.slug}`} onClick={close} className="group flex items-center gap-4 border border-line p-3 transition-colors hover:border-gold/60">
                        <span className="relative h-16 w-14 shrink-0 overflow-hidden bg-surface">
                          <SmartImage src={p.images[0]} alt="" fill sizes="56px" className="object-cover" fallbackLabel=" " />
                        </span>
                        <span className="flex-1">
                          <span className="block text-sm group-hover:text-gold">{p.name}</span>
                          <Price price={p.price} compareAt={p.compareAt} size="sm" className="text-muted" />
                        </span>
                        <ArrowRight size={16} className="text-white/30 transition-transform group-hover:translate-x-1 group-hover:text-gold" />
                      </Link>
                    </li>
                  ))}
                </ul>
                {results.length > 0 && <button type="submit" className="btn-ghost mt-6">See all results</button>}
              </div>
            </motion.form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

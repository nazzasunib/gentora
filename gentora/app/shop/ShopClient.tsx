"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import ProductCard from "@/components/products/ProductCard";
import { categories, products } from "@/data/products";
import { searchProducts } from "@/components/layout/SearchOverlay";
import { cn } from "@/lib/utils";

const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "new", label: "Newest" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
];
const FILTERS = [
  { id: "", label: "All" },
  { id: "new", label: "New Arrivals" },
  { id: "best", label: "Best Sellers" },
  { id: "sale", label: "On Sale" },
];

export default function ShopClient() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const category = params.get("category") ?? "";
  const group = params.get("group") ?? "";
  const filter = params.get("filter") ?? "";
  const sort = params.get("sort") ?? "featured";
  const q = params.get("q") ?? "";

  const set = (patch: Record<string, string>) => {
    const next = new URLSearchParams(params.toString());
    Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    router.replace(`${pathname}${next.toString() ? `?${next}` : ""}`, { scroll: false });
  };

  const list = useMemo(() => {
    let l = q ? searchProducts(q) : [...products];
    if (category) l = l.filter((p) => p.category === category);
    if (group === "accessories") l = l.filter((p) => ["belts", "watches", "bags"].includes(p.category));
    if (filter === "new") l = l.filter((p) => p.isNew);
    if (filter === "best") l = l.filter((p) => p.isBestSeller);
    if (filter === "sale") l = l.filter((p) => !!p.compareAt);
    if (sort === "price-asc") l.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") l.sort((a, b) => b.price - a.price);
    if (sort === "new") l.sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew));
    return l;
  }, [q, category, group, filter, sort]);

  const cat = categories.find((c) => c.id === category);
  const title = cat ? cat.name : group === "accessories" ? "Accessories" : filter === "sale" ? "Offers" : filter === "new" ? "New Arrivals" : "The Collection";
  const intro = cat?.description ?? (group === "accessories" ? "Belts, watches and office bags — the details that finish the look." : "Premium essentials designed for the modern gentleman.");

  return (
    <>
      <PageHeader eyebrow="Shop" title={title} intro={intro} crumbs={[{ label: "Shop", href: cat || group ? "/shop" : undefined }, ...(cat || group ? [{ label: title }] : [])]} />
      <section className="bg-ink pb-32">
        <div className="sticky top-[72px] z-30 border-b border-line bg-ink/90 backdrop-blur-xl">
          <div className="container-site flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0" role="group" aria-label="Category">
              <button onClick={() => set({ category: "", group: "" })} className={cn("chip shrink-0", !category && !group && "chip-active")}>All</button>
              {categories.map((c) => (
                <button key={c.id} onClick={() => set({ category: c.id, group: "" })} aria-pressed={category === c.id} className={cn("chip shrink-0", category === c.id && "chip-active")}>{c.short}</button>
              ))}
              <button onClick={() => set({ category: "", group: "accessories" })} aria-pressed={group === "accessories"} className={cn("chip shrink-0", group === "accessories" && "chip-active")}>Accessories</button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <label className="relative flex-1 lg:w-56 lg:flex-none">
                <span className="sr-only">Search products</span>
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input value={q} onChange={(e) => set({ q: e.target.value })} placeholder="Search…" className="input h-10 py-0 pl-9 text-[13px]" />
                {q && <button onClick={() => set({ q: "" })} aria-label="Clear search" className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-white/50 hover:text-gold"><X size={14} /></button>}
              </label>
              <label className="flex items-center gap-2 text-[11px] uppercase tracking-wide2 text-muted">
                <SlidersHorizontal size={14} />
                <span className="sr-only">Sort by</span>
                <select value={sort} onChange={(e) => set({ sort: e.target.value === "featured" ? "" : e.target.value })} className="h-10 border border-white/15 bg-ink px-3 text-[12px] normal-case tracking-normal text-white focus:border-gold focus:outline-none">
                  {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </label>
            </div>
          </div>
        </div>

        <div className="container-site pt-8">
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Collection filter">
              {FILTERS.map((f) => (
                <button key={f.id} onClick={() => set({ filter: f.id })} aria-pressed={filter === f.id} className={cn("text-[11px] font-semibold uppercase tracking-wide2 transition-colors", filter === f.id ? "text-gold" : "text-white/50 hover:text-white")}>
                  {f.label}{f.id !== FILTERS[FILTERS.length - 1].id && <span className="ml-2 text-white/20">/</span>}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted" aria-live="polite">{list.length} {list.length === 1 ? "piece" : "pieces"}{q && <> for “{q}”</>}</p>
          </div>

          {list.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-24 text-center">
              <p className="font-display text-3xl">Nothing matches — yet.</p>
              <p className="text-sm text-muted">Try another search or clear your filters.</p>
              <button onClick={() => router.replace("/shop")} className="btn-ghost mt-2">Clear filters</button>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
              <AnimatePresence mode="popLayout">
                {list.map((p, i) => (
                  <motion.div key={p.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
                    <ProductCard product={p} index={i} priority={i < 4} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}

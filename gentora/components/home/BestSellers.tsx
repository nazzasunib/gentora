"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ProductCard from "@/components/products/ProductCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { bestSellers } from "@/data/products";
import { cn } from "@/lib/utils";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "shirts", label: "Shirts" },
  { id: "pants", label: "Pants" },
  { id: "accessories", label: "Accessories" },
];

export default function BestSellers() {
  const [f, setF] = useState("all");
  const list = bestSellers.filter((p) => f === "all" || (f === "accessories" ? ["belts", "watches", "bags"].includes(p.category) : p.category === f));

  return (
    <section className="border-t border-line bg-ink py-28 lg:py-36" aria-label="Best sellers">
      <div className="container-site">
        <SectionHeading eyebrow="Best Sellers" title="The pieces they come back for" action={<Link href="/shop?filter=best" className="btn-ghost">View all</Link>} />
        <div className="no-scrollbar -mt-4 mb-10 flex gap-2 overflow-x-auto" role="tablist" aria-label="Filter best sellers">
          {FILTERS.map((x) => (
            <button key={x.id} role="tab" aria-selected={f === x.id} onClick={() => setF(x.id)} className={cn("chip shrink-0", f === x.id && "chip-active")}>{x.label}</button>
          ))}
        </div>
        <motion.div layout className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 lg:gap-x-6">
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => (
              <motion.div key={p.id} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.45 }}>
                <ProductCard product={p} index={i} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

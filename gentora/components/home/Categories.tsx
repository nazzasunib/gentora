"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import SmartImage from "@/components/ui/SmartImage";
import SectionHeading from "@/components/ui/SectionHeading";
import { categories } from "@/data/products";
import { cn } from "@/lib/utils";

const layout = [
  "sm:col-span-2 lg:col-span-7 aspect-[4/5] sm:aspect-[16/10] lg:aspect-auto lg:h-[560px]",
  "lg:col-span-5 aspect-[4/5] lg:aspect-auto lg:h-[560px]",
  "lg:col-span-4 aspect-[4/5] lg:aspect-auto lg:h-[440px]",
  "lg:col-span-4 aspect-[4/5] lg:aspect-auto lg:h-[440px]",
  "sm:col-span-2 lg:col-span-4 aspect-[4/5] sm:aspect-[16/9] lg:aspect-auto lg:h-[440px]",
];

export default function Categories() {
  return (
    <section className="bg-ink pb-28 lg:pb-40" aria-labelledby="cat-title">
      <div className="container-site">
        <SectionHeading eyebrow="Shop by Category" title="Five essentials. One standard." intro="Everything a professional wardrobe needs, edited down to what matters." action={<Link href="/shop" className="btn-ghost">View all</Link>} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-12">
          {categories.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.9, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className={cn("relative", layout[i])}
            >
              <Link href={`/shop?category=${c.id}`} className="dark-zone group absolute inset-0 overflow-hidden bg-surface" aria-label={`${c.name} — explore collection`}>
                <SmartImage src={c.image} alt={c.name} fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover transition-transform duration-[1.6s] ease-luxe group-hover:scale-[1.07]" fallbackLabel={c.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent transition-opacity duration-700 group-hover:opacity-90" />
                <div className="absolute inset-0 border border-gold/0 transition-colors duration-700 group-hover:border-gold/40" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 lg:p-8">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-luxe text-gold">0{i + 1}</p>
                    <h3 className="mt-2 font-display text-3xl font-light lg:text-4xl">{c.name}</h3>
                    <p className="mt-2 max-w-xs text-sm text-white/70 transition-all duration-700 lg:max-h-0 lg:opacity-0 lg:group-hover:max-h-24 lg:group-hover:opacity-100">{c.description}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide2 text-white">
                      Explore Collection
                      <span className="h-px w-6 bg-gold transition-all duration-500 group-hover:w-12" />
                    </span>
                  </div>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/30 transition-all duration-500 group-hover:rotate-45 group-hover:border-gold group-hover:bg-gold group-hover:text-on-gold">
                    <ArrowUpRight size={18} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

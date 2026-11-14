"use client";

import { motion } from "framer-motion";
import { Gem, Infinity as InfinityIcon, Feather } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

const VALUES = [
  { Icon: Gem, title: "Premium Quality", text: "Carefully selected products with quality materials and refined finishing." },
  { Icon: InfinityIcon, title: "Timeless Style", text: "Classic designs that work across professional settings." },
  { Icon: Feather, title: "Everyday Comfort", text: "Designed to keep you comfortable throughout your working day." },
];

export default function BrandValues() {
  return (
    <section className="relative overflow-hidden bg-surface py-28 lg:py-40" aria-label="Brand values">
      <div aria-hidden className="absolute -right-40 top-10 h-[480px] w-[480px] rounded-full border border-gold/10" />
      <div aria-hidden className="absolute -right-20 top-32 h-[320px] w-[320px] rounded-full border border-gold/10" />
      <div className="container-site relative">
        <SectionHeading align="center" eyebrow="Our Standard" title="CONFIDENCE IS IN THE DETAILS." />
        <div className="grid gap-px bg-line md:grid-cols-3">
          {VALUES.map(({ Icon, title, text }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.9, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="group relative bg-surface p-10 lg:p-14"
            >
              <span className="absolute left-0 top-0 h-px w-0 bg-gold transition-all duration-700 group-hover:w-full" />
              <p className="font-display text-sm italic text-white/30">0{i + 1}</p>
              <div className="mt-8 flex h-16 w-16 items-center justify-center rounded-full border border-gold/40 text-gold transition-all duration-700 group-hover:bg-gold group-hover:text-on-gold">
                <Icon size={24} strokeWidth={1.25} />
              </div>
              <h3 className="mt-8 font-display text-3xl">{title}</h3>
              <p className="mt-4 text-[15px] leading-relaxed text-muted">{text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

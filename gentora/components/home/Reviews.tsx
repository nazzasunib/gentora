"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import Stars from "@/components/ui/Stars";
import { demoReviews } from "@/data/products";
import { cn } from "@/lib/utils";

export default function Reviews() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = demoReviews.length;
  const go = (d: number) => setI((x) => (x + d + n) % n);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((x) => (x + 1) % n), 6500);
    return () => clearInterval(t);
  }, [paused, n]);

  const r = demoReviews[i];
  return (
    <section className="bg-ink py-28 lg:py-36" aria-roledescription="carousel" aria-label="Customer reviews (demo)" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <div className="container-site">
        <div className="mx-auto max-w-4xl text-center">
          <p className="eyebrow">Words from the Gentlemen</p>
          <p className="mt-3 inline-block border border-white/15 px-3 py-1 text-[10px] uppercase tracking-wide2 text-muted">Demo reviews · fictional, for illustration only</p>
          <Quote size={40} strokeWidth={1} className="mx-auto mt-10 text-gold" aria-hidden />
          <div className="relative mt-6 min-h-[260px] sm:min-h-[220px]" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.figure key={i} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
                <blockquote className="font-display text-2xl font-light leading-snug sm:text-4xl">“{r.text}”</blockquote>
                <figcaption className="mt-8 flex flex-col items-center gap-2">
                  <Stars value={r.rating} />
                  <span className="text-sm font-semibold">{r.name} <span className="font-normal text-muted">— {r.role}</span></span>
                  <span className="text-[11px] uppercase tracking-wide2 text-gold">Purchased: {r.product}</span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>
          <div className="mt-10 flex items-center justify-center gap-6">
            <button onClick={() => go(-1)} aria-label="Previous review" className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 hover:border-gold hover:text-gold"><ChevronLeft size={18} /></button>
            <div className="flex gap-2">
              {demoReviews.map((_, k) => (
                <button key={k} onClick={() => setI(k)} aria-label={`Show review ${k + 1}`} aria-current={k === i} className={cn("h-[3px] transition-all duration-500", k === i ? "w-10 bg-gold" : "w-5 bg-white/25 hover:bg-white/50")} />
              ))}
            </div>
            <button onClick={() => go(1)} aria-label="Next review" className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 hover:border-gold hover:text-gold"><ChevronRight size={18} /></button>
          </div>
        </div>
      </div>
    </section>
  );
}

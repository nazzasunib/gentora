"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import SmartImage from "@/components/ui/SmartImage";
import Reveal, { RevealText } from "@/components/ui/Reveal";
import { IMG } from "@/data/images";

export default function BrandIntro() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yBig = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const ySmall = useTransform(scrollYProgress, [0, 1], ["20%", "-25%"]);

  return (
    <section id="intro" ref={ref} className="relative overflow-hidden bg-ink py-28 lg:py-40">
      <div className="container-site grid items-center gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="relative lg:col-span-6">
          <div className="relative aspect-[4/5] w-[85%] overflow-hidden">
            <motion.div style={{ y: yBig }} className="absolute inset-[-10%]">
              <SmartImage src={IMG.intro} alt="Tailor adjusting the jacket of a well-dressed man" fill sizes="(max-width:1024px) 85vw, 45vw" className="object-cover" fallbackLabel="The Art of Dressing Well" />
            </motion.div>
          </div>
          <motion.div style={{ y: ySmall }} className="absolute -bottom-10 right-0 aspect-[3/4] w-[44%] overflow-hidden border-[10px] border-ink shadow-2xl">
            <SmartImage src={IMG.studio.watchSteel} alt="Heritage Steel Watch in studio light" fill sizes="25vw" className="object-cover" />
          </motion.div>
          <div className="absolute -left-2 top-10 hidden origin-left -rotate-90 text-[10px] uppercase tracking-luxe text-white/40 lg:block" style={{ transform: "translateY(260px) rotate(-90deg)" }}>
            Est. 2026 — Dhaka
          </div>
        </div>

        <div className="lg:col-span-5 lg:col-start-8">
          <Reveal y={12}><p className="eyebrow mb-6">The GENTORA Philosophy</p></Reveal>
          <h2 className="h-display text-5xl sm:text-6xl lg:text-7xl">
            <RevealText text="THE ART OF" /> <br />
            <RevealText text="DRESSING WELL" className="italic text-gold" delay={0.15} />
          </h2>
          <Reveal delay={0.2}>
            <p className="mt-8 text-[17px] leading-[1.8] text-white/70">
              GENTORA brings together timeless style and modern sophistication. From perfectly tailored shirts to refined accessories, every detail is selected for the modern professional.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-line pt-8">
              {[["05", "Essential categories"], ["17", "Curated pieces"], ["৳5k+", "Free delivery"]].map(([n, l]) => (
                <div key={l}>
                  <dt className="sr-only">{l}</dt>
                  <dd className="font-display text-4xl text-gold">{n}</dd>
                  <dd className="mt-2 text-[11px] uppercase tracking-wide2 text-muted">{l}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <Reveal delay={0.4}>
            <Link href="/about" className="link-underline mt-12 inline-block text-[12px] font-semibold uppercase tracking-wide2 text-gold">Our Story</Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

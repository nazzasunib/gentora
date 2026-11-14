"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import SmartImage from "@/components/ui/SmartImage";
import Reveal, { RevealText } from "@/components/ui/Reveal";
import { IMG } from "@/data/images";

export default function Offers() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1.15, 1]);

  return (
    <section ref={ref} className="dark-zone grain relative flex min-h-[80vh] items-center overflow-hidden bg-ink py-28" aria-label="Special collection">
      <motion.div style={{ y, scale }} className="absolute inset-[-12%_0]">
        <SmartImage src={IMG.offers} fallbackSrc={IMG.meeting} alt="Sharply dressed man in a modern city setting" fill sizes="100vw" className="object-cover" fallbackLabel="Upgrade your professional style" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/20" />
      <div className="container-site relative z-10">
        <div className="max-w-2xl">
          <Reveal y={12}><p className="eyebrow mb-6 flex items-center gap-3"><span className="h-px w-8 bg-gold" /> Special Collection · Up to 15% off</p></Reveal>
          <h2 className="h-display text-5xl sm:text-6xl lg:text-8xl">
            <RevealText text="UPGRADE YOUR" /><br /><RevealText text="PROFESSIONAL STYLE" className="italic text-gold" delay={0.2} />
          </h2>
          <Reveal delay={0.3}><p className="mt-8 max-w-md text-lg text-white/75">Discover selected essentials for a sharper everyday look.</p></Reveal>
          <Reveal delay={0.4}>
            <Link href="/shop?filter=sale" className="btn-gold group mt-10">Explore Offers <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" /></Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

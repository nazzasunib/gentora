"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import SmartImage from "@/components/ui/SmartImage";
import { IMG } from "@/data/images";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(media.current, { scale: 1.18 }, { scale: 1.04, duration: 2.6, ease: "power3.out" });
      gsap.to(media.current, { yPercent: 18, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } });
      gsap.to(content.current, { yPercent: -30, opacity: 0, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "70% top", scrub: true } });
    }, root);

    // interactive background: gold light follows the cursor, image drifts subtly
    const el = root.current!;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      gsap.to(glow.current, { x: e.clientX - r.left, y: e.clientY - r.top, duration: 1.2, ease: "power3.out" });
      gsap.to(media.current, { x: (x - 0.5) * -24, rotate: (x - 0.5) * 0.6, duration: 1.6, ease: "power3.out" });
      void y;
    };
    el.addEventListener("pointermove", onMove);
    return () => { ctx.revert(); el.removeEventListener("pointermove", onMove); };
  }, [reduce]);

  const line = (text: string, delay: number, className = "") => (
    <span className="block overflow-hidden pb-[0.06em]">
      <motion.span className={`block ${className}`} initial={reduce ? false : { y: "105%" }} animate={{ y: 0 }} transition={{ duration: 1.3, delay, ease }}>
        {text}
      </motion.span>
    </span>
  );

  return (
    <section ref={root} className="dark-zone grain relative flex h-[100svh] min-h-[640px] items-end overflow-hidden bg-ink" aria-label="Introduction">
      <div ref={media} className="absolute inset-0 will-change-transform">
        <SmartImage src={IMG.hero} fallbackSrc={IMG.heroAlt} alt="A man in a tailored dark suit, framed in low cinematic light" fill priority sizes="100vw" className="object-cover object-[60%_30%]" fallbackLabel=" " />
      </div>
      {/* cinematic grade */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-black/40" />
      <div ref={glow} aria-hidden className="pointer-events-none absolute left-0 top-0 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 mix-blend-soft-light" style={{ background: "radial-gradient(circle, rgba(198,164,106,0.55), transparent 65%)", transform: "translate(70vw, 40vh)" }} />

      <div ref={content} className="container-site relative z-10 pb-24 sm:pb-28 lg:pb-32">
        <motion.p className="eyebrow mb-8 flex items-center gap-4" initial={reduce ? false : { opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.5, ease }}>
          <span className="h-px w-10 bg-gold" /> Autumn / Winter 2026 Collection
        </motion.p>
        <h1 className="h-display max-w-5xl text-[13vw] sm:text-[9vw] lg:text-[7.4vw] xl:text-[112px]">
          {line("DRESS SHARP.", 0.6)}
          {line("LEAD WITH", 0.75, "text-white/90")}
          {line("CONFIDENCE.", 0.9, "italic text-gold")}
        </h1>
        <motion.div initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, delay: 1.25, ease }} className="mt-8 flex max-w-xl flex-col gap-9">
          <p className="text-base leading-relaxed text-white/75 sm:text-lg">Discover premium essentials designed for the modern gentleman.</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/shop" className="btn-gold group">
              Explore Collection <ArrowRight size={15} className="transition-transform duration-500 group-hover:translate-x-1" />
            </Link>
            <Link href="/shop?filter=new" className="btn-ghost">Shop Now</Link>
          </div>
        </motion.div>
      </div>

      {/* side meta */}
      <motion.div className="absolute bottom-28 right-6 z-10 hidden flex-col items-end gap-2 text-right text-[11px] uppercase tracking-wide2 text-white/60 lg:flex lg:right-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6, duration: 1 }}>
        <span className="text-gold">01 — 05</span>
        <span>Shirts · Trousers · Belts</span>
        <span>Watches · Office Bags</span>
      </motion.div>

      {/* scroll indicator */}
      <a href="#intro" className="absolute bottom-8 left-1/2 z-10 hidden sm:flex -translate-x-1/2 flex-col items-center gap-3 text-[10px] uppercase tracking-luxe text-white/60 hover:text-gold" aria-label="Scroll to next section">
        Scroll
        <span className="relative flex h-10 w-6 justify-center rounded-full border border-white/30 pt-2">
          <span className="h-2 w-[2px] animate-scrollDot rounded bg-gold" />
        </span>
      </a>
    </section>
  );
}

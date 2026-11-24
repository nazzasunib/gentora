"use client";

/**
 * Vesture’s hero — "The Anatomy of a Look".
 * A pinned scroll story: the bare tailoring form is measured, then dressed layer by layer
 * (shirt → waistcoat & tie → jacket). Imagery lives in /public/images/hero/story.
 */
import Link from "next/link";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/useReducedMotion";
import Reveal from "@/components/ui/Reveal";
import SmartImage from "@/components/ui/SmartImage";
import Price from "@/components/ui/Price";
import { STORY, MEASURES, INTRO, EXTS, locate } from "@/components/home/hero/story";
import { getProduct } from "@/data/products";
import { cn } from "@/lib/utils";

const TailorCanvas = dynamic(() => import("@/components/home/hero/TailorCanvas"), { ssr: false });
const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const reduced = usePrefersReducedMotion();
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const intro = useRef<HTMLDivElement>(null);
  const stageEl = useRef<HTMLDivElement>(null);
  const hoursEl = useRef<HTMLSpanElement>(null);
  const measures = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const [stage, setStage] = useState(0);
  const [ready, setReady] = useState(false);
  const [inView, setInView] = useState(true);
  const [box, setBox] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [missing, setMissing] = useState(false);
  const animated = !reduced && !missing;
  const onError = useCallback(() => setMissing(true), []);

  const onReady = useCallback(() => setReady(true), []);
  const onBox = useCallback((b: typeof box) => setBox(b), []);

  useEffect(() => {
    if (!animated || !track.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const st = { p: 0 };
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: track.current, start: "top top", end: "bottom bottom", scrub: 0.6, invalidateOnRefresh: true },
      });
      tl.to(st, {
        p: 1, duration: 1,
        onUpdate: () => {
          const p = st.p;
          progress.current = p;
          const { i, t } = locate(p);
          const s = p < INTRO * 0.9 ? -1 : i;
          setStage((c) => (c === s ? c : s));
          // hand-hours counter
          const from = STORY[i].hours, to = STORY[Math.min(STORY.length - 1, i + 1)].hours;
          const h = i === STORY.length - 1 ? 70 * Math.min(1, t * 1.4) + from * (1 - Math.min(1, t * 1.4)) : from + (to - from) * t;
          if (hoursEl.current) hoursEl.current.textContent = String(Math.round(h)).padStart(2, "0");
          // measurement lines: draw in during the measure stage, fade as the shirt arrives
          const m = measures.current;
          if (m) {
            const draw = Math.min(1, Math.max(0, (p - INTRO * 0.6) / (INTRO * 0.9)));
            const out = i >= 1 ? Math.min(1, t / 0.25 + (i > 1 ? 1 : 0)) : 0;
            m.style.opacity = String(Math.max(0, (p > INTRO * 0.5 ? 1 : 0) - out));
            m.querySelectorAll<SVGLineElement>("line").forEach((l) => { l.style.strokeDashoffset = String(100 - draw * 100); });
            m.querySelectorAll<SVGElement>("[data-label]").forEach((e) => { e.style.opacity = String(Math.min(1, Math.max(0, draw * 1.6 - 0.6))); });
          }
        },
      }, 0);
      tl.to(intro.current, { autoAlpha: 0, y: -50, duration: INTRO * 0.6 }, INTRO * 0.15);
      tl.fromTo(stageEl.current, { autoAlpha: 0, scale: 1.04 }, { autoAlpha: 1, scale: 1, duration: INTRO * 0.6 }, INTRO * 0.3);
    }, root);
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "200px" });
    io.observe(track.current);
    const refresh = setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => { ctx.revert(); io.disconnect(); clearTimeout(refresh); };
  }, [animated]);

  const jumpTo = (i: number) => {
    const t = track.current;
    if (!t) return;
    const top = t.getBoundingClientRect().top + window.scrollY;
    const span = t.offsetHeight - window.innerHeight;
    const s = (1 - INTRO - 0.06) / STORY.length;
    const y = top + span * (INTRO + s * (i + 0.7));
    const l = (window as unknown as { __lenis?: { scrollTo: (y: number, o?: object) => void } }).__lenis;
    if (l) l.scrollTo(y, { duration: 1.6 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  const cur = stage >= 0 ? STORY[stage] : null;
  const last = STORY[STORY.length - 1];

  return (
    <section ref={root} className="dark-zone relative bg-[#0a0806]" aria-label="Vesture’s — the anatomy of a look">
      <div ref={track} className={cn("relative", animated ? "h-[520vh] md:h-[600vh]" : "")}>
        <div className={cn("relative overflow-hidden", animated ? "sticky top-0 h-[100svh]" : "min-h-[100svh]")}>
          {/* warm atelier light */}
          <div aria-hidden className="absolute inset-0" style={{ background: "radial-gradient(55% 75% at 50% 0%, rgba(150,98,30,0.55) 0%, rgba(70,44,14,0.35) 38%, rgba(10,8,6,0) 75%), #0a0806" }} />
          <Dust />

          {/* intro */}
          <div ref={intro} className="absolute inset-0 z-20 flex items-center justify-center px-6 text-center">
            <div className={cn(!animated && "hidden")}>
              <motion.p className="eyebrow" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3, ease }}>Vesture’s · Tailored for the modern gentleman</motion.p>
              <h1 className="h-display mt-7 text-[13vw] sm:text-[9vw] lg:text-[6.6vw] xl:text-[104px]">
                <span className="block overflow-hidden pb-[0.08em]"><motion.span className="block" initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: 1.2, delay: 0.45, ease }}>The Anatomy of a <em className="text-gold">Look</em></motion.span></span>
              </h1>
              <motion.p className="mx-auto mt-6 max-w-md text-[15px] leading-relaxed text-white/70 sm:text-base" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1 }}>
                Four layers, one man. Scroll to watch the look come together.
              </motion.p>
              <motion.div className="mt-14 flex flex-col items-center gap-3 text-[10px] uppercase tracking-luxe text-white/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>
                Scroll
                <span className="relative flex h-10 w-6 justify-center rounded-full border border-white/30 pt-2"><span className="h-2 w-[2px] animate-scrollDot rounded bg-gold" /></span>
              </motion.div>
            </div>
          </div>

          {/* the form being dressed */}
          {animated ? (
            <div ref={stageEl} className="invisible absolute inset-0 z-10 opacity-0">
              <TailorCanvas progress={progress} active={inView} onReady={onReady} onBox={onBox} onError={onError} />
              <div ref={measures} aria-hidden className="pointer-events-none absolute opacity-0" style={{ left: box.x, top: box.y, width: box.w, height: box.h }}>
                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {MEASURES.map((m) => (
                    <line key={m.label} x1={m.x1} y1={m.y1} x2={m.x2} y2={m.y2} pathLength={100} stroke="rgba(245,236,220,0.85)" strokeWidth={0.22} strokeDasharray="100 100" strokeDashoffset="100" />
                  ))}
                </svg>
                {MEASURES.map((m) => (
                  <span key={m.label} data-label className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-[9px] font-semibold tracking-[0.12em] text-[#F4EBDC] opacity-0 [text-shadow:0_1px_6px_rgba(0,0,0,0.9)] sm:text-[11px]" style={{ left: `${m.lx}%`, top: `${m.ly}%` }}>
                    {m.label}
                  </span>
                ))}
              </div>
              <AnimatePresence>
                {!ready && (
                  <motion.div className="absolute inset-0 flex items-center justify-center" exit={{ opacity: 0 }} aria-hidden>
                    <span className="h-px w-24 animate-shimmer bg-[linear-gradient(90deg,transparent,#C6A46A,transparent)] bg-[length:200%_100%]" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : missing ? null : (
            <div className="absolute inset-0 flex items-center justify-center pt-20">
              <div className="relative aspect-[4/5] h-[78svh]">
                <Still base={last.src} />
              </div>
            </div>
          )}

          {animated && (
            <>
              {/* hand-hours counter */}
              <div className={cn("absolute right-6 top-24 z-20 text-right transition-opacity duration-700 lg:right-12 lg:top-28", stage >= 0 ? "opacity-100" : "opacity-0")} aria-hidden>
                <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/50">Hand hours</p>
                <p className="mt-1 font-display text-4xl font-light text-white lg:text-5xl"><span ref={hoursEl}>00</span><span className="text-lg text-gold">h</span></p>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.3em] text-white/50">Fitting {cur?.fitting ?? 1}/3</p>
              </div>

              {/* chapter rail */}
              <nav aria-label="Chapters" className={cn("absolute left-6 top-1/2 z-20 hidden -translate-y-1/2 transition-opacity duration-700 lg:left-12 lg:block", stage >= 0 ? "opacity-100" : "opacity-0")}>
                <ol className="space-y-4">
                  {STORY.map((s, i) => (
                    <li key={s.n}>
                      <button type="button" onClick={() => jumpTo(i)} aria-current={i === stage ? "step" : undefined}
                        className={cn("flex items-center gap-3 font-mono text-[10px] tracking-[0.2em] transition-colors duration-500", i === stage ? "text-gold" : i < stage ? "text-white/60 hover:text-gold" : "text-white/25 hover:text-white/60")}>
                        <span className={cn("h-px transition-all duration-500", i === stage ? "w-8 bg-gold" : "w-4 bg-current")} />{s.n}
                        <span className="sr-only">{s.label}</span>
                      </button>
                    </li>
                  ))}
                </ol>
              </nav>

              {/* chapter copy */}
              <div className="pointer-events-none absolute inset-0 z-20" aria-live="polite">
                <AnimatePresence mode="wait">
                  {cur && (
                    <motion.div key={stage} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.6, ease }}
                      className={cn("absolute inset-x-6 bottom-10 max-w-sm sm:inset-x-auto lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2",
                        cur.side === "right" ? "sm:right-10 lg:right-[7%] xl:right-[9%]" : "sm:left-10 lg:left-[9%] xl:left-[11%]")}>
                      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold">{cur.n} — {cur.label}</p>
                      <h2 className="mt-4 font-display text-4xl font-light leading-[1.05] lg:text-5xl">{cur.title} <em className="text-gold">{cur.accent}</em></h2>
                      <p className="mt-4 text-sm leading-relaxed text-white/70 lg:text-[15px]">{cur.text}</p>
                      {stage === STORY.length - 1 && (
                        <Link href="/shop" className="btn-gold pointer-events-auto mt-7">Shop the collection <ArrowRight size={15} /></Link>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-[15] h-[38%] bg-gradient-to-t from-[#0a0806] via-[#0a0806]/70 to-transparent lg:hidden" />
            </>
          )}

          {!animated && (
            <div className="container-site relative z-20 flex min-h-[100svh] flex-col justify-center py-28">
              <h1 className="h-display max-w-xl text-5xl lg:text-7xl">The Anatomy of a <em className="text-gold">Look</em></h1>
              <p className="mt-6 max-w-md text-white/70">Measured by hand, then dressed layer by layer — shirt, waistcoat and tie, jacket.</p>
              <Link href="/shop" className="btn-gold mt-8">Shop the collection <ArrowRight size={15} /></Link>
            </div>
          )}
        </div>
      </div>

      <TheEdit />
    </section>
  );
}

/** the finished look as a still (reduced motion), trying each image extension */
function Still({ base }: { base: string }) {
  const [k, setK] = useState(0);
  if (k >= EXTS.length) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={base + EXTS[k]} onError={() => setK((v) => v + 1)} alt="The complete Vesture’s look: white shirt, silk tie, charcoal waistcoat and tailored jacket"
      className="absolute inset-0 h-full w-full object-contain [mask-image:radial-gradient(46%_58%_at_50%_50%,#000_72%,transparent_100%)]" />
  );
}

/** a few slow motes of dust in the light beam */
function Dust() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 18 }, (_, i) => (
        <span key={i} className="absolute h-[2px] w-[2px] rounded-full bg-[#E9CF9A] opacity-40 motion-safe:animate-[dust_14s_linear_infinite]"
          style={{ left: `${(i * 53) % 100}%`, top: `${(i * 37) % 100}%`, animationDelay: `${-i * 0.9}s`, animationDuration: `${12 + (i % 5) * 3}s` }} />
      ))}
      <style>{`@keyframes dust{0%{transform:translateY(0);opacity:0}15%{opacity:.45}100%{transform:translateY(-120px);opacity:0}}`}</style>
    </div>
  );
}

const EDIT = [
  { label: "Formal Shirt", slug: "signature-white-formal-shirt" },
  { label: "Formal Trouser", slug: "charcoal-wool-blend-trouser" },
  { label: "Leather Belt", slug: "premium-leather-belt" },
  { label: "Wristwatch", slug: "heritage-steel-watch" },
] as const;

/** Pieces to complete the look — real catalogue products. */
function TheEdit() {
  return (
    <div id="the-edit" className="relative border-t border-line bg-[#0a0806] py-24 lg:py-32">
      <div className="container-site">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Reveal>
            <p className="eyebrow">The Formal Edit</p>
            <h2 className="h-display mt-5 text-4xl sm:text-5xl lg:text-6xl">Complete the look.</h2>
          </Reveal>
          <Reveal delay={0.1}><p className="max-w-sm text-[15px] leading-relaxed text-muted">The essentials beneath every tailored silhouette — wear them on their own or together.</p></Reveal>
        </div>
        <ul className="no-scrollbar -mx-4 mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4 lg:gap-6">
          {EDIT.map((item, i) => {
            const product = getProduct(item.slug);
            if (!product) return null;
            return (
              <li key={item.slug} className="w-[75vw] shrink-0 snap-start sm:w-auto">
                <Reveal delay={i * 0.08} className="h-full">
                  <Link href={`/product/${product.slug}`} className="group block h-full" aria-label={`${item.label}: ${product.name}`}>
                    <div className="relative aspect-[4/5] overflow-hidden bg-surface">
                      <SmartImage src={product.images[0]} alt={product.name} fill sizes="(max-width: 640px) 75vw, (max-width: 1024px) 50vw, 25vw" className="object-cover transition-transform duration-[1.4s] ease-luxe group-hover:scale-[1.05]" fallbackLabel={product.name} />
                      <span className="absolute left-4 top-4 font-display text-sm italic text-gold">0{i + 1}</span>
                    </div>
                    <p className="eyebrow mt-5">{item.label}</p>
                    <h3 className="mt-2 font-display text-2xl font-light leading-tight">{product.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{product.short}</p>
                    <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-4">
                      <Price price={product.price} compareAt={product.compareAt} size="sm" />
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide2 text-gold">View <ArrowRight size={13} className="transition-transform duration-500 group-hover:translate-x-1" /></span>
                    </div>
                  </Link>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

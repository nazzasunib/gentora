"use client";

/**
 * Vesture’s hero — "The Transformation".
 * A pinned, scroll-controlled 3D scene: the figure is dressed from premium casual
 * to complete formal as the visitor scrolls, then the five pieces are presented.
 */
import Link from "next/link";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ArrowDown, Check } from "lucide-react";
import { useCanRender3D } from "@/hooks/useCanRender3D";
import { usePrefersReducedMotion } from "@/hooks/useReducedMotion";
import PhotoStage, { MODEL_PHOTOS } from "@/components/home/PhotoStage";
import ErrorBoundary from "@/components/3d/ErrorBoundary";
import Reveal from "@/components/ui/Reveal";
import Price from "@/components/ui/Price";
import { STAGES, stageAt } from "@/components/3d/hero/stages";
import type { HeroControl } from "@/components/3d/hero/HeroScene";
import { getProduct } from "@/data/products";
import { cn } from "@/lib/utils";

const HeroScene = dynamic(() => import("@/components/3d/hero/HeroScene"), { ssr: false });

const ease = [0.22, 1, 0.36, 1] as const;

const EDIT = [
  { label: "Formal Shirt", slug: "signature-white-formal-shirt", image: "/images/hero/shirt.jpg", desc: "Crisp white cotton poplin with a structured collar." },
  { label: "Formal Trouser", slug: "charcoal-wool-blend-trouser", image: "/images/hero/trouser.jpg", desc: "Charcoal wool blend, tailored to a clean break." },
  { label: "Leather Belt", slug: "premium-leather-belt", image: "/images/hero/belt.jpg", desc: "Full-grain leather with a brushed steel buckle." },
  { label: "Wristwatch", slug: "heritage-steel-watch", image: "/images/studio/watch-steel.jpg", desc: "Steel case, midnight dial, leather strap." },
  { label: "Formal Shoes", slug: null, name: "Cordovan Leather Oxford", image: "/images/hero/shoes.jpg", desc: "Hand-polished cordovan leather, sleek almond toe." },
] as const;

export default function Hero() {
  const can3D = useCanRender3D();
  const reducedMotion = usePrefersReducedMotion();
  const [failed, setFailed] = useState(false);
  // photographic mode switches on automatically once the model photos exist in /public/images/hero/model
  const [photos, setPhotos] = useState<boolean | null>(null);
  useEffect(() => {
    fetch(MODEL_PHOTOS[0].src, { method: "HEAD" }).then((r) => setPhotos(r.ok)).catch(() => setPhotos(false));
  }, []);
  const animated = photos === null ? false : photos ? !reducedMotion : can3D === "yes" && !failed;
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const intro = useRef<HTMLDivElement>(null);
  const captions = useRef<HTMLDivElement>(null);
  const hint = useRef<HTMLAnchorElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const mbar = useRef<HTMLSpanElement>(null);
  const ctrl = useRef<HeroControl>({ target: 0, px: 0 });
  const [stage, setStage] = useState(0);
  const [ready, setReady] = useState(false);
  const [inView, setInView] = useState(true);
  const [quality, setQuality] = useState<"high" | "low">("high");

  useEffect(() => {
    const cores = navigator.hardwareConcurrency ?? 8;
    setQuality(window.innerWidth < 768 || cores < 6 ? "low" : "high");
  }, []);

  // GSAP timeline scrubbed by the pinned scroll track
  useEffect(() => {
    if (!animated || !track.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const state = { p: 0 };
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: track.current, start: "top top", end: "bottom bottom", scrub: 0.8, invalidateOnRefresh: true },
      });
      tl.to(state, {
        p: 1,
        duration: 1,
        onUpdate: () => {
          const p = state.p;
          ctrl.current.target = p;
          const s = stageAt(p);
          setStage((cur) => (cur === s ? cur : s));
          if (bar.current) bar.current.style.transform = `scaleY(${p})`;
          if (mbar.current) mbar.current.style.transform = `scaleX(${p})`;
        },
      }, 0);
      tl.to(hint.current, { autoAlpha: 0, duration: 0.03 }, 0.005);
      tl.to(intro.current, { autoAlpha: 0, y: -48, duration: 0.06 }, 0.02);
      tl.fromTo(captions.current, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.05 }, 0.06);
    }, root);

    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "160px" });
    io.observe(track.current);
    const refresh = setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => { ctx.revert(); io.disconnect(); clearTimeout(refresh); };
  }, [animated]);

  // subtle pointer parallax (desktop only)
  useEffect(() => {
    if (!animated) return;
    const el = track.current;
    if (!el || window.matchMedia("(pointer: coarse)").matches) return;
    const onMove = (e: PointerEvent) => { ctrl.current.px = (e.clientX / window.innerWidth) * 2 - 1; };
    el.addEventListener("pointermove", onMove);
    return () => el.removeEventListener("pointermove", onMove);
  }, [animated]);

  const jumpTo = (i: number) => {
    const t = track.current;
    if (!t) return;
    const top = t.getBoundingClientRect().top + window.scrollY;
    const span = t.offsetHeight - window.innerHeight;
    const at = i === 0 ? 0 : i === STAGES.length - 1 ? 1 : STAGES[i].at + 0.1;
    const y = top + span * at;
    const l = (window as unknown as { __lenis?: { scrollTo: (y: number, o?: object) => void } }).__lenis;
    if (l) l.scrollTo(y, { duration: 1.6 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  const showStatic = photos === false && (can3D === "no" || failed);
  const showStaticPhoto = photos === true && reducedMotion;
  const current = STAGES[stage];

  return (
    <section ref={root} className="dark-zone relative bg-[#0b0b0b]" aria-label="The Vesture’s transformation — from casual to formal">
      <div ref={track} className={cn("relative", animated && "h-[480vh] md:h-[560vh]")}>
        <div className={cn("relative overflow-hidden", animated ? "sticky top-0 h-[100svh]" : "h-[100svh] min-h-[640px]")}>
          {/* studio backdrop */}
          <div aria-hidden className="absolute inset-0" style={{ background: "radial-gradient(60% 70% at 50% 42%, #26221d 0%, #151413 48%, #0b0b0b 100%)" }} />
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[55%] bg-gradient-to-t from-black/90 via-black/60 to-transparent lg:hidden" />

          {/* 3D stage */}
          <div className="absolute inset-0">
            {animated && photos && <PhotoStage ctrl={ctrl} active={inView} onReady={() => setReady(true)} />}
            {animated && !photos && (
              <ErrorBoundary fallback={<Failed onFail={() => setFailed(true)} />}>
                <HeroScene ctrl={ctrl} active={inView} quality={quality} onReady={() => setReady(true)} />
              </ErrorBoundary>
            )}
            {showStatic && <StaticLook />}
            {showStaticPhoto && <StaticLook src={MODEL_PHOTOS[4].src} />}
            <AnimatePresence>
              {animated && !ready && (
                <motion.div className="absolute inset-0 flex items-center justify-center" exit={{ opacity: 0 }} transition={{ duration: 0.8 }} aria-hidden>
                  <span className="h-px w-24 animate-shimmer bg-[linear-gradient(90deg,transparent,#C6A46A,transparent)] bg-[length:200%_100%]" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* intro copy (fades out as the transformation begins) */}
          <div className="pointer-events-none absolute inset-0 z-10">
            <div className="container-site flex h-full flex-col justify-end pb-24 pt-28 sm:pb-28 lg:justify-center lg:pb-0">
              <div ref={intro} className="pointer-events-auto max-w-md lg:max-w-[40rem]">
                <motion.p className="eyebrow mb-6 flex items-center gap-4" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.4, ease }}>
                  <span className="h-px w-10 bg-gold" /> AW 2026 · The Transformation
                </motion.p>
                <h1 className="h-display text-[12vw] sm:text-[8vw] lg:text-[5.2vw] xl:text-[80px]">
                  {([["DRESS SHARP.", ""], ["LEAD WITH", "text-white/90"], ["CONFIDENCE.", "italic text-gold"]] as const).map(([t, c], i) => (
                    <span key={t} className="block overflow-hidden pb-[0.06em]">
                      <motion.span className={cn("block", c)} initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: 1.2, delay: 0.5 + i * 0.13, ease }}>{t}</motion.span>
                    </span>
                  ))}
                </h1>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1.1, ease }}>
                  <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-white/70 sm:text-base">
                    {showStatic || showStaticPhoto ? "From weekend casual to boardroom formal — five pieces, one confident silhouette." : "Scroll to dress him — from weekend casual to boardroom formal, one piece at a time."}
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link href="/shop" className="btn-gold group">Explore Collection <ArrowRight size={15} className="transition-transform duration-500 group-hover:translate-x-1" /></Link>
                    <Link href="/shop?filter=new" className="btn-ghost hidden sm:inline-flex">Shop Now</Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {animated && (
            <>
              {/* stage captions */}
              <div ref={captions} className="invisible pointer-events-none absolute inset-0 z-10 opacity-0">
                <div className="container-site flex h-full flex-col justify-end pb-24 pt-28 lg:justify-center lg:pb-0">
                  <div className="max-w-[19rem] sm:max-w-sm" aria-live="polite">
                    <AnimatePresence mode="wait">
                      <motion.div key={stage} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.55, ease }}>
                        <p className="eyebrow flex items-center gap-3"><span className="font-display text-base italic tracking-normal text-gold">{current.n}</span><span className="h-px w-8 bg-gold/60" />{current.label}</p>
                        <p className="mt-4 font-display text-3xl font-light leading-[1.05] sm:text-4xl lg:text-5xl">{current.title}</p>
                        <p className="mt-4 hidden text-sm leading-relaxed text-white/65 sm:block">{current.text}</p>
                        {stage === STAGES.length - 1 && (
                          <a href="#the-edit" className="pointer-events-auto mt-6 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide2 text-gold hover:text-white">Shop the look <ArrowDown size={14} /></a>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* stage rail (desktop) */}
              <nav aria-label="Transformation stages" className="absolute right-6 top-1/2 z-10 hidden -translate-y-1/2 lg:right-12 lg:block">
                <div className="relative pl-6">
                  <span className="absolute left-0 top-1 h-[calc(100%-8px)] w-px bg-white/15" aria-hidden />
                  <span ref={bar} className="absolute left-0 top-1 h-[calc(100%-8px)] w-px origin-top scale-y-0 bg-gold" aria-hidden />
                  <ol className="space-y-5">
                    {STAGES.map((s, i) => (
                      <li key={s.n}>
                        <button type="button" onClick={() => jumpTo(i)} aria-current={i === stage ? "step" : undefined}
                          className={cn("flex items-center gap-3 text-left text-[10px] font-semibold uppercase tracking-wide2 transition-colors duration-500", i === stage ? "text-gold" : i < stage ? "text-white/70 hover:text-gold" : "text-white/35 hover:text-white/70")}>
                          <span className="w-5 font-display text-sm normal-case italic tracking-normal">{s.n}</span>
                          <span>{s.label}</span>
                          {i < stage && <Check size={11} className="text-gold" aria-hidden />}
                        </button>
                      </li>
                    ))}
                  </ol>
                </div>
              </nav>

              {/* mobile progress */}
              <div className="absolute inset-x-0 bottom-8 z-10 lg:hidden" aria-hidden>
                <div className="container-site">
                  <div className="relative h-px w-full bg-white/15"><span ref={mbar} className="absolute inset-0 origin-left scale-x-0 bg-gold" /></div>
                  <div className="mt-2 flex justify-between font-display text-xs italic text-white/40">
                    {STAGES.map((s, i) => <span key={s.n} className={i <= stage ? "text-gold" : ""}>{s.n}</span>)}
                  </div>
                </div>
              </div>

              {/* scroll hint */}
              <a ref={hint} href="#the-edit" onClick={(e) => { e.preventDefault(); jumpTo(1); }}
                className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 text-[10px] uppercase tracking-luxe text-white/60 hover:text-gold lg:flex" aria-label="Scroll to start the transformation">
                Scroll to transform
                <span className="relative flex h-10 w-6 justify-center rounded-full border border-white/30 pt-2"><span className="h-2 w-[2px] animate-scrollDot rounded bg-gold" /></span>
              </a>
            </>
          )}

          {(showStatic || showStaticPhoto) && (
            <ol className="absolute right-6 top-1/2 z-10 hidden -translate-y-1/2 space-y-3 text-[10px] font-semibold uppercase tracking-wide2 text-white/60 lg:right-12 lg:block" aria-label="The complete look">
              {STAGES.slice(1, 5).map((s) => (
                <li key={s.n} className="flex items-center gap-3"><Check size={11} className="text-gold" aria-hidden />{s.label}</li>
              ))}
            </ol>
          )}
        </div>
      </div>

      <TheEdit />
    </section>
  );
}

function Failed({ onFail }: { onFail: () => void }) {
  useEffect(() => { onFail(); }, [onFail]);
  return null;
}

/** Still of the complete look — shown without WebGL, on low-power devices or with reduced motion. */
function StaticLook({ src = "/images/hero/look.jpg" }: { src?: string }) {
  return (
    <div className="absolute inset-0 flex items-end justify-center pb-16 lg:items-center lg:pb-0">
      <div className="relative h-[62%] w-full max-w-[520px] sm:h-[72%] lg:h-[86%]">
        <Image src={src} alt="The complete Vesture’s formal look: white shirt, charcoal trousers, leather belt, steel watch and cordovan Oxfords" fill priority sizes="(max-width: 1024px) 100vw, 520px" className="object-contain object-bottom [mask-image:radial-gradient(42%_48%_at_50%_52%,#000_62%,transparent_100%)]" />
      </div>
    </div>
  );
}

/** The five pieces, presented as the closing part of the hero. */
function TheEdit() {
  return (
    <div id="the-edit" className="relative border-t border-line bg-[#0b0b0b] py-24 lg:py-32">
      <div className="container-site">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Reveal>
            <p className="eyebrow">The Formal Edit · 05 Pieces</p>
            <h2 className="h-display mt-5 text-4xl sm:text-5xl lg:text-6xl">Everything he&apos;s wearing.</h2>
          </Reveal>
          <Reveal delay={0.1}><p className="max-w-sm text-[15px] leading-relaxed text-muted">Each piece from the transformation — wear it on its own, or together as the complete look.</p></Reveal>
        </div>

        <ul className="no-scrollbar -mx-4 mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-5 lg:gap-5">
          {EDIT.map((item, i) => {
            const product = item.slug ? getProduct(item.slug) : undefined;
            const name = product?.name ?? ("name" in item ? item.name : item.label);
            const body = (
              <>
                <div className="relative aspect-[4/5] overflow-hidden bg-surface">
                  <Image src={item.image} alt={name} fill sizes="(max-width: 640px) 75vw, (max-width: 1024px) 50vw, 20vw" className="object-cover transition-transform duration-[1.4s] ease-luxe group-hover:scale-[1.05]" />
                  <span className="absolute left-4 top-4 font-display text-sm italic text-gold">0{i + 1}</span>
                </div>
                <p className="eyebrow mt-5">{item.label}</p>
                <h3 className="mt-2 font-display text-2xl font-light leading-tight">{name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.desc}</p>
                <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-4">
                  {product ? <Price price={product.price} compareAt={product.compareAt} size="sm" /> : <span className="text-[11px] font-semibold uppercase tracking-wide2 text-white/50">Coming soon</span>}
                  {product && <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide2 text-gold">View <ArrowRight size={13} className="transition-transform duration-500 group-hover:translate-x-1" /></span>}
                </div>
              </>
            );
            return (
              <li key={item.label} className="w-[75vw] shrink-0 snap-start sm:w-auto">
                <Reveal delay={i * 0.08} className="h-full">
                  {product ? (
                    <Link href={`/product/${product.slug}`} className="group block h-full" aria-label={`${item.label}: ${name}`}>{body}</Link>
                  ) : (
                    <div className="group h-full">{body}</div>
                  )}
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

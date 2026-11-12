"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Hand, Rotate3d } from "lucide-react";
import { showcase, getProductById } from "@/data/products";
import { useShop } from "@/lib/store";
import { useCanRender3D } from "@/hooks/useCanRender3D";
import ErrorBoundary from "@/components/3d/ErrorBoundary";
import SmartImage from "@/components/ui/SmartImage";
import Price from "@/components/ui/Price";
import type { SceneControl } from "@/components/3d/ShowcaseScene";
import { cn } from "@/lib/utils";

const ShowcaseScene = dynamic(() => import("@/components/3d/ShowcaseScene"), { ssr: false });

export default function Showcase3D() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const ctrl = useRef<SceneControl>({ active: 0, local: 0, dragX: 0, dragY: 0, dragging: false });
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [mounted3D, setMounted3D] = useState(false); // lazy-mount WebGL only when the section approaches
  const [progress, setProgress] = useState(0);
  const can3D = useCanRender3D();
  const addToCart = useShop((s) => s.addToCart);
  const [lowPower, setLowPower] = useState(false);

  useEffect(() => setLowPower(window.innerWidth < 768), []);

  // scroll → active product + local progress (GSAP ScrollTrigger)
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const st = ScrollTrigger.create({
      trigger: section.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const p = self.progress * showcase.length;
        const idx = Math.min(showcase.length - 1, Math.floor(p));
        ctrl.current.active = idx;
        ctrl.current.local = Math.min(1, p - idx);
        setActive((a) => (a === idx ? a : idx));
        setProgress(self.progress);
      },
    });
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "100px" });
    const pre = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setMounted3D(true); pre.disconnect(); } }, { rootMargin: "900px 0px" });
    if (section.current) { io.observe(section.current); pre.observe(section.current); }
    return () => { st.kill(); io.disconnect(); pre.disconnect(); };
  }, []);

  // drag to rotate (mouse + touch-friendly horizontal drag)
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    let sx = 0, sy = 0, bx = 0, by = 0, down = false;
    const onDown = (e: PointerEvent) => {
      down = true; sx = e.clientX; sy = e.clientY; bx = ctrl.current.dragX; by = ctrl.current.dragY;
      ctrl.current.dragging = true; el.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      ctrl.current.dragX = bx + (e.clientX - sx) * 0.01;
      ctrl.current.dragY = Math.max(-0.6, Math.min(0.6, by + (e.clientY - sy) * 0.006));
    };
    const onUp = () => { down = false; ctrl.current.dragging = false; ctrl.current.dragY *= 0.5; };
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
  }, [can3D]);

  const jump = (i: number) => {
    const s = section.current;
    if (!s) return;
    const top = s.getBoundingClientRect().top + window.scrollY;
    const span = s.offsetHeight - window.innerHeight;
    const y = top + span * ((i + 0.35) / showcase.length);
    const l = (window as unknown as { __lenis?: { scrollTo: (y: number, o?: object) => void } }).__lenis;
    if (l) l.scrollTo(y, { duration: 1.4 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  const item = showcase[active];
  const product = getProductById(item.productId)!;

  return (
    <section ref={section} className="relative bg-[#0b0b0b]" style={{ height: `${showcase.length * 110 + 40}vh` }} aria-label="Interactive 3D product showcase">
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
        {/* atmosphere */}
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(60% 55% at 62% 50%, rgba(198,164,106,0.13), transparent 70%), radial-gradient(40% 40% at 20% 80%, rgba(139,115,85,0.10), transparent 70%)" }} />
        <div aria-hidden className="pointer-events-none absolute left-0 right-0 top-1/2 select-none text-center font-display text-[24vw] font-light leading-none tracking-[0.05em] text-white/[0.025] -translate-y-1/2">
          {item.model.toUpperCase()}
        </div>

        <div className="container-site relative z-10 flex flex-col gap-3 pt-20 sm:flex-row sm:items-center sm:justify-between sm:pt-24 lg:pt-28">
          <p className="eyebrow flex items-center gap-3"><Rotate3d size={14} /> The 3D Atelier</p>
          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0" role="tablist" aria-label="Choose product">
            {showcase.map((s, i) => (
              <button key={s.model} role="tab" aria-selected={active === i} onClick={() => jump(i)} className={cn("chip shrink-0", active === i && "chip-active")}>
                {s.eyebrow}
              </button>
            ))}
          </div>
        </div>

        <div className="container-site relative z-10 grid flex-1 grid-rows-[1fr_auto] items-center lg:grid-cols-12 lg:grid-rows-1">
          {/* stage */}
          <div ref={stage} className="relative order-1 h-full min-h-[300px] cursor-grab touch-pan-y active:cursor-grabbing lg:order-2 lg:col-span-7 lg:col-start-6" aria-label="Drag to rotate the product">
            {can3D === "yes" && !mounted3D ? (
              <StaticStage src={item.fallback} alt={product.name} />
            ) : can3D === "yes" ? (
              <ErrorBoundary fallback={<StaticStage src={item.fallback} alt={product.name} />}>
                <div className="absolute inset-0 -mx-4 sm:-mx-6 lg:-mx-12">
                  <ShowcaseScene ctrl={ctrl} active={inView} lowPower={lowPower} />
                </div>
              </ErrorBoundary>
            ) : can3D === "no" ? (
              <StaticStage src={item.fallback} alt={product.name} />
            ) : null}
            <p className="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 text-[10px] uppercase tracking-luxe text-white/45">
              <Hand size={13} /> {can3D === "no" ? "Studio view" : "Drag to rotate · Scroll to explore"}
            </p>
          </div>

          {/* info */}
          <div className="order-2 pb-10 lg:order-1 lg:col-span-5 lg:pb-0">
            <AnimatePresence mode="wait">
              <motion.div key={item.model} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
                <p className="font-display text-lg italic text-gold">0{active + 1} / 0{showcase.length} — {item.eyebrow}</p>
                <h2 className="h-display mt-3 text-4xl sm:text-5xl lg:text-7xl">{product.name}</h2>
                <p className="mt-4 hidden max-w-md text-[15px] leading-relaxed text-white/65 sm:block">{product.short}</p>
                <p className="mt-3 text-[11px] uppercase tracking-wide2 text-muted">{item.detail}</p>
                <Price price={product.price} compareAt={product.compareAt} size="lg" className="mt-6" />
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link href={`/product/${product.slug}`} className="btn-gold group">Explore Product <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" /></Link>
                  <button
                    className="btn-ghost"
                    onClick={() => (product.sizes?.length ? useShop.getState().setQuickView(product.id) : addToCart({ productId: product.id, color: product.colors[0]?.name }))}
                  >
                    Add to Cart
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* progress */}
        <div className="container-site relative z-10 pb-8">
          <div className="h-px w-full bg-white/10">
            <div className="h-px bg-gold transition-[width] duration-150" style={{ width: `${progress * 100}%` }} />
          </div>
        </div>
      </div>
    </section>
  );
}

function StaticStage({ src, alt }: { src: string; alt: string }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div key={src} className="absolute inset-0 flex items-center justify-center" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
        <div className="relative aspect-[4/5] h-[85%] max-h-[620px] overflow-hidden" style={{ maskImage: "radial-gradient(closest-side, black 70%, transparent)" }}>
          <SmartImage src={src} alt={alt} fill sizes="(max-width:1024px) 80vw, 45vw" className="object-cover" />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

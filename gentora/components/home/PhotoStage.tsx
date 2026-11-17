"use client";

/**
 * Photographic version of the hero transformation.
 * One slide per stage: full look → detail → full look … each fades in as its stage
 * begins and drifts slowly (camera push towards the piece that changed).
 */
import Image from "next/image";
import { useEffect, useRef, type MutableRefObject } from "react";
import { STAGES } from "@/components/3d/hero/stages";
import type { HeroControl } from "@/components/3d/hero/HeroScene";

const P = "/images/hero/model";

/** `focus` = where the camera pushes in (object-position + transform-origin), zoom = [start, end] */
export const MODEL_PHOTOS = [
  { src: `${P}/01-casual.jpg`, alt: "Model in a fitted charcoal T-shirt, casual trousers and white leather sneakers", focus: "50% 40%", zoom: [1, 1.05] },
  { src: `${P}/02-shirt.jpg`, alt: "Crisp white formal shirt, fitted through the body", focus: "50% 25%", zoom: [1.02, 1.1] },
  { src: `${P}/03-formal.jpg`, alt: "Tailored black formal trousers with a clean break", focus: "62% 72%", zoom: [1.25, 1.35] },
  { src: `${P}/02-shirt.jpg`, alt: "Black leather belt with a steel buckle and a steel wristwatch", focus: "70% 98%", zoom: [1.5, 1.62] },
  { src: `${P}/03-formal.jpg`, alt: "Polished black leather Oxford shoes", focus: "56% 100%", zoom: [1.9, 2.05] },
  { src: `${P}/04-suit.jpg`, alt: "The complete tailored formal look", focus: "50% 45%", zoom: [1.06, 1] },
] as const;

const FADE = 0.035;
const clamp = (v: number) => Math.min(1, Math.max(0, v));

export default function PhotoStage({ ctrl, active, onReady }: { ctrl: MutableRefObject<HeroControl>; active: boolean; onReady?: () => void }) {
  const slides = useRef<(HTMLDivElement | null)[]>([]);
  const imgs = useRef<(HTMLDivElement | null)[]>([]);
  const counter = useRef<HTMLSpanElement>(null);
  const smooth = useRef(ctrl.current.target);

  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const tick = () => {
      smooth.current += (ctrl.current.target - smooth.current) * 0.12;
      const p = smooth.current;
      let cur = 0;
      MODEL_PHOTOS.forEach((ph, i) => {
        const a = STAGES[i].at;
        const b = i < STAGES.length - 1 ? STAGES[i + 1].at : 1;
        const op = i === 0 ? 1 : clamp((p - a + FADE) / (FADE * 2));
        if (op > 0.5) cur = i;
        const local = clamp((p - a) / (b - a));
        const z = ph.zoom[0] + (ph.zoom[1] - ph.zoom[0]) * local;
        const s = slides.current[i], im = imgs.current[i];
        if (s) s.style.opacity = String(op);
        if (im) im.style.transform = `scale(${z})`;
      });
      if (counter.current) counter.current.textContent = STAGES[cur].n;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, ctrl]);

  return (
    <div className="absolute inset-0 flex items-start justify-center pt-24 lg:items-center lg:justify-end lg:pr-[19%] lg:pt-10 xl:pr-[21%]">
      <figure className="relative aspect-[3/4] h-[40svh] sm:h-[50svh] lg:h-[74svh]">
        <div className="absolute inset-0 overflow-hidden bg-[#141312] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]">
          {MODEL_PHOTOS.map((ph, i) => (
            <div key={i} ref={(el) => { slides.current[i] = el; }} className="absolute inset-0" style={{ opacity: i === 0 ? 1 : 0 }}>
              <div ref={(el) => { imgs.current[i] = el; }} className="absolute inset-0 will-change-transform" style={{ transformOrigin: ph.focus, transform: `scale(${ph.zoom[0]})` }}>
                <Image src={ph.src} alt={ph.alt} fill priority={i === 0} sizes="(max-width: 1024px) 70vw, 40vw" className="object-cover" style={{ objectPosition: ph.focus }} onLoad={i === 0 ? onReady : undefined} />
              </div>
            </div>
          ))}
          {/* cinematic grade so every photo sits in the same dark campaign */}
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_40%,transparent_55%,rgba(0,0,0,0.55)_100%)]" />
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
        {/* frame details */}
        <span aria-hidden className="pointer-events-none absolute -inset-3 border border-gold/25" />
        <figcaption className="absolute -bottom-9 right-0 hidden lg:flex items-center gap-3 text-[10px] font-semibold uppercase tracking-wide2 text-white/50" aria-hidden>
          <span ref={counter} className="font-display text-sm normal-case italic tracking-normal text-gold">01</span>
          <span className="h-px w-8 bg-white/25" /> / 06 · The Transformation
        </figcaption>
      </figure>
    </div>
  );
}

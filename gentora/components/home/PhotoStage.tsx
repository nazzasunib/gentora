"use client";

/**
 * Photographic version of the hero transformation.
 * Five frames of the SAME model, same pose, camera and light — only the outfit changes.
 * Scroll reveals each next frame from the top down with a hairline gold seam, so the
 * clothes appear to transform on the body.
 */
import Image from "next/image";
import { useEffect, useRef, type MutableRefObject } from "react";
import { T } from "@/components/3d/hero/stages";
import type { HeroControl } from "@/components/3d/hero/HeroScene";

export const MODEL_PHOTOS = [
  { src: "/images/hero/model/01-casual.jpg", alt: "Model in a fitted casual T-shirt, casual trousers and clean sneakers" },
  { src: "/images/hero/model/02-shirt.jpg", alt: "The same model now wearing a white formal shirt" },
  { src: "/images/hero/model/03-trouser.jpg", alt: "The same model in a formal shirt and tailored charcoal trousers" },
  { src: "/images/hero/model/04-belt-watch.jpg", alt: "The same model with a leather belt and a steel wristwatch added" },
  { src: "/images/hero/model/05-formal.jpg", alt: "The same model in the complete formal look with polished leather Oxford shoes" },
];

/** scroll window for each frame-to-frame transition */
const WINDOWS: [number, number][] = [T.shirt as unknown as [number, number], T.trouser as unknown as [number, number], [T.belt[0], T.watch[1]], T.shoes as unknown as [number, number]];

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => t * t * (3 - 2 * t);

export default function PhotoStage({ ctrl, active, onReady }: { ctrl: MutableRefObject<HeroControl>; active: boolean; onReady?: () => void }) {
  const layers = useRef<(HTMLDivElement | null)[]>([]);
  const seams = useRef<(HTMLSpanElement | null)[]>([]);
  const frame = useRef<HTMLDivElement>(null);
  const smooth = useRef(ctrl.current.target);

  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const tick = () => {
      smooth.current += (ctrl.current.target - smooth.current) * 0.12;
      const p = smooth.current;
      WINDOWS.forEach(([a, b], i) => {
        const t = ease(clamp((p - a) / (b - a)));
        const el = layers.current[i + 1];
        const seam = seams.current[i + 1];
        if (el) el.style.clipPath = `inset(0 0 ${(1 - t) * 100}% 0)`;
        if (seam) {
          seam.style.top = `${t * 100}%`;
          seam.style.opacity = t > 0.001 && t < 0.999 ? "1" : "0";
        }
      });
      // final stage: a slow cinematic push-in
      const fin = ease(clamp((p - T.final[0]) / (T.final[1] - T.final[0])));
      if (frame.current) frame.current.style.transform = `scale(${1 + fin * 0.06}) translateY(${fin * 1.5}%)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, ctrl]);

  return (
    <div className="absolute inset-0 flex items-end justify-center lg:justify-end lg:pr-[22%] xl:pr-[24%]">
      <div className="relative h-[86%] w-full max-w-[560px] [mask-image:radial-gradient(58%_62%_at_50%_50%,#000_70%,transparent_100%)] lg:h-[94%]">
        <div ref={frame} className="absolute inset-0 origin-bottom will-change-transform">
          {MODEL_PHOTOS.map((ph, i) => (
            <div key={ph.src} ref={(el) => { layers.current[i] = el; }} className="absolute inset-0" style={i === 0 ? undefined : { clipPath: "inset(0 0 100% 0)" }}>
              <Image src={ph.src} alt={i === 0 ? ph.alt : ""} aria-hidden={i !== 0} fill priority={i < 2} sizes="(max-width: 1024px) 100vw, 560px" className="object-contain object-bottom" onLoad={i === 0 ? onReady : undefined} />
            </div>
          ))}
          {MODEL_PHOTOS.slice(1).map((ph, k) => (
            <span key={ph.src} ref={(el) => { seams.current[k + 1] = el; }} className="pointer-events-none absolute inset-x-[10%] h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-[#E2C48E] to-transparent opacity-0 shadow-[0_0_14px_rgba(226,196,142,0.55)]" aria-hidden />
          ))}
        </div>
      </div>
    </div>
  );
}

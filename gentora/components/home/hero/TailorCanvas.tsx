"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
import { STORY, EXTS, locate, type Motion } from "./story";

interface Piece { full: HTMLCanvasElement; left: HTMLCanvasElement; right: HTMLCanvasElement }

const ease = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp = (v: number) => Math.min(1, Math.max(0, v));

function loadOne(src: string) {
  return new Promise<HTMLImageElement>((res, rej) => {
    const im = new Image();
    im.decoding = "async";
    im.onload = () => res(im);
    im.onerror = rej;
    im.src = src;
  });
}
/** tries each supported extension in turn */
async function load(base: string) {
  for (const ext of EXTS) {
    try { return await loadOne(base + ext); } catch { /* next */ }
  }
  throw new Error(`missing ${base}`);
}

/**
 * Cuts the garment that differs between two aligned renders.
 * A low-res difference map is thresholded, grown and feathered, then used as an alpha mask.
 */
function extract(prev: HTMLImageElement, next: HTMLImageElement): Piece {
  const W = next.naturalWidth, H = next.naturalHeight;
  const sw = 240, sh = Math.round((H / W) * sw);
  const small = (im: HTMLImageElement) => {
    const c = document.createElement("canvas");
    c.width = sw; c.height = sh;
    const x = c.getContext("2d", { willReadFrequently: true })!;
    x.drawImage(im, 0, 0, sw, sh);
    return x.getImageData(0, 0, sw, sh).data;
  };
  const a = small(prev), b = small(next);
  const m = new Uint8ClampedArray(sw * sh);
  for (let i = 0; i < sw * sh; i++) {
    const d = Math.abs(a[i * 4] - b[i * 4]) + Math.abs(a[i * 4 + 1] - b[i * 4 + 1]) + Math.abs(a[i * 4 + 2] - b[i * 4 + 2]);
    m[i] = d > 54 ? 255 : 0;
  }
  // close small holes: dilate twice, then erode once
  const morph = (src: Uint8ClampedArray, grow: boolean) => {
    const out = new Uint8ClampedArray(src.length);
    for (let y = 0; y < sh; y++) for (let x = 0; x < sw; x++) {
      let v = grow ? 0 : 255;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const xx = Math.min(sw - 1, Math.max(0, x + dx)), yy = Math.min(sh - 1, Math.max(0, y + dy));
        const s = src[yy * sw + xx];
        v = grow ? Math.max(v, s) : Math.min(v, s);
      }
      out[y * sw + x] = v;
    }
    return out;
  };
  const mask = morph(morph(morph(m, true), true), false);

  const mc = document.createElement("canvas");
  mc.width = sw; mc.height = sh;
  const mx = mc.getContext("2d")!;
  const img = mx.createImageData(sw, sh);
  for (let i = 0; i < sw * sh; i++) { img.data[i * 4 + 3] = mask[i]; }
  mx.putImageData(img, 0, 0);

  const full = document.createElement("canvas");
  full.width = W; full.height = H;
  const fx = full.getContext("2d")!;
  fx.drawImage(next, 0, 0);
  fx.globalCompositeOperation = "destination-in";
  fx.filter = `blur(${Math.round(W / 260)}px)`;
  fx.imageSmoothingQuality = "high";
  fx.drawImage(mc, 0, 0, W, H);

  const half = (side: 0 | 1) => {
    const c = document.createElement("canvas");
    c.width = W; c.height = H;
    const x = c.getContext("2d")!;
    x.save();
    x.beginPath();
    x.rect(side ? W / 2 : 0, 0, W / 2, H);
    x.clip();
    x.drawImage(full, 0, 0);
    x.restore();
    return c;
  };
  return { full, left: half(0), right: half(1) };
}

export default function TailorCanvas({ progress, active, onReady, onBox, onError }: {
  progress: MutableRefObject<number>;
  active: boolean;
  onReady: () => void;
  onError?: () => void;
  /** reports the drawn image box (CSS px) so the measurement overlay can align */
  onBox: (box: { x: number; y: number; w: number; h: number }) => void;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const data = useRef<{ imgs: HTMLImageElement[]; pieces: (Piece | null)[] } | null>(null);
  const smooth = useRef(0);
  const box = useRef({ x: 0, y: 0, w: 0, h: 0 });

  useEffect(() => {
    let cancelled = false;
    Promise.all(STORY.map((s) => load(s.src))).then((imgs) => {
      if (cancelled) return;
      const pieces = imgs.map((im, i) => (i === 0 ? null : extract(imgs[i - 1], im)));
      data.current = { imgs, pieces };
      onReady();
    }).catch(() => { if (!cancelled) onError?.(); });
    return () => { cancelled = true; };
  }, [onReady, onError]);

  useEffect(() => {
    if (!active) return;
    const c = canvas.current!;
    const ctx = c.getContext("2d")!;
    let raf = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = c.getBoundingClientRect();
      c.width = Math.round(r.width * dpr);
      c.height = Math.round(r.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const d = data.current;
      if (!d) return;
      const im = d.imgs[0];
      const ar = im.naturalWidth / im.naturalHeight;
      const mobile = r.width < 768;
      const h = Math.min(r.height * (mobile ? 0.62 : 0.9), (r.width * (mobile ? 0.96 : 0.6)) / ar);
      const w = h * ar;
      box.current = { x: (r.width - w) / 2, y: mobile ? r.height * 0.13 : (r.height - h) / 2 + r.height * 0.03, w, h };
      onBox(box.current);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = (src: CanvasImageSource, alpha = 1, dx = 0, dy = 0, scale = 1) => {
      if (alpha <= 0.001) return;
      const b = box.current;
      ctx.globalAlpha = alpha;
      const w = b.w * scale, h = b.h * scale;
      ctx.drawImage(src, b.x + (b.w - w) / 2 + dx, b.y + (b.h - h) / 2 + dy, w, h);
      ctx.globalAlpha = 1;
    };

    const arrive = (piece: Piece, motion: Motion, t: number) => {
      const e = ease(t), b = box.current, a = clamp(t * 1.6);
      if (motion === "drop") draw(piece.full, a, 0, -(1 - e) * b.h * 0.42, 1 + (1 - e) * 0.04);
      else if (motion === "rise") draw(piece.full, a, 0, (1 - e) * b.h * 0.3);
      else {
        draw(piece.left, a, -(1 - e) * b.w * 0.55, 0, 1 + (1 - e) * 0.03);
        draw(piece.right, a, (1 - e) * b.w * 0.55, 0, 1 + (1 - e) * 0.03);
      }
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const d = data.current;
      if (!d || !box.current.w) { if (d && !box.current.w) resize(); return; }
      smooth.current += (progress.current - smooth.current) * 0.14;
      const { i, t } = locate(smooth.current);
      const r = c.getBoundingClientRect();
      ctx.clearRect(0, 0, r.width, r.height);

      if (i === 0) {
        draw(d.imgs[0]);
        return;
      }
      // previous look underneath, new garment arrives (0 → 0.62), full render settles (0.55 → 0.75)
      const arriveT = clamp(t / 0.62);
      const settle = clamp((t - 0.55) / 0.2);
      draw(d.imgs[i - 1], 1);
      if (settle < 1) arrive(d.pieces[i]!, STORY[i].motion ?? "drop", arriveT);
      draw(d.imgs[i], settle);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [active, progress, onBox]);

  return (
    <canvas ref={canvas} aria-hidden className="absolute inset-0 h-full w-full"
      style={{ WebkitMaskImage: "radial-gradient(46% 58% at 50% 50%, #000 72%, transparent 100%)", maskImage: "radial-gradient(46% 58% at 50% 50%, #000 72%, transparent 100%)" }} />
  );
}

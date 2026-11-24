/**
 * Vesture’s hero — "The Anatomy of a Look".
 * Each state is a full studio render of the same mannequin (same framing, same light).
 * The garment that changes between two renders is cut out automatically in the browser
 * (difference mask) and animated in; the full render then settles underneath.
 *
 * Files: /public/images/hero/story/state-1 … state-4 (.jpg, .png, .webp or .jpeg) — keep them the same size
 * and pixel-aligned. Measurement marks are in % of the image box.
 */
export const EXTS = [".jpg", ".png", ".webp", ".jpeg"];

export type Motion = "drop" | "split" | "rise";

export interface StoryState {
  src: string;
  /** how this state's new garment arrives (ignored for the first state) */
  motion?: Motion;
  n: string;
  label: string;
  title: string;
  accent: string;
  text: string;
  side: "left" | "right";
  hours: number;
  fitting: 1 | 2 | 3;
}

const P = "/images/hero/story";

export const STORY: StoryState[] = [
  { src: `${P}/state-1`, n: "01", label: "The Measure", title: "It begins with", accent: "you", text: "Shoulder, chest, waist, seat, sleeve — every line taken by hand before a thread is cut.", side: "right", hours: 0, fitting: 1 },
  { src: `${P}/state-2`, motion: "drop", n: "02", label: "The Shirt", title: "Cotton, cut to", accent: "fit", text: "Crisp white poplin with a structured spread collar — the foundation of every formal look.", side: "right", hours: 8, fitting: 1 },
  { src: `${P}/state-3`, motion: "split", n: "03", label: "The Waistcoat", title: "Structure, held", accent: "close", text: "A charcoal waistcoat cut close to the body, and a silk tie that falls straight and never twists.", side: "left", hours: 26, fitting: 2 },
  { src: `${P}/state-4`, motion: "split", n: "04", label: "The Jacket", title: "The finishing", accent: "line", text: "A tailored jacket closes the silhouette — sharp shoulders, clean lapels, nothing extra.", side: "right", hours: 54, fitting: 3 },
];

/** six measurement lines drawn over the bare mannequin, in % of the image box */
export const MEASURES = [
  { label: "SHOULDER 46.5", x1: 27, y1: 23.5, x2: 73, y2: 23.5, lx: 50, ly: 21.5 },
  { label: "CHEST 102", x1: 31, y1: 37, x2: 69, y2: 37, lx: 50, ly: 35 },
  { label: "WAIST 86", x1: 34.5, y1: 52, x2: 65.5, y2: 52, lx: 50, ly: 50 },
  { label: "SEAT 100", x1: 33.5, y1: 70, x2: 66.5, y2: 70, lx: 50, ly: 68 },
  { label: "SLEEVE 64.5", x1: 24, y1: 25, x2: 19.5, y2: 75, lx: 12, ly: 50 },
  { label: "BACK 76", x1: 50, y1: 15, x2: 50, y2: 76, lx: 56, ly: 60 },
] as const;

/** scroll budget: intro, then one equal segment per state, then a short hold */
export const INTRO = 0.1;
export const HOLD = 0.06;
export const seg = () => (1 - INTRO - HOLD) / STORY.length;

/** index of the state in view and progress inside it */
export function locate(p: number) {
  const s = seg();
  const x = Math.max(0, p - INTRO) / s;
  const i = Math.min(STORY.length - 1, Math.floor(x));
  return { i, t: Math.min(1, x - i) };
}

/** Scroll timeline of the hero transformation (progress 0 → 1). */
export const T = {
  shirt: [0.08, 0.27] as const,
  trouser: [0.3, 0.48] as const,
  belt: [0.51, 0.6] as const,
  watch: [0.57, 0.66] as const,
  shoes: [0.69, 0.85] as const,
  final: [0.87, 0.97] as const,
};

export const STAGES = [
  { n: "01", label: "Premium Casual", title: "Off duty, still sharp.", text: "A fitted tee, relaxed stone trousers and clean leather sneakers.", at: 0 },
  { n: "02", label: "Formal Shirt", title: "The shirt that sets the tone.", text: "The tee gives way to crisp white poplin with a structured collar.", at: T.shirt[0] },
  { n: "03", label: "Tailored Trouser", title: "Cut for authority.", text: "Relaxed trousers become charcoal wool-blend, tailored to a clean break.", at: T.trouser[0] },
  { n: "04", label: "Belt & Watch", title: "Details that speak first.", text: "Full-grain leather at the waist, a steel timepiece at the wrist.", at: T.belt[0] },
  { n: "05", label: "Formal Shoes", title: "Grounded in leather.", text: "Sneakers turn to hand-polished cordovan Oxfords.", at: T.shoes[0] },
  { n: "06", label: "The Complete Look", title: "Dress sharp. Lead with confidence.", text: "Five pieces, one confident silhouette — ready for the boardroom.", at: T.final[0] },
] as const;

export const stageAt = (p: number) => {
  let s = 0;
  STAGES.forEach((st, i) => { if (p >= st.at) s = i; });
  return s;
};

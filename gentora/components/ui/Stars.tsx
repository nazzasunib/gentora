import { Star } from "lucide-react";

export default function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`Rated ${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} width={size} height={size} strokeWidth={1.5} className={i <= Math.round(value) ? "fill-gold text-gold" : "text-white/25"} />
      ))}
    </span>
  );
}

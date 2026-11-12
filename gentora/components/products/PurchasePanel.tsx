"use client";

import { useState } from "react";
import { Heart, Minus, Plus, Check } from "lucide-react";
import type { Product } from "@/lib/types";
import { useShop } from "@/lib/store";
import { useHydrated } from "@/hooks/useHydrated";
import { cn } from "@/lib/utils";

export function QtyStepper({ value, onChange, min = 1, max = 10, small }: { value: number; onChange: (n: number) => void; min?: number; max?: number; small?: boolean }) {
  return (
    <div className={cn("inline-flex items-center border border-white/15", small ? "h-9" : "h-12")}>
      <button type="button" aria-label="Decrease quantity" className={cn("flex h-full items-center justify-center text-white/70 hover:text-gold disabled:opacity-30", small ? "w-8" : "w-11")} onClick={() => onChange(value - 1)} disabled={value <= min}>
        <Minus size={14} />
      </button>
      <span className={cn("text-center text-sm tabular-nums", small ? "w-7" : "w-10")} aria-live="polite">{value}</span>
      <button type="button" aria-label="Increase quantity" className={cn("flex h-full items-center justify-center text-white/70 hover:text-gold disabled:opacity-30", small ? "w-8" : "w-11")} onClick={() => onChange(value + 1)} disabled={value >= max}>
        <Plus size={14} />
      </button>
    </div>
  );
}

export default function PurchasePanel({ product, onAdded, compact }: { product: Product; onAdded?: () => void; compact?: boolean }) {
  const { addToCart, toggleWishlist, wishlist } = useShop();
  const hydrated = useHydrated();
  const [color, setColor] = useState(product.colors[0]?.name);
  const [size, setSize] = useState<string | undefined>(undefined);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);
  const wished = hydrated && wishlist.includes(product.id);
  const needsSize = !!product.sizes?.length;
  const sizeLabel = product.category === "shirts" ? "Size" : product.category === "pants" ? "Waist (in)" : "Belt size (in)";

  const add = () => {
    if (needsSize && !size) {
      setError(`Please select a ${sizeLabel.toLowerCase()}.`);
      return;
    }
    setError("");
    addToCart({ productId: product.id, size, color, qty }, { open: !compact });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
    onAdded?.();
  };

  return (
    <div className="space-y-7">
      {product.colors.length > 0 && (
        <fieldset>
          <legend className="mb-3 text-[11px] font-semibold uppercase tracking-wide2 text-muted">
            Colour — <span className="text-white">{color}</span>
          </legend>
          <div className="flex flex-wrap gap-3">
            {product.colors.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setColor(c.name)}
                aria-pressed={color === c.name}
                aria-label={c.name}
                title={c.name}
                className={cn("h-9 w-9 rounded-full border p-[3px] transition-all", color === c.name ? "border-gold" : "border-white/15 hover:border-white/40")}
              >
                <span className="block h-full w-full rounded-full ring-1 ring-inset ring-white/10" style={{ background: c.hex }} />
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {needsSize && (
        <fieldset>
          <div className="mb-3 flex items-center justify-between">
            <legend className="text-[11px] font-semibold uppercase tracking-wide2 text-muted">{sizeLabel}</legend>
            <a href="/help/faq#sizing" className="text-[11px] uppercase tracking-wide2 text-white/60 underline-offset-4 hover:text-gold hover:underline">Size guide</a>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizes!.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => { setSize(s); setError(""); }}
                aria-pressed={size === s}
                className={cn("h-11 min-w-[52px] border px-3 text-sm transition-colors", size === s ? "border-gold bg-gold text-ink" : "border-white/15 text-white/85 hover:border-gold")}
              >
                {s}
              </button>
            ))}
          </div>
          {error && <p role="alert" className="mt-3 text-sm text-[#E8A08A]">{error}</p>}
        </fieldset>
      )}

      <div className="flex flex-wrap items-stretch gap-3">
        <QtyStepper value={qty} onChange={setQty} />
        <button type="button" onClick={add} className="btn-gold h-12 flex-1 py-0">
          {added ? (<><Check size={16} /> Added</>) : "Add to Cart"}
        </button>
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-pressed={wished}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          className={cn("flex h-12 w-12 items-center justify-center border transition-colors", wished ? "border-gold text-gold" : "border-white/15 text-white/80 hover:border-gold hover:text-gold")}
        >
          <Heart size={18} strokeWidth={1.5} className={wished ? "fill-gold" : ""} />
        </button>
      </div>
    </div>
  );
}

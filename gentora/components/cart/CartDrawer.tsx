"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { ShoppingBag, Trash2, X } from "lucide-react";
import { cartTotals, useShop } from "@/lib/store";
import { useHydrated } from "@/hooks/useHydrated";
import SmartImage from "@/components/ui/SmartImage";
import { QtyStepper } from "@/components/products/PurchasePanel";
import { formatBDT, SITE } from "@/lib/utils";

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, setQty, removeFromCart } = useShop();
  const hydrated = useHydrated();
  const { lines, subtotal, count } = cartTotals(hydrated ? cart : []);
  const remaining = Math.max(0, SITE.freeShippingThreshold - subtotal);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setCartOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setCartOpen]);

  return (
    <AnimatePresence>
      {cartOpen && (
        <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Shopping cart">
          <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCartOpen(false)} />
          <motion.aside
            className="absolute right-0 top-0 flex h-full w-full max-w-[440px] flex-col border-l border-line bg-surface"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <h2 className="font-display text-2xl">Your Cart <span className="text-muted">({count})</span></h2>
              <button aria-label="Close cart" onClick={() => setCartOpen(false)} className="p-2 text-white/70 hover:text-gold" autoFocus>
                <X size={20} />
              </button>
            </div>

            {lines.length > 0 && (
              <div className="border-b border-line px-6 py-4">
                <p className="text-xs text-muted">
                  {remaining > 0 ? <>Add <span className="text-gold">{formatBDT(remaining)}</span> more for complimentary delivery.</> : <span className="text-gold">You&apos;ve unlocked complimentary delivery.</span>}
                </p>
                <div className="mt-2 h-[2px] bg-white/10">
                  <motion.div className="h-full bg-gold" initial={false} animate={{ width: `${Math.min(100, (subtotal / SITE.freeShippingThreshold) * 100)}%` }} />
                </div>
              </div>
            )}

            <div className="no-scrollbar flex-1 overflow-y-auto px-6" data-lenis-prevent>
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-5 text-center">
                  <ShoppingBag size={36} strokeWidth={1} className="text-gold" />
                  <p className="font-display text-2xl">Your cart is empty</p>
                  <p className="max-w-[260px] text-sm text-muted">Start with the essentials — a crisp shirt, a sharp trouser.</p>
                  <Link href="/shop" onClick={() => setCartOpen(false)} className="btn-gold mt-2">Explore Collection</Link>
                </div>
              ) : (
                <ul className="divide-y divide-line">
                  <AnimatePresence initial={false}>
                    {lines.map((l) => (
                      <motion.li key={l.key} layout initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, height: 0 }} className="flex gap-4 py-5">
                        <Link href={`/product/${l.product.slug}`} onClick={() => setCartOpen(false)} className="relative h-28 w-22 shrink-0 overflow-hidden bg-ink" style={{ width: 88 }}>
                          <SmartImage src={l.product.images[0]} alt={l.product.name} fill sizes="88px" className="object-cover" fallbackLabel=" " />
                        </Link>
                        <div className="flex flex-1 flex-col">
                          <div className="flex justify-between gap-3">
                            <Link href={`/product/${l.product.slug}`} onClick={() => setCartOpen(false)} className="text-sm font-medium leading-snug hover:text-gold">{l.product.name}</Link>
                            <button aria-label={`Remove ${l.product.name}`} onClick={() => removeFromCart(l.key)} className="text-white/40 hover:text-gold"><Trash2 size={15} /></button>
                          </div>
                          <p className="mt-1 text-xs text-muted">{[l.color, l.size && `Size ${l.size}`].filter(Boolean).join(" · ")}</p>
                          <div className="mt-auto flex items-center justify-between pt-3">
                            <QtyStepper small value={l.qty} min={0} onChange={(n) => setQty(l.key, n)} />
                            <span className="text-sm font-semibold tabular-nums">{formatBDT(l.product.price * l.qty)}</span>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {lines.length > 0 && (
              <div className="border-t border-line px-6 py-6">
                <div className="flex justify-between text-sm"><span className="text-muted">Subtotal</span><span className="font-semibold tabular-nums">{formatBDT(subtotal)}</span></div>
                <p className="mt-1 text-xs text-muted">Delivery calculated at checkout.</p>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <Link href="/cart" onClick={() => setCartOpen(false)} className="btn-ghost px-3">View Cart</Link>
                  <Link href="/checkout" onClick={() => setCartOpen(false)} className="btn-gold px-3">Checkout</Link>
                </div>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

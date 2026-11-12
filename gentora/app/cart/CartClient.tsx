"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ShoppingBag, Trash2 } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import SmartImage from "@/components/ui/SmartImage";
import { QtyStepper } from "@/components/products/PurchasePanel";
import { cartTotals, useShop } from "@/lib/store";
import { useHydrated } from "@/hooks/useHydrated";
import { formatBDT, SITE } from "@/lib/utils";

export function orderMath({ subtotal }: { subtotal: number }) {
  const shipping = subtotal === 0 || subtotal >= SITE.freeShippingThreshold ? 0 : SITE.shippingFee;
  return { shipping, total: subtotal + shipping };
}

export default function CartClient() {
  const hydrated = useHydrated();
  const { cart, setQty, removeFromCart, clearCart } = useShop();
  const { lines, subtotal, count } = cartTotals(hydrated ? cart : []);
  const { shipping, total } = orderMath({ subtotal });

  return (
    <>
      <PageHeader title="Your Cart" crumbs={[{ label: "Cart" }]} />
      <section className="bg-ink pb-32 pt-12">
        <div className="container-site">
          {!hydrated ? (
            <div className="h-64 animate-shimmer bg-[linear-gradient(90deg,#1a1a1a,#222,#1a1a1a)] bg-[length:200%_100%]" />
          ) : lines.length === 0 ? (
            <div className="flex flex-col items-center gap-5 py-24 text-center">
              <ShoppingBag size={40} strokeWidth={1} className="text-gold" />
              <p className="font-display text-4xl">Your cart is empty</p>
              <Link href="/shop" className="btn-gold mt-2">Explore Collection</Link>
            </div>
          ) : (
            <div className="grid gap-12 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <div className="hidden grid-cols-[1fr_140px_120px_40px] gap-4 border-b border-line pb-4 text-[11px] uppercase tracking-wide2 text-muted md:grid">
                  <span>Product</span><span>Quantity</span><span className="text-right">Total</span><span />
                </div>
                <ul>
                  <AnimatePresence initial={false}>
                    {lines.map((l) => (
                      <motion.li key={l.key} layout exit={{ opacity: 0, height: 0 }} className="grid grid-cols-[88px_1fr] gap-4 border-b border-line py-6 md:grid-cols-[1fr_140px_120px_40px] md:items-center">
                        <div className="flex gap-5 md:col-span-1">
                          <Link href={`/product/${l.product.slug}`} className="relative h-28 w-[88px] shrink-0 overflow-hidden bg-surface">
                            <SmartImage src={l.product.images[0]} alt={l.product.name} fill sizes="88px" className="object-cover" fallbackLabel=" " />
                          </Link>
                          <div className="hidden md:block">
                            <Link href={`/product/${l.product.slug}`} className="font-medium hover:text-gold">{l.product.name}</Link>
                            <p className="mt-1 text-xs text-muted">{[l.color, l.size && `Size ${l.size}`].filter(Boolean).join(" · ")}</p>
                            <p className="mt-2 text-sm">{formatBDT(l.product.price)}</p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-3 md:contents">
                          <div className="md:hidden">
                            <Link href={`/product/${l.product.slug}`} className="font-medium">{l.product.name}</Link>
                            <p className="mt-1 text-xs text-muted">{[l.color, l.size && `Size ${l.size}`].filter(Boolean).join(" · ")}</p>
                          </div>
                          <QtyStepper small value={l.qty} min={0} onChange={(n) => setQty(l.key, n)} />
                          <span className="font-semibold tabular-nums md:text-right">{formatBDT(l.product.price * l.qty)}</span>
                          <button onClick={() => removeFromCart(l.key)} aria-label={`Remove ${l.product.name}`} className="w-fit text-white/40 hover:text-gold md:justify-self-end"><Trash2 size={16} /></button>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
                <div className="mt-6 flex justify-between">
                  <Link href="/shop" className="link-underline text-[11px] font-semibold uppercase tracking-wide2 text-gold">Continue shopping</Link>
                  <button onClick={clearCart} className="text-[11px] uppercase tracking-wide2 text-muted hover:text-white">Clear cart</button>
                </div>
              </div>
              <aside className="lg:col-span-4">
                <div className="sticky top-28 border border-line bg-surface p-8">
                  <h2 className="font-display text-3xl">Order Summary</h2>
                  <dl className="mt-6 space-y-3 text-sm">
                    <div className="flex justify-between"><dt className="text-muted">Subtotal ({count} items)</dt><dd className="tabular-nums">{formatBDT(subtotal)}</dd></div>
                    <div className="flex justify-between"><dt className="text-muted">Delivery</dt><dd>{shipping === 0 ? <span className="text-gold">Complimentary</span> : formatBDT(shipping)}</dd></div>
                    <div className="flex justify-between border-t border-line pt-4 text-base font-semibold"><dt>Total</dt><dd className="tabular-nums">{formatBDT(total)}</dd></div>
                  </dl>
                  <Link href="/checkout" className="btn-gold mt-8 w-full">Proceed to Checkout <ArrowRight size={15} /></Link>
                  <p className="mt-4 text-center text-[11px] text-muted">Demo checkout — no payment will be taken.</p>
                </div>
              </aside>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

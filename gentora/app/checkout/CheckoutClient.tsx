"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Lock } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import SmartImage from "@/components/ui/SmartImage";
import { cartTotals, useShop } from "@/lib/store";
import { useHydrated } from "@/hooks/useHydrated";
import { formatBDT, SITE, cn } from "@/lib/utils";
import type { CartItem } from "@/lib/types";

type Form = { name: string; email: string; phone: string; address: string; city: string; area: string; postcode: string; notes: string; payment: "cod" | "card" };
const EMPTY: Form = { name: "", email: "", phone: "", address: "", city: "Dhaka", area: "", postcode: "", notes: "", payment: "cod" };

function validate(f: Form) {
  const e: Partial<Record<keyof Form, string>> = {};
  if (f.name.trim().length < 2) e.name = "Please enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email)) e.email = "Enter a valid email address.";
  if (!/^(\+?88)?01[3-9]\d{8}$/.test(f.phone.replace(/[\s-]/g, ""))) e.phone = "Enter a valid Bangladeshi mobile number (e.g. 01XXXXXXXXX).";
  if (f.address.trim().length < 6) e.address = "Please enter your street address.";
  if (!f.city.trim()) e.city = "Required.";
  if (!f.area.trim()) e.area = "Required.";
  return e;
}

export default function CheckoutClient() {
  const hydrated = useHydrated();
  const { cart, clearCart } = useShop();
  const { lines, subtotal, count } = cartTotals(hydrated ? cart : []);
  const shipping = subtotal >= SITE.freeShippingThreshold ? 0 : SITE.shippingFee;
  const total = subtotal + shipping;
  const [f, setF] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [order, setOrder] = useState<null | { id: string; total: number; items: (CartItem & { name: string; price: number })[]; name: string; email: string }>(null);

  const field = (k: keyof Form) => ({
    id: `co-${k}`,
    value: f[k] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { setF({ ...f, [k]: e.target.value }); if (errors[k]) setErrors({ ...errors, [k]: undefined }); },
    "aria-invalid": !!errors[k],
    "aria-describedby": errors[k] ? `co-${k}-err` : undefined,
    className: cn("input", errors[k] && "border-[#B4533A]"),
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(f);
    setErrors(errs);
    if (Object.keys(errs).length) {
      document.getElementById(`co-${Object.keys(errs)[0]}`)?.focus();
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setOrder({ id: `GT-DEMO-${Math.floor(100000 + Math.random() * 900000)}`, total, name: f.name, email: f.email, items: lines.map((l) => ({ ...l, name: l.product.name, price: l.product.price })) });
      clearCart();
      setSubmitting(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1200);
  };

  const Label = ({ k, children }: { k: keyof Form; children: React.ReactNode }) => (
    <label htmlFor={`co-${k}`} className="mb-2 block text-[11px] font-semibold uppercase tracking-wide2 text-muted">{children}</label>
  );
  const Err = ({ k }: { k: keyof Form }) => (errors[k] ? <p id={`co-${k}-err`} className="mt-2 text-xs text-[#B4533A]">{errors[k]}</p> : null);

  if (order) {
    return (
      <section className="flex min-h-screen items-center bg-ink pb-24 pt-36">
        <motion.div className="container-site max-w-2xl text-center" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
          <CheckCircle2 size={56} strokeWidth={1} className="mx-auto text-gold" />
          <p className="eyebrow mt-8">Demo order confirmed</p>
          <h1 className="h-display mt-4 text-5xl sm:text-6xl">Thank you, {order.name.split(" ")[0]}.</h1>
          <p className="mt-6 text-muted">Order reference <span className="font-semibold text-white">{order.id}</span></p>
          <div className="mx-auto mt-10 max-w-md border border-line bg-surface p-6 text-left">
            <ul className="divide-y divide-line text-sm">
              {order.items.map((i) => (
                <li key={i.key} className="flex justify-between gap-4 py-3"><span>{i.name} × {i.qty}<span className="block text-xs text-muted">{[i.color, i.size].filter(Boolean).join(" · ")}</span></span><span className="tabular-nums">{formatBDT(i.price * i.qty)}</span></li>
              ))}
            </ul>
            <p className="mt-4 flex justify-between border-t border-line pt-4 font-semibold"><span>Total</span><span>{formatBDT(order.total)}</span></p>
          </div>
          <p className="mx-auto mt-8 flex max-w-md items-start gap-3 border border-gold/30 p-4 text-left text-xs text-white/70">
            <AlertTriangle size={16} className="mt-0.5 shrink-0 text-gold" />
            This is a demonstration storefront. No order was placed, no payment was taken and no confirmation email was sent to {order.email}.
          </p>
          <Link href="/shop" className="btn-gold mt-10">Continue Shopping</Link>
        </motion.div>
      </section>
    );
  }

  return (
    <>
      <PageHeader title="Checkout" crumbs={[{ label: "Cart", href: "/cart" }, { label: "Checkout" }]} />
      <section className="bg-ink pb-32 pt-10">
        <div className="container-site">
          <p className="mb-10 flex items-center gap-3 border border-gold/30 bg-gold/5 px-5 py-4 text-sm text-white/80">
            <AlertTriangle size={17} className="shrink-0 text-gold" /> Demo checkout — no real payment is processed and no order is placed.
          </p>
          {hydrated && lines.length === 0 ? (
            <div className="py-20 text-center">
              <p className="font-display text-4xl">Your cart is empty</p>
              <Link href="/shop" className="btn-gold mt-8">Explore Collection</Link>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="grid gap-12 lg:grid-cols-12">
              <div className="space-y-12 lg:col-span-7">
                <fieldset>
                  <legend className="mb-6 font-display text-3xl">1. Customer information</legend>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2"><Label k="name">Full name *</Label><input {...field("name")} autoComplete="name" /><Err k="name" /></div>
                    <div><Label k="email">Email *</Label><input {...field("email")} type="email" autoComplete="email" /><Err k="email" /></div>
                    <div><Label k="phone">Mobile number *</Label><input {...field("phone")} type="tel" autoComplete="tel" placeholder="01XXXXXXXXX" /><Err k="phone" /></div>
                  </div>
                </fieldset>
                <fieldset>
                  <legend className="mb-6 font-display text-3xl">2. Delivery address</legend>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2"><Label k="address">Street address *</Label><input {...field("address")} autoComplete="street-address" placeholder="House, road, block" /><Err k="address" /></div>
                    <div><Label k="area">Area *</Label><input {...field("area")} placeholder="e.g. Gulshan" /><Err k="area" /></div>
                    <div><Label k="city">City *</Label><input {...field("city")} autoComplete="address-level2" /><Err k="city" /></div>
                    <div><Label k="postcode">Postcode</Label><input {...field("postcode")} autoComplete="postal-code" inputMode="numeric" /></div>
                    <div className="sm:col-span-2"><Label k="notes">Delivery notes</Label><textarea {...field("notes")} rows={3} /></div>
                  </div>
                </fieldset>
                <fieldset>
                  <legend className="mb-6 font-display text-3xl">3. Payment</legend>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {([["cod", "Cash on delivery", "Pay when your order arrives"], ["card", "Card / mobile banking", "Not connected in this demo"]] as const).map(([id, t, d]) => (
                      <label key={id} className={cn("flex cursor-pointer items-start gap-3 border p-5 transition-colors", f.payment === id ? "border-gold" : "border-white/15 hover:border-white/30")}>
                        <input type="radio" name="payment" value={id} checked={f.payment === id} onChange={() => setF({ ...f, payment: id })} className="mt-1 accent-[#C6A46A]" />
                        <span><span className="block text-sm font-medium">{t}</span><span className="text-xs text-muted">{d}</span></span>
                      </label>
                    ))}
                  </div>
                  <p className="mt-4 flex items-center gap-2 text-xs text-muted"><Lock size={13} /> No payment gateway is integrated. Nothing will be charged.</p>
                </fieldset>
              </div>

              <aside className="lg:col-span-5">
                <div className="sticky top-28 border border-line bg-surface p-8">
                  <h2 className="font-display text-3xl">Order Summary <span className="text-lg text-muted">({count})</span></h2>
                  <ul className="mt-6 max-h-[320px] divide-y divide-line overflow-y-auto" data-lenis-prevent>
                    {lines.map((l) => (
                      <li key={l.key} className="flex gap-4 py-4">
                        <span className="relative h-20 w-16 shrink-0 overflow-hidden bg-ink">
                          <SmartImage src={l.product.images[0]} alt="" fill sizes="64px" className="object-cover" fallbackLabel=" " />
                          <span className="absolute right-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-on-gold">{l.qty}</span>
                        </span>
                        <span className="flex-1 text-sm">{l.product.name}<span className="block text-xs text-muted">{[l.color, l.size && `Size ${l.size}`].filter(Boolean).join(" · ")}</span></span>
                        <span className="text-sm tabular-nums">{formatBDT(l.product.price * l.qty)}</span>
                      </li>
                    ))}
                  </ul>
                  <dl className="mt-4 space-y-3 border-t border-line pt-5 text-sm">
                    <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd className="tabular-nums">{formatBDT(subtotal)}</dd></div>
                    <div className="flex justify-between"><dt className="text-muted">Delivery</dt><dd>{shipping === 0 ? <span className="text-gold">Complimentary</span> : formatBDT(shipping)}</dd></div>
                    <div className="flex justify-between border-t border-line pt-4 text-lg font-semibold"><dt>Total</dt><dd className="tabular-nums">{formatBDT(total)}</dd></div>
                  </dl>
                  <AnimatePresence>
                    {Object.values(errors).some(Boolean) && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="alert" className="mt-5 text-xs text-[#B4533A]">Please correct the highlighted fields.</motion.p>
                    )}
                  </AnimatePresence>
                  <button type="submit" disabled={submitting || !hydrated} className="btn-gold mt-6 w-full">{submitting ? "Placing demo order…" : "Place Demo Order"}</button>
                  <p className="mt-3 text-center text-[11px] text-muted">Demo only · no payment processed</p>
                </div>
              </aside>
            </form>
          )}
        </div>
      </section>
    </>
  );
}

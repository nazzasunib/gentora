"use client";

import Link from "next/link";
import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { cn } from "@/lib/utils";

export default function AccountClient() {
  const [tab, setTab] = useState<"in" | "up">("in");
  const [sent, setSent] = useState(false);
  return (
    <>
      <PageHeader title="Account" crumbs={[{ label: "Account" }]} />
      <section className="bg-ink pb-32 pt-12">
        <div className="container-site grid gap-16 lg:grid-cols-2">
          <div className="max-w-md">
            <div className="mb-8 flex gap-6 border-b border-line">
              {(["in", "up"] as const).map((t) => (
                <button key={t} onClick={() => { setTab(t); setSent(false); }} className={cn("-mb-px border-b pb-4 text-[12px] font-semibold uppercase tracking-wide2", tab === t ? "border-gold text-gold" : "border-transparent text-muted hover:text-white")}>
                  {t === "in" ? "Sign in" : "Create account"}
                </button>
              ))}
            </div>
            {sent ? (
              <p className="flex items-start gap-3 border border-gold/30 p-5 text-sm text-white/80"><AlertTriangle size={16} className="mt-0.5 shrink-0 text-gold" /> Accounts are not connected in this demo storefront. Your cart and wishlist are saved on this device automatically.</p>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-5">
                {tab === "up" && <div><label htmlFor="ac-name" className="mb-2 block text-[11px] uppercase tracking-wide2 text-muted">Full name</label><input id="ac-name" required className="input" autoComplete="name" /></div>}
                <div><label htmlFor="ac-email" className="mb-2 block text-[11px] uppercase tracking-wide2 text-muted">Email</label><input id="ac-email" type="email" required className="input" autoComplete="email" /></div>
                <div><label htmlFor="ac-pass" className="mb-2 block text-[11px] uppercase tracking-wide2 text-muted">Password</label><input id="ac-pass" type="password" required minLength={6} className="input" autoComplete={tab === "in" ? "current-password" : "new-password"} /></div>
                <button className="btn-gold w-full">{tab === "in" ? "Sign in" : "Create account"}</button>
                <p className="text-center text-[11px] text-muted">Demo only — no account is created and no data is sent.</p>
              </form>
            )}
          </div>
          <div className="border border-line bg-surface p-10">
            <p className="eyebrow">Member benefits</p>
            <h2 className="h-display mt-4 text-4xl">The GENTORA circle</h2>
            <ul className="mt-6 space-y-3 text-sm text-white/70">
              <li>— Early access to new collections</li>
              <li>— Order tracking and easy returns</li>
              <li>— Saved sizes for faster checkout</li>
            </ul>
            <div className="mt-8 flex gap-3"><Link href="/wishlist" className="btn-ghost">Wishlist</Link><Link href="/cart" className="btn-ghost">Cart</Link></div>
          </div>
        </div>
      </section>
    </>
  );
}
